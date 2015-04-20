package helpers;

import models.*;

import java.util.List;

/**
 * Created by knarf on 20/04/15.
 */
public class SimulationHelper {

    Simulation simulation;

    ConsumerHelper consumerHelper;

    /**
     * This method simulates the trafic flow from the producers, through all the cosumers.
     *
     * Changelog:
     *
     * 13.02.2015, Kristine: The algorithm uses one list of producers and one list of consumers to add entities to
     * and remove entities from the list over entities. It uses the list of entities to check which one has the
     * highest waiting time at the end of the simulation.
     *
     * @return A {@link models.SimulationResult} object with entities consumed, entities left in queue and max waiting time.
     */
    public void simulate(Simulation simulation) {

        this.simulation = simulation;
        consumerHelper = new ConsumerHelper();

        int maxWaitingTime = 0;

        for(int i = simulation.getStartTick(); i < simulation.getStartTick() + simulation.getTicks(); i++) {

            // Increase waiting time
            simulation.getConsumers().forEach(ConsumerHelper::increaseWaitingTime);

            addEntitiesFromProducer(i);

            addEntitiesFromConsumers();

            consumeEntities();

            maxWaitingTime = calculateWaitingTime(maxWaitingTime);

        }

        simulation.setResult(
                new SimulationResult(
                        getEntitesConsumed(),
                        getEntitiesInQueue(),
                        maxWaitingTime
                )
        );
    }

    /**
     * Takes the list of entities and deletes them from the list of entities according to the number and strength of
     * the consumers registered in the simulation. Every time an entity is deleted, the method adds 1 to the number of
     * entities consumed.
     * @return The number of entities consumed so far in the simulation + the number of entities consumed during the
     *         running of the method.
     */
    private void consumeEntities() {

        // Consume entities in queue on Consumer
        for(int i = 0; i < simulation.getConsumers().size(); i++) {

            consumerHelper.consumeEntity(simulation.getConsumers().get(i));
        }

        // Consume entities in queue on a ConsumerGroup
        for(ConsumerGroup consumerGroup : simulation.getConsumerGroups()) {

            // Distribute the Entities to the Consumers
            // All have equal weight, so relationships are not needed (they use the ConsumerGroup relationship)

            // Get the current entites in queue on current ConsumerGroup
            List<Entity> entitiesToDistribute = consumerGroup.getEntitesInQueue();

            // Take each entity, add it to the queue for a spesific Consumer, and remove it from the list of entities in
            // queue on the current ConsumerGroup
            // Continues to iterate though the Entities untill all have been distributed
            while(!entitiesToDistribute.isEmpty()) {

                for(Consumer consumer : consumerGroup.getConsumers()) {

                    List<Entity> entitiesInQueue = consumer.getEntitesInQueue();
                    entitiesInQueue.add(entitiesToDistribute.get(0));
                    entitiesToDistribute.remove(0);
                    consumer.setEntitesInQueue(entitiesInQueue);
                }
            }

            // Loop through the Consumes in the current ConsumerGroup and consume Entities in queue on the current
            // Consumer
            for(int i = 0; i < consumerGroup.getConsumers().size(); i++) {

                consumerHelper.consumeEntity(consumerGroup.getConsumers().get(i));
            }
        }
    }

