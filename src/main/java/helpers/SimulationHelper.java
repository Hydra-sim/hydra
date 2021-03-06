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

    Simulation simulation;
    ConsumerHelper consumerHelper;

    public SimulationHelper() {
        this.consumerHelper = new ConsumerHelper(); // Why is this line needed?
    }

    public Simulation getSimulation() {
        return simulation;
    }

    @Deprecated
    public void setSimulation( Simulation simulation ) {
        this.simulation = simulation;
    }

    /**
     * This method simulates the trafic flow from the producers, through all the cosumers.
     *
     * @return A {@link models.SimulationResult} object with entities consumed, entities left in queue and max waiting time.
     */
    public void simulate( Simulation simulation ) {

        this.simulation = simulation;
        consumerHelper = new ConsumerHelper();

        int maxWaitingTime = 0;

        initTransferData();

        // Breakpoint every - tick. 10 by default
        double tempTicksBetweenBreakpoints = ( simulation.getTickBreakpoints() != 0 )
                ? ( ( double ) simulation.getTicks() / simulation.getTickBreakpoints() ) : 10;

        int ticksBetweenBreakpoints = ( int ) Math.ceil( tempTicksBetweenBreakpoints );

        int breakpoints = 0;

        for ( int i = simulation.getStartTick(); i < simulation.getStartTick() + simulation.getTicks(); i++ ) {

            if ( ticksBetweenBreakpoints != 0 && i % ticksBetweenBreakpoints == 0 && breakpoints != simulation.getTickBreakpoints() ) {

                updateNodeData( i, simulation, consumerHelper );

                breakpoints++;
            }

            // Increase waiting time
            simulation
                    .getConsumers()
                    .forEach( ConsumerHelper::increaseWaitingTime );

            addEntitiesFromProducer( i );

            getEntitiesQueueing( i );

            addEntitiesFromConsumers();

            consumeEntities( i );

            // Consume all in queue on bus-stop / parking
            simulation
                    .getConsumers()
                    .filter( this::isBusstop )
                    .forEach( consumerHelper::consumeAllEntities );

            maxWaitingTime = calculateWaitingTime( maxWaitingTime );

            getNumberOfBusesInQueue( simulation );

        }

        // Update node data for end if not updated on last tick
        if ( breakpoints != simulation.getTickBreakpoints() ) {

            updateNodeData( 0, simulation, consumerHelper );
        }

        for ( Node node : simulation.getNodes() ) {

            if ( isConsumer( node ) ) {

                Consumer consumer = ( Consumer ) node;

                if ( consumer.getMaxWaitingTimeOnCurrentNode() > maxWaitingTime ) {
                    maxWaitingTime = consumer.getMaxWaitingTimeOnCurrentNode();
                }
            }
        }

        updateNodeData( 0, simulation, consumerHelper );

        getNumberOfBusesInQueue( simulation );

        simulation.setResult(
                new SimulationResult(
                        getEntitesConsumed(),
                        getEntitiesInQueue(),
                        maxWaitingTime
                )
        );
    }

    public void initTransferData() {

        for ( Relationship relationship : simulation.getRelationships() ) {

            Node source = relationship.getSource();
            Node target = relationship.getTarget();

            simulation.getTransferData().add( new TransferData( 0, 0, target, source ) );
        }
    }

    /**
     * Takes the list of entities and deletes them from the list of entities according to the number and strength of
     * the consumers registered in the simulation. Every time an entity is deleted, the method adds 1 to the number of
     * entities consumed.
     *
     * @return The number of entities consumed so far in the simulation + the number of entities consumed during the
     * running of the method.
     */
    public void consumeEntities( int tick ) {

        // Will be true both for Consumers and ConsumerGroups
        simulation
                .getConsumers()
                .forEach( node -> {

                    if ( isConsumerGroup( node ) ) {
                        ConsumerGroup consumerGroup = ( ConsumerGroup ) node;

                        List< Entity > entitiesToDistribute = consumerGroup.getEntitiesInQueue();

                        while ( !entitiesToDistribute.isEmpty() ) {

                            consumerGroup.getConsumers().stream().filter(
                                    consumer -> !entitiesToDistribute.isEmpty() ).forEach( consumer -> {
                                List< Entity > entitiesInQueue = consumer.getEntitiesInQueue();
                                entitiesInQueue.add( entitiesToDistribute.get( 0 ) );
                                entitiesToDistribute.remove( 0 );
                                consumer.setEntitiesInQueue( entitiesInQueue );
                            } );
                        }

                        int queue = 0;

                        for ( Consumer consumer : consumerGroup.getConsumers() ) {

                            consumerHelper.consumeEntity( consumer, tick );

                            if ( !consumer.getEntitiesReady().isEmpty() ) {
                                consumerGroup.getEntitiesReady().add( consumer.getEntitiesReady().get( 0 ) );
                                consumer.getEntitiesReady().remove( 0 );
                            }

                            queue += consumer.getEntitiesInQueue().size();
                        }

                        consumerGroup.setNumberOfConsumersInQueue( queue );

                    } else if ( !isBusstop( node ) ) {
                        consumerHelper.consumeEntity( node, tick );
                    }

                    for ( Entity entity : node.getEntitiesInQueue() ) {

                        entity.setWaitingTimeOnCurrentNode( entity.getWaitingTimeOnCurrentNode() + 1 );
                    }
                } );
    }

    /**
     * Adds entities to the list of entities according to the number and strength of the producers registered in the
     * simulation.
     *
     * @param currentTick The current tick number the simulation is on, to check if it is time for the producer to
     *                    produce entities.
     */
    public void addEntitiesFromProducer( int currentTick ) {

        // Update busStop_inUse
        simulation
                .getConsumers()
                .filter( this::isBusstop )
                .forEach( node -> {
                    if ( node.getBusStop_tickArrival() != -1 ) {

                        if ( currentTick - node.getBusStop_tickArrival() == node.getTicksToConsumeEntity() ) {

                            node.setBusStop_inUse( false );
                        }
                    }
                } );

        simulation
                .getProducers()
                .forEach( node -> {
                    //node.setPersonsPerArrival(0); // TODO: Why the fuck do you have this line???
                    node.getTimetable().getArrivals().stream()
                            .filter( arrival -> arrival.getTime() == currentTick )
                            .forEach( arrival -> transferEntities( node, arrival ) );
                } );
    }

    public void addEntitiesFromConsumers() {

        // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
        // have, and runs the code if either this is true, or it is the first entity sent from the sending
        // consumer
        // Get the data about the entity that is to be sent
        simulation
                .getConsumers()
                .forEach( node -> {

                    while ( !node.getEntitiesReady().isEmpty() ) {

                        boolean isSource = false,
                                transfered = false,
                                validTargetFound = false;

                        for ( Relationship relationship : simulation.getRelationships() ) {

                            if ( relationship.getSource() == node ) {

                                isSource = true;

                                if ( relationship.getTarget() instanceof Consumer ) {

                                    validTargetFound = true;

                                    // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
                                    // have, and runs the code if either this is true, or it is the first entity sent from the sending
                                    // consumer
                                    // Get the data about the entity that is to be sent
                                    for ( TransferData transferData : simulation.getTransferData() ) {

                                        if ( transferData.source == relationship.getSource() && transferData.target == relationship.getTarget() ) {

                                            Node source = relationship.getSource();

                                            // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
                                            // have, and runs the code if either this is true, or it is the first entity sent from the sending
                                            // consumer


                                            if ( source.getEntitiesTransfered() == 0
                                                    || ( ( double ) transferData.entitiesRecieved / source.getEntitiesTransfered() ) * 100 <= relationship.getWeight() ) {

                                                // Get the data about the entity that is to be sent
                                                Entity entity = relationship.getSource().getEntitiesReady().get( 0 );
                                                entity.setWaitingTimeOnCurrentNode( 0 );

                                                Consumer target = ( Consumer ) relationship.getTarget();

                                                List< Entity > entities = target.getEntitiesInQueue();
                                                entities.add( entity );
                                                target.setEntitiesRecieved( target.getEntitiesRecieved() + 1 );
                                                target.setEntitiesInQueue( entities );


                                                source.getEntitiesReady().remove( 0 );
                                                source.setEntitiesTransfered( relationship.getSource().getEntitiesTransfered() + 1 );

                                                transferData.entitiesRecieved++;
                                                transferData.entitiesTransfered++;

                                                transfered = true;

                                            }
                                        }

                                        if ( transfered ) break;
                                    }
                                }

                                if ( transfered ) break;
                            }
                        }

                        if ( !isSource ) break;

                        if ( !validTargetFound ) break;
                    }
                } );
    }

    /**
     * Checks which entity has the longest waiting time registered on it, and checks if this is higher than the highest
     * waiting time registered so far in the simulation.
     *
     * @param maxWaitingTime The largest of the registered waiting times so far in the simulation
     * @return Whichever value is largest of the registered waiting times so far in the simulation and the highest
     * waiting time of the entities registered on the entities list.
     */
    public int calculateWaitingTime( int maxWaitingTime ) {

        for ( Node node : simulation.getNodes() ) {

            if ( isConsumer( node ) ) {

                Consumer consumer = ( Consumer ) node;

                int waitingTime = consumerHelper.getMaxWaitingTime( consumer );
                consumer.setMaxWaitingTime( waitingTime );

                if ( waitingTime > maxWaitingTime ) maxWaitingTime = waitingTime;
            }
        }

        return maxWaitingTime;
    }

    private void transferEntities( Producer source, TimetableEntry arrival ) {

        source.setNumberOfArrivals( source.getNumberOfArrivals() + 1 );

        boolean busStop = false;

        List< Relationship > currentRelationships = new ArrayList<>();

        for ( Relationship relationship : simulation.getRelationships() ) {

            if ( relationship.getSource() == source ) {

                if ( relationship.getTarget() instanceof Consumer ) {

                    if ( isBusstop( relationship.getTarget() ) ) {

                        busStop = true;
                    }

                    currentRelationships.add( relationship );
                }
            }
        }


        if ( busStop ) {

            simulation.getEntitiesQueueing().add( new QueueElement( arrival.getPassengers(), currentRelationships ) );

            source.setEntitiesTransfered( source.getEntitiesTransfered() + arrival.getPassengers() );


        } else {

            for ( int i = 0; i < arrival.getPassengers(); i++ ) {

                boolean transfered = false;

                for ( TransferData transferData : simulation.getTransferData() ) {

                    if ( transfered ) break;

                    if ( transferData.source == source ) {

                        for ( Relationship relationship : currentRelationships ) {

                            if ( transfered ) break;

                            if ( relationship.getTarget() == transferData.target ) {

                                if ( source.getEntitiesTransfered() == 0
                                        || ( ( double ) transferData.entitiesRecieved / source.getEntitiesTransfered() ) * 100 <= relationship.getWeight() ) {

                                    setTransferData( source, transferData, relationship );

                                    transfered = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private void getEntitiesQueueing( int currentTick ) {

        List< QueueElement > groupsToRemove = new ArrayList<>();

        for ( QueueElement group : simulation.getEntitiesQueueing() ) {

            Collections.sort( group.getRelationships() );

            boolean transfered = false;

            for ( Relationship relationship : group.getRelationships() ) {

                Consumer target = ( Consumer ) relationship.getTarget();

                if ( !target.isBusStop_inUse() ) {

                    target.setBusStop_inUse( true );
                    target.setBusStop_tickArrival( currentTick );

                    for ( int i = 0; i < group.getEntities(); i++ ) {

                        Entity entity = new Entity();
                        entity.setWaitingTimeOnCurrentNode( 0 );
                        consumerHelper.addEntity( target, entity );


                        target.setEntitiesRecieved( target.getEntitiesRecieved() + 1 );
                    }

                    transfered = true;

                }

                if ( transfered ) {
                    groupsToRemove.add( group );
                    break;
                }
            }
        }

        for ( QueueElement group : groupsToRemove ) {

            simulation.getEntitiesQueueing().remove( group );
        }

    }

    private void setTransferData( Producer source, TransferData transferData, Relationship relationship ) {

        Consumer target = ( Consumer ) relationship.getTarget();
        consumerHelper.addEntity( target, new Entity() );

        transferData.entitiesRecieved += 1;
        transferData.entitiesTransfered += 1;

        target.setEntitiesRecieved( target.getEntitiesRecieved() + 1 );
        source.setEntitiesTransfered( source.getEntitiesTransfered() + 1 );
    }

    private int getEntitesConsumed() {

        int entitiesConsumed = 0;

        for ( Node node : simulation.getNodes() ) {

            if ( isConsumer( node ) ) {

                boolean endNode = true;

                for ( Relationship relationship : simulation.getRelationships() ) {

                    if ( relationship.getSource() == node ) {

                        endNode = false;
                    }
                }

                if ( endNode ) {

                    if ( isConsumerGroup( node ) ) {

                        ConsumerGroup consumerGroup = ( ConsumerGroup ) node;
                        for ( Consumer consumer : consumerGroup.getConsumers() ) {

                            entitiesConsumed += consumer.getEntitiesConsumed().size();
                        }

                    } else {

                        Consumer consumer = ( Consumer ) node;
                        entitiesConsumed += consumer.getEntitiesConsumed().size();

                    }
                }
            }
        }

        return entitiesConsumed;
    }

    private int getEntitiesInQueue() {
        return simulation
                .getConsumers()
                .mapToInt( Consumer::getNumberOfConsumersInQueue )
                .sum();
    }

    private void updateNodeData( int tick, Simulation simulation, ConsumerHelper consumerHelper ) {

        for ( Node node : simulation.getNodes() ) {

            node.getNodeDataList().add( new NodeData(
                    node.getEntitiesTransfered(),
                    node.getEntitiesRecieved(),
                    node.getEntitiesReady().size()
            ) );

            if ( isConsumerGroup( node ) ) {

                ConsumerGroup consumerGroup = ( ConsumerGroup ) node;

                consumerGroup.getConsumerDataList().add( new ConsumerData(
                        consumerGroup.getNumberOfConsumersInQueue(),
                        consumerGroup.getEntitiesConsumed().size(),
                        consumerHelper.getMaxWaitingTime( consumerGroup )
                ) );

            } else if ( isConsumer( node ) ) {

                Consumer consumer = ( Consumer ) node;

                consumer.getConsumerDataList().add( new ConsumerData(
                        consumer.getEntitiesInQueue().size(),
                        consumer.getEntitiesConsumed().size(),
                        consumerHelper.getMaxWaitingTime( consumer )
                ) );

            } else if ( isProducer( node ) ) {

                Producer producer = ( Producer ) node;

                producer.getProducerDataList().add( new ProducerData(
                        producer.getNumberOfArrivals(),
                        producer.getNumberOfBusesInQueue()
                ) );
            }
        }
    }

    private void getNumberOfBusesInQueue( Simulation simulation ) {

        simulation.getNodes().stream().filter( this::isProducer ).forEach(
                node -> {

                    Producer producer = ( Producer ) node;

                    producer.setNumberOfBusesInQueue( 0 );

                } );


        simulation.getEntitiesQueueing().stream().filter(
                queueElement -> !queueElement.getRelationships().isEmpty() ).forEach(
                queueElement -> {

                    Producer source = ( Producer ) queueElement.getRelationships().get( 0 ).getSource();

                    source.setNumberOfBusesInQueue( source.getNumberOfBusesInQueue() + 1 );

                } );
    }

    private boolean isConsumer( Node node ) {
        return node instanceof Consumer;
    }

    private boolean isConsumerGroup( Node node ) {
        return node instanceof ConsumerGroup;
    }

    private boolean isProducer( Node node ) {
        return node instanceof Producer;
    }

    private boolean isBusstop( Node node ) {
        return node.getType().equals( "parking" );
    }

}