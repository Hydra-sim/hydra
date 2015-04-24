package helpers;

import models.*;

import java.util.List;

/**
 * Created by knarf on 20/04/15.
 */
public class SimulationHelper {

    Simulation simulation;

    ConsumerHelper consumerHelper;

    public SimulationHelper() {

        consumerHelper = new ConsumerHelper();
    }

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
            simulation.getNodes().stream().filter(this::isConsumer).forEach(node -> {
                ConsumerHelper.increaseWaitingTime((Consumer) node);
            });

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
    public void consumeEntities() {

        // Will be true both for Consumers and ConsumerGroups
        simulation.getNodes().stream().filter(this::isConsumer).forEach(node -> {

            if (isConsumerGroup(node)) {
                ConsumerGroup consumerGroup = (ConsumerGroup) node;

                List<Entity> entitiesToDistribute = consumerGroup.getEntitesInQueue();

                while (!entitiesToDistribute.isEmpty()) {

                    for (Consumer consumer : consumerGroup.getConsumers()) {

                        List<Entity> entitiesInQueue = consumer.getEntitesInQueue();
                        entitiesInQueue.add(entitiesToDistribute.get(0));
                        entitiesToDistribute.remove(0);
                        consumer.setEntitesInQueue(entitiesInQueue);
                    }

                }

                consumerGroup.getConsumers().forEach(consumerHelper::consumeEntity);

            } else {

                consumerHelper.consumeEntity((Consumer) node);
            }
        });
    }

    /**
     * Adds entities to the list of entities according to the number and strength of the producers registered in the
     * simulation.
     *
     * @param currentTick The current tick number the simulation is on, to check if it is time for the producer to
     *                    produce entities.
     */
    public void addEntitiesFromProducer(int currentTick) {

        simulation.getNodes().stream().filter(this::isProducer).forEach(producer -> {

            Producer source = (Producer) producer;

            for (TimetableEntry arrival : source.getTimetable().getArrivals()) {

                if (arrival.getTime() == currentTick) {

                    for(int i = 0; i < arrival.getPassengers(); i++) {

                        for(Relationship relationship : simulation.getRelationships()) {

                            if(relationship.getSource() == source) {

                                int recieved = relationship.getTarget().getEntitiesRecieved();

                                double currentWeight = (double) recieved / relationship.getSource().getEntitiesTransfered();

                                if (currentWeight <= relationship.getWeight() || relationship.getSource().getEntitiesTransfered() == 0) {

                                    simulation.getNodes().stream().filter(this::isConsumer).forEach(consumer -> {

                                        Consumer target = (Consumer) consumer;

                                        consumerHelper.addEntity(target, new Entity());
                                        target.setEntitiesRecieved(target.getEntitiesRecieved() + 1);
                                        producer.setEntitiesTransfered(producer.getEntitiesTransfered() + 1);
                                    });

                                    break;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    public void addEntitiesFromConsumers() {

        // Current consumer sending entities

        // The percentage of entities already sent from our sending consumer to the receiving consumer
        // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
        // have, and runs the code if either this is true, or it is the first entity sent from the sending
        // consumer
        // Get the data about the entity that is to be sent
        simulation.getRelationships().stream().filter(relationship
                -> relationship.getSource().getEntitiesReady().size() != 0).forEach(relationship
                -> {

            while(!relationship.getSource().getEntitiesReady().isEmpty()) {
                // The percentage of entities already sent from our sending consumer to the receiving consumer
                double currentWeight = (double) relationship.getTarget().getEntitiesRecieved() / relationship.getSource().getEntitiesTransfered();

                // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
                // have, and runs the code if either this is true, or it is the first entity sent from the sending
                // consumer
                if (currentWeight <= relationship.getWeight() || relationship.getSource().getEntitiesTransfered() == 0) {

                    // Get the data about the entity that is to be sent
                    Entity entity = relationship.getSource().getEntitiesReady().get(0);

                    Consumer target = (Consumer) relationship.getTarget();

                    List<Entity> entities = target.getEntitesInQueue();
                    entities.add(entity);
                    target.setEntitiesRecieved(target.getEntitiesRecieved() + 1);
                    target.setEntitesInQueue(entities);

                    relationship.getSource().getEntitiesReady().remove(0);
                }
            }
        });
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

    public Simulation getSimulation() {
        return simulation;
    }

    public void setSimulation(Simulation simulation) {
        this.simulation = simulation;
    }

    private boolean isConsumer(Node node) {return node instanceof Consumer;}

    private boolean isConsumerGroup(Node node) {return node instanceof ConsumerGroup;}

    private boolean isProducer(Node node) {return node instanceof Producer;}
}
