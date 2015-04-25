package calculations;

import helpers.ConsumerHelper;
import helpers.ProducerHelper;
import helpers.SimulationHelper;
import models.*;
import org.junit.Before;
import org.junit.Test;
import presets.OSLPreset;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Check:
 * - results
 */
public class SimulationEngineIntegrationTest {

    ProducerHelper producerHelper;
    SimulationHelper simulationHelper; 

    @Before
    public void before() {
        
        producerHelper = new ProducerHelper();
        simulationHelper = new SimulationHelper();
    }

    //region tests

    // NEW TESTS
    // TODO: Make the rest of the tests like the new tests
    /**
     * Tests the queue function on the simulation
     */
    
    @Test
    public void testQueueing() {

        int numberOfEntitesToProduce = 2;
        int numberOfEntitiesToConsume = 1;

        // Create simulation

        Producer producer = createProducer(1, numberOfEntitesToProduce);
        Consumer consumer = new Consumer(numberOfEntitiesToConsume);
        Relationship relationship = new Relationship(producer, consumer, 1.0);

        Simulation simulation = intializeSimulation(producer, consumer, relationship, 1);

        simulationHelper.simulate(simulation);

        // Assert that there is a queue

        assertTrue(simulation.getResult().getEntitiesInQueue() > 0);

        // Assert that correct amount is left in queue

        assertEquals(numberOfEntitesToProduce - numberOfEntitiesToConsume, simulation.getResult().getEntitiesInQueue());
    }

    /**
     * Tests the consume function on the simulation
     */
    
    @Test
    public void testConsumtion() {

        int numberOfEntitesToProduce = 2;
        int numberOfEntitiesToConsume = 1;

        // Create simulation

        Producer producer = createProducer(1, numberOfEntitesToProduce);
        Consumer consumer = new Consumer(numberOfEntitiesToConsume);
        Relationship relationship = new Relationship(producer, consumer, 1.0);

        Simulation simulation = intializeSimulation(producer, consumer, relationship, 1);

        simulationHelper.simulate(simulation);

        // Assert that entites have been consumed

        assertTrue(simulation.getResult().getEntitiesConsumed() > 0);

        // Assert that correct amount have been consumed

        assertEquals(numberOfEntitiesToConsume, simulation.getResult().getEntitiesConsumed());
    }

    private Producer createProducer(int numberOfArrivals, int numberOfPassengers) {

        Producer producer = new Producer();

        int startTick = 0;
        int ticksBetweenArrivals = 1;

        producerHelper.generateTimetable(producer, startTick, ticksBetweenArrivals, numberOfArrivals, numberOfPassengers);

        return producer;
    }

    private Simulation intializeSimulation(Producer producer, Consumer consumer, Relationship relationship, int ticks) {

        List<Node> nodes = new ArrayList<>();
        nodes.add(producer);

        nodes.add(consumer);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(relationship);

        return new Simulation("Test", nodes, relationships, ticks);

    }

    // OLD TESTS
    
