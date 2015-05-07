package helpers;

import models.*;
import models.data.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by knarf on 20/04/15.
 */
public class SimulationHelper {

    public static final String PARKING = "parking";
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

        initTransferData();

        for(int i = simulation.getStartTick(); i < simulation.getStartTick() + simulation.getTicks(); i++) {

            // Increase waiting time
            simulation.getNodes().stream()
                    .filter(this::isConsumer)
                    .forEach(node -> ConsumerHelper.increaseWaitingTime((Consumer) node));

            addEntitiesFromProducer(i);

            getEntitiesQueueing(i);

            addEntitiesFromConsumers();

            consumeEntities(i);

            consumeAllInQueueOnBusStop();

            maxWaitingTime = calculateWaitingTime(maxWaitingTime);

            if(isBreakpoint(simulation, i)) {

                updateNodeData(i);
            }

            findMaxWaitingTime();
        }

        for(QueueElement queueElement : simulation.getEntitiesQueueing()) {

            for(Relationship relationship : queueElement.getRelationships()) {

                Producer source = (Producer) relationship.getSource();

                source.setNumberOfBusesInQueue(source.getNumberOfBusesInQueue() + 1);

                break;
            }
        }

        simulation.setResult(
                new SimulationResult(
                        getEntitesConsumed(),
                        getEntitiesInQueue(),
                        maxWaitingTime
                )
        );
    }

    private void findMaxWaitingTime() {

        simulation.getNodes().stream()
                .filter(this::isConsumer)
                .forEach(node -> {
                    Consumer consumer = (Consumer) node;
                    int max = consumerHelper.getMaxWaitingTime(consumer);

                    if (max > consumer.getMaxWaitingTime()) {

                        consumer.setMaxWaitingTime(max);
                    }
                });
    }

    public void initTransferData() {

        for(Relationship relationship : simulation.getRelationships()) {

            Node source = relationship.getSource();
            Node target = relationship.getTarget();

            simulation.getTransferData().add(new TransferData(0, 0, target, source));
        }
    }

    /**
     * Takes the list of entities and deletes them from the list of entities according to the number and strength of
     * the consumers registered in the simulation. Every time an entity is deleted, the method adds 1 to the number of
     * entities consumed.
     * @return The number of entities consumed so far in the simulation + the number of entities consumed during the
     *         running of the method.
     */
    public void consumeEntities(int tick) {

        // Will be true both for Consumers and ConsumerGroups
        simulation.getNodes().stream()
            .filter(this::isConsumer)
            .forEach(node -> {

            if (isConsumerGroup(node)) {
                ConsumerGroup consumerGroup = (ConsumerGroup) node;

                List<Entity> entitiesToDistribute = consumerGroup.getEntitiesInQueue();

                while (!entitiesToDistribute.isEmpty()) {

                    consumerGroup.getConsumers().stream().filter(
                            consumer -> !entitiesToDistribute.isEmpty()).forEach(consumer -> {
                        List<Entity> entitiesInQueue = consumer.getEntitiesInQueue();
                        entitiesInQueue.add(entitiesToDistribute.get(0));
                        entitiesToDistribute.remove(0);
                        consumer.setEntitiesInQueue(entitiesInQueue);
                    });
                }

                int queue = 0;

                for(Consumer consumer : consumerGroup.getConsumers()) {

                    consumerHelper.consumeEntity(consumer, tick);

                    if(!consumer.getEntitiesReady().isEmpty()) {
                        consumerGroup.getEntitiesReady().add(consumer.getEntitiesReady().get(0));
                        consumer.getEntitiesReady().remove(0);
                    }

                    queue += consumer.getEntitiesInQueue().size();
                }

                consumerGroup.setNumberOfConsumersInQueue(queue);

            } else {

                if(!node.getType().equals(PARKING)) {
                    consumerHelper.consumeEntity((Consumer) node, tick);
                }
            }
        });
    }
    
    private void consumeAllInQueueOnBusStop() {

        simulation.getNodes().stream().filter(this::isConsumer).forEach(
                node -> {

            Consumer consumer = (Consumer) node;

            if (consumer.getType().equals(PARKING)) {

                consumerHelper.consumeAllEntities(consumer);
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

        updatebusStop_inUse(currentTick);

        simulation.getNodes().stream().filter(
                this::isProducer).forEach(node -> {

            Producer source = (Producer) node;

            source.setPersonsPerArrival(0);
            source.getTimetable().getArrivals().stream().filter(
                    arrival -> arrival.getTime() == currentTick).forEach(
                    arrival -> transferEntities(source, arrival, currentTick));
        });

    }

    private void updatebusStop_inUse( int currentTick) {

        simulation.getNodes().stream().filter(this::isConsumer).forEach(
                node -> {

            Consumer consumer = (Consumer) node;

            if (consumer.getType().equals(PARKING)) {

                if (consumer.getBusStop_tickArrival() != -1) {

                    if (currentTick - consumer.getBusStop_tickArrival() == consumer.getTicksToConsumeEntity()) {

                        consumer.setBusStop_inUse(false);
                    }
                }
            }
        });
    }

    private void transferEntities(Producer source, TimetableEntry arrival, int currentTick) {

        source.setNumberOfArrivals(source.getNumberOfArrivals() + 1);

        boolean busStop = false;

        List<Relationship> currentRelationships = new ArrayList<>();

        for(Relationship relationship : simulation.getRelationships()) {

            if(relationship.getSource() == source) {

                if(relationship.getTarget().getType().equals(PARKING)) {

                    busStop = true;
                }

                currentRelationships.add(relationship);
            }
        }


        if (busStop) {

            simulation.getEntitiesQueueing().add( new QueueElement(arrival.getPassengers(), currentRelationships));

            source.setEntitiesTransfered(source.getEntitiesTransfered() + arrival.getPassengers());


        } else {

            for(int i = 0; i < arrival.getPassengers(); i++) {

                boolean transfered = false;

                for(TransferData transferData : simulation.getTransferData()) {

                    if(transfered) break;

                    if(transferData.source == source) {

                        for( Relationship relationship : currentRelationships) {

                            if(transfered) break;

                            if(relationship.getTarget() == transferData.target) {

                                if(source.getEntitiesTransfered() == 0
                                        || ((double) transferData.entitiesRecieved / source.getEntitiesTransfered()) * 100 <= relationship.getWeight()){

                                    setTransferData(source, transferData, relationship);

                                    transfered = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private void getEntitiesQueueing(int currentTick) {

        List<QueueElement> groupsToRemove = new ArrayList<>();

        for(QueueElement group : simulation.getEntitiesQueueing()) {

            Collections.sort(group.getRelationships());

            boolean transfered = false;

            for(Relationship relationship : group.getRelationships()) {

                Consumer target = (Consumer) relationship.getTarget();

                if(!target.isBusStop_inUse()) {

                    target.setBusStop_inUse(true);
                    target.setBusStop_tickArrival(currentTick);

                    for(int i = 0; i < group.getEntities(); i++) {

                        consumerHelper.addEntity(target, new Entity());

                        target.setEntitiesRecieved(target.getEntitiesRecieved() + 1);
                    }

                    transfered = true;

                }

                if(transfered) {
                    groupsToRemove.add(group);
                    break;
                }
            }
        }

        for(QueueElement group : groupsToRemove) {

            simulation.getEntitiesQueueing().remove(group);
        }

    }

    private void setTransferData(Producer source, TransferData transferData, Relationship relationship) {

        Consumer target = (Consumer) relationship.getTarget();
        consumerHelper.addEntity(target, new Entity());

        transferData.entitiesRecieved += 1;
        transferData.entitiesTransfered += 1;

        target.setEntitiesRecieved(target.getEntitiesRecieved() + 1);
        source.setEntitiesTransfered(source.getEntitiesTransfered() + 1);
    }

    public void addEntitiesFromConsumers() {

        // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
        // have, and runs the code if either this is true, or it is the first entity sent from the sending
        // consumer
        // Get the data about the entity that is to be sent
        simulation.getNodes().stream().filter(this::isConsumer).forEach(
                node -> {

                    // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
                    // have, and runs the code if either this is true, or it is the first entity sent from the sending
                    // consumer
                    // Get the data about the entity that is to be sent
                    simulation.getRelationships().stream().filter(relationship ->
                            relationship.getSource() == node).filter(relationship -> !node.getEntitiesReady().isEmpty()).forEach(relationship -> {

                        // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
                        // have, and runs the code if either this is true, or it is the first entity sent from the sending
                        // consumer
                        // Get the data about the entity that is to be sent
                        simulation.getTransferData().stream().filter(
                                transferData -> transferData.source == relationship.getSource() && transferData.target == relationship.getTarget()).forEach(
                                transferData -> {

                            while (!relationship.getSource().getEntitiesReady().isEmpty()) {

                                Node source = relationship.getSource();

                                // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
                                // have, and runs the code if either this is true, or it is the first entity sent from the sending
                                // consumer
                                if (source.getEntitiesTransfered() == 0
                                        || ((double) transferData.entitiesRecieved / source.getEntitiesTransfered()) * 100 <= relationship.getWeight()) {

                                    // Get the data about the entity that is to be sent
                                    Entity entity = relationship.getSource().getEntitiesReady().get(0);

                                    Consumer target = (Consumer) relationship.getTarget();

                                    List<Entity> entities = target.getEntitiesInQueue();
                                    entities.add(entity);
                                    target.setEntitiesRecieved(target.getEntitiesRecieved() + 1);
                                    target.setEntitiesInQueue(entities);

                                    relationship.getSource().getEntitiesReady().remove(0);
                                    relationship.getSource().setEntitiesTransfered(relationship.getSource().getEntitiesTransfered() + 1);
                                }
                            }
                        });
                    });
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

        for(Node node : simulation.getNodes()) {

            if(isConsumer(node)) {

                int waitingTime = consumerHelper.getMaxWaitingTime((Consumer) node);
                if(waitingTime > maxWaitingTime) maxWaitingTime = waitingTime;
            }
        }

        return maxWaitingTime;
    }

    private int getEntitesConsumed() {

        int entitiesConsumed = 0;

        for(Node node : simulation.getNodes()) {

            if(isConsumer(node)) {

                boolean endNode = true;

                for(Relationship relationship : simulation.getRelationships()) {

                    if(relationship.getSource() == node) {

                        endNode = false;
                    }
                }

                if(endNode) {

                    if (isConsumerGroup(node)) {

                        ConsumerGroup consumerGroup = (ConsumerGroup) node;
                        for (Consumer consumer : consumerGroup.getConsumers()) {

                            entitiesConsumed += consumer.getEntitiesConsumed().size();
                        }

                    } else {

                        Consumer consumer = (Consumer) node;
                        entitiesConsumed += consumer.getEntitiesConsumed().size();

                    }
                }
            }
        }

        return entitiesConsumed;
    }

    private int getEntitiesInQueue() {

        int entitiesInQueue = 0;

        for(Node node : simulation.getNodes()) {

            if(isConsumer(node)) {

                if(isConsumerGroup(node)) {

                    ConsumerGroup consumerGroup = (ConsumerGroup) node;

                    entitiesInQueue += consumerGroup.getNumberOfConsumersInQueue();

                } else {

                    Consumer consumer = (Consumer) node;
                    entitiesInQueue += consumer.getEntitiesInQueue().size();
                }
            }
        }

        return entitiesInQueue;
    }

    public Simulation getSimulation() {
        return simulation;
    }

    public void setSimulation(Simulation simulation) {
        this.simulation = simulation;
    }

    private void updateNodeData(int breakpoint) {

        for(Node node : simulation.getNodes()) {

            NodeData nodeData = new NodeData(node.getEntitiesTransfered(), node.getEntitiesRecieved(), node.getEntitiesReady().size());

            node.getNodeDataList().add(nodeData);

            if(isConsumer(node)) {

                Consumer consumer = (Consumer) node;
                ConsumerData consumerData = new ConsumerData(consumer.getEntitiesInQueue().size(),
                                            consumer.getEntitiesConsumed().size(),
                                            consumerHelper.getMaxWaitingTime(consumer));

                consumer.getConsumerDataList().add(consumerData);

            } else if (isProducer(node)) {

                Producer producer = (Producer) node;
                int arrivals = 0;

                for(TimetableEntry arrival : producer.getTimetable().getArrivals()) {

                    if(arrival.getTime() <= breakpoint) {

                        arrivals++;

                    }
                }

                ProducerData producerData = new ProducerData(arrivals);

                producer.getProducerDataList().add(producerData);
            }
        }
    }

    private boolean isConsumer(Node node) {return node instanceof Consumer;}

    private boolean isConsumerGroup(Node node) {return node instanceof ConsumerGroup;}

    private boolean isProducer(Node node) {return node instanceof Producer;}

    private boolean isBreakpoint(Simulation simulation, int i) {

        return (simulation.getTickBreakpoints() > 0 && i % simulation.getTickBreakpoints() == 0);
    }

}