    /**
     * Adds entities to the list of entities according to the number and strength of the producers registered in the
     * simulation.
     *
     * @param currentTick The current tick number the simulation is on, to check if it is time for the producer to
     *                    produce entities.
     */
    private void addEntitiesFromProducer(int currentTick) {

        for(Producer producer : simulation.getProducers()) {

            models.Timetable timetable = producer.getTimetable();

            for(int i = 0; i < timetable.getArrivals().size(); i++) {

                if(timetable.getArrivals().get(i).getTime() == currentTick) {

                    for (int j = 0; j < timetable.getArrivals().get(i).getPassengers(); j++) {

                        for (Relationship relationship : simulation.getRelationships()) {

                            if(relationship.getSource() == producer) {

                                int recieved = relationship.getTarget().getEntitiesRecieved();

                                double currentWeight = (double) recieved / relationship.getSource().getEntitiesTransfered();

                                if (currentWeight <= relationship.getWeight() || relationship.getSource().getEntitiesTransfered() == 0) {

                                    Consumer consumer = null;

                                    for(int k = 0; k < simulation.getConsumers().size(); k++) {

                                        Consumer con = simulation.getConsumers().get(k);

                                        if(con == relationship.getTarget()) {
                                            consumer = con;
                                        }
                                    }

                                    for(int k = 0; k < simulation.getConsumerGroups().size(); k++) {

                                        Consumer con = simulation.getConsumerGroups().get(k);

                                        if(con == relationship.getTarget()) {
                                            consumer = con;
                                        }
                                    }

                                    consumerHelper.addEntity(consumer, new Entity());
                                    consumer.setEntitiesRecieved(consumer.getEntitiesRecieved() + 1);

                                    producer.setEntitiesTransfered(producer.getEntitiesTransfered() + 1);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private void addEntitiesFromConsumers() {

        // Current consumer sending entities

        for(Relationship relationship : simulation.getRelationships()) {

            simulation.getConsumers().stream().filter(consumer
                    -> relationship.getTarget() == consumer).forEach(consumer
                    -> sendEntitiesFromConsumer(relationship));

            simulation.getConsumerGroups().stream().filter(consumerGroup
                    -> relationship.getTarget() == consumerGroup).forEach(consumerGroup
                    -> sendEntitiesFromConsumer(relationship));
        }
    }

    private void sendEntitiesFromConsumer(Relationship relationship) {

        // If the consumer has any entities to send
        if(relationship.getSource().getEntitiesReady().size() != 0) {

            // The percentage of entities already sent from our sending consumer to the receiving consumer
            double currentWeight = (double) relationship.getTarget().getEntitiesRecieved() / relationship.getSource().getEntitiesTransfered();

            // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
            // have, and runs the code if either this is true, or it is the first entity sent from the sending
            // consumer
            if(currentWeight <= relationship.getWeight() || relationship.getSource().getEntitiesTransfered() == 0) {

                // Get the data about the entity that is to be sent
                Entity entity = relationship.getSource().getEntitiesReady().get(0);

                Consumer consumer = null;

                for(int i = 0; i < simulation.getConsumers().size(); i++) {

                    Consumer con = simulation.getConsumers().get(i);

                    if(con == relationship.getTarget()) {
                        consumer = con;
                    }
                }

                for(int i = 0; i < simulation.getConsumerGroups().size(); i++) {

                    Consumer con = simulation.getConsumerGroups().get(i);

                    if(con == relationship.getTarget()) {
                        consumer = con;
                    }
                }

                List<Entity> entities = consumer.getEntitesInQueue();
                entities.add(entity);
                consumer.setEntitiesRecieved(consumer.getEntitiesRecieved() + 1);
                consumer.setEntitesInQueue(entities);
            }
        }
    }

    /**
     * Checks which entity has the longest waiting time registered on it, and checks if this is higher than the highest
     * waiting time registered so far in the simulation.
     *
     * @param maxWaitingTime The largest of the registered waiting times so far in the simulation
     *
     * @return Whichever value is largest of the registered waiting times so far in the simulation and the highest
     *         waiting time of the entities registered on the entities list.
     */
    public int calculateWaitingTime(int maxWaitingTime) {

        for(Consumer consumer : simulation.getConsumers()) {

            int waitingTime = consumerHelper.getMaxWaitingTime(consumer);
            if(waitingTime > maxWaitingTime) maxWaitingTime = waitingTime;
        }

        return maxWaitingTime;
    }

    private int getEntitesConsumed() {

        int entitiesConsumed = 0;

        for(Consumer consumer : simulation.getConsumers()) {
            entitiesConsumed += consumer.getEntitesConsumed().size();
        }

        for(ConsumerGroup consumerGroup : simulation.getConsumerGroups()) {

            for(Consumer consumer : consumerGroup.getConsumers()) {

                entitiesConsumed += consumer.getEntitesConsumed().size();
            }
        }

        return entitiesConsumed;
    }


    private int getEntitiesInQueue() {

        int entitiesInQueue = 0;

        for(Consumer consumer : simulation.getConsumers()) {

            entitiesInQueue += consumer.getEntitesInQueue().size();
        }

        for(ConsumerGroup consumerGroup : simulation.getConsumerGroups()) {

            entitiesInQueue += consumerGroup.getEntitesInQueue().size();
        }

        return entitiesInQueue;
    }

}