    @Test
    public void testSimulateEqualAmountProducedAndConsumed() throws Exception{

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(1, 1, 0, 1, 10);
        simulationHelper.simulate(simulation);
        assertEquals(0, simulation.getResult().getEntitiesInQueue());
    }

    
    @Test
    public void testSimulateMoreProducedThanConsumed() throws Exception{

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(1, 2, 0, 1, 10);
        simulationHelper.simulate(simulation);
        assertTrue(simulation.getResult().getEntitiesInQueue() > 0);
    }

    
    @Test
    public void testSimulateMoreConsumedThanProduced() throws Exception{

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(2, 1, 0, 1, 1);
        simulationHelper.simulate(simulation);
        assertEquals(0, simulation.getResult().getEntitiesInQueue());
    }

    
    @Test
    public void testSimulate10ProducedPr10TicksAllConsumed() {

        int ticks = 10;
        int ticksBetweenArrival = 10;

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(1, 10, 0, ticksBetweenArrival, ticks);
        simulationHelper.simulate(simulation);

        assertEquals(0, simulation.getResult().getEntitiesInQueue());
        assertTrue(simulation.getResult().getMaxWaitingTimeInTicks() > 0);
        assertTrue(simulation.getResult().getEntitiesConsumed() > 0);
    }

    
    @Test
    public void testSimulateWeightEqual() {

        testSimulateWeight(0.5, 0.5, 10);
    }

    
    @Test
    public void testSimulateWeightNotEqual() {

        testSimulateWeight(0.7, 0.3, 10);
    }

    
    @Test
    public void testSimulationSpeed(){

        Simulation simulation = new Simulation();

        for(int i = 0; i < 1000000; i++) {

            Consumer c = new Consumer(1);
            simulation.getNodes().add(c);
        }

        List<TimetableEntry> tList = new ArrayList<>();

        for(int i = 1; i <= 100; i++) {

            TimetableEntry t = new TimetableEntry(i, 100);
            tList.add(t);
        }

        Producer p = new Producer(new Timetable(tList, "Timetable"));

        simulation.getNodes().add(p);

        long start = System.currentTimeMillis();

        simulationHelper.simulate(simulation);

        System.out.printf("%-80s%s","Timetest; 1,000,000 consumers, 100 arrivals with 100 passengers each: ",
                (System.currentTimeMillis() - start) + " milliseconds.\n");
    }

    
    @Test
    public void testPreset() {

        Simulation sim = new OSLPreset().createOSLPreset();

        List<TimetableEntry> tList = new ArrayList<>();

        for(int i = 1; i <= 100; i++) {

            TimetableEntry t = new TimetableEntry(i, 100);
            tList.add(t);
        }

        Producer p = new Producer(new Timetable(tList, "Timetable"));

        sim.getNodes().add(p);

        long start = System.currentTimeMillis();

        simulationHelper.simulate(sim);

        System.out.printf("%-80s%s", "Timetest; OSL Preset: ", (System.currentTimeMillis() - start) + " milliseconds.\n");
    }

    
    @Test
    public void testConsumerGroup() {

        // Making ConsumerGroup

        int entitiesToConsume = 10;
        ConsumerGroup consumerGroup = new ConsumerGroup(entitiesToConsume, 1);

        Consumer consumer = new Consumer(entitiesToConsume);

        // Making producer

        List<TimetableEntry> timetableEntries = new ArrayList<>();
        timetableEntries.add(new TimetableEntry(0, 10));
        Producer producer = new Producer(new Timetable(timetableEntries, "Test"));

        // Establishing relationships

        List<Relationship> relationships = new ArrayList<>();

        Relationship producerRelationship = new Relationship(producer, consumerGroup, 1.0);
        relationships.add(producerRelationship);

        Relationship consumerGroupRelationship = new Relationship(consumerGroup, consumer, 1.0);
        relationships.add(consumerGroupRelationship);

        // Adding the Nodes to Lists

        List<Node> nodes = new ArrayList<>();
        nodes.add(consumerGroup);
        nodes.add(consumer);
        nodes.add(producer);

        // Simulation (with no regular consumers)

        Simulation simulation = new Simulation("Test Simulation", nodes, relationships, 1);
        simulationHelper.simulate(simulation);

        assertEquals(entitiesToConsume, simulation.getResult().getEntitiesConsumed());

        for(Node node : simulation.getNodes()) {

            if(node instanceof ConsumerGroup) {

                ConsumerGroup cg = (ConsumerGroup) node;

                assertTrue(cg.getEntitesConsumed().size() > 0);

                break;
            }
        }
    }
    //endregion

    //region helping methods
    private void testSimulateWeight(double weight1, double weight2, int ticks) {

        Simulation simulation = setUpStandardSimulationOneProducerTwoConsumers(1, 1, 0, 1, ticks, weight1, weight2);
        simulationHelper.simulate(simulation);

        ConsumerHelper con = new ConsumerHelper();

        List<Consumer> consumers = simulation.getNodes().stream().filter(
                node -> node instanceof Consumer).map(
                node -> (Consumer) node).collect(Collectors.toList());

        assertEquals(ticks * weight1, con.getTotalSentToConsumer(consumers.get(0)), 0.0);
        assertEquals(ticks * weight2, con.getTotalSentToConsumer(consumers.get(1)), 0.0);
    }

    private Simulation setUpStandardSimulationOneProducerTwoConsumers(int ticksToConsumeEntities, int entitiesToProduce, int startTick,
                                                                      int tickBetweenArrivals, int ticks,
                                                                      double consumerWeight1, double consumerWeight2) {

        Producer producer = new Producer();
        Consumer consumer1 = new Consumer(ticksToConsumeEntities);
        Consumer consumer2 = new Consumer(ticksToConsumeEntities);

        Relationship relationship1 = new Relationship(producer, consumer1, consumerWeight1);
        Relationship relationship2 = new Relationship(producer, consumer2, consumerWeight2);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(relationship1);
        relationships.add(relationship2);

        producerHelper.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals, entitiesToProduce);

        List<Node> nodes = new ArrayList<>();

        nodes.add(producer);
        nodes.add(consumer1);
        nodes.add(consumer2);

        return new Simulation("Test", nodes, relationships, 10);
    }

    private Simulation setUpStandardSimulationOneProducerOneConsumer(int ticksToConsumeEntities, int entitiesToProduce, int startTick,
                                                                     int tickBetweenArrivals,
                                                                     int ticks) {

        Consumer consumer = new Consumer(ticksToConsumeEntities);
        Producer producer = new Producer();
        Relationship relationship = new Relationship(producer, consumer, 1.0);

        List<Relationship> relationshipList = new ArrayList<>();
        relationshipList.add(relationship);

        producerHelper.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals, entitiesToProduce);

        List<Node> nodes = new ArrayList<>();

        nodes.add(consumer);
        nodes.add(producer);

        return new Simulation("Test", nodes, relationshipList, ticks);
    }
    //endregion
}
