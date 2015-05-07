package calculations;

import helpers.ConsumerHelper;
import helpers.ProducerHelper;
import helpers.SimulationHelper;
import models.*;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import presets.OSLPreset;

import java.util.ArrayList;
import java.util.Date;
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

        int numberOfEntitesToProduce = 4;
        int ticksToConsumeEntities = 1;
        int ticks = 2;

        // Create simulation

        Producer producer = createProducer(1, numberOfEntitesToProduce);
        Consumer consumer = new Consumer(ticksToConsumeEntities);
        Relationship relationship = new Relationship(producer, consumer, 100);

        Simulation simulation = intializeSimulation(producer, consumer, relationship, ticks);

        simulationHelper.simulate(simulation);
        simulation = simulationHelper.getSimulation();

        // Assert that there is a queue

        assertTrue(simulation.getResult().getEntitiesInQueue() > 0);

        // Assert that correct amount is left in queue

        assertEquals(numberOfEntitesToProduce - (ticksToConsumeEntities * ticks), simulation.getResult().getEntitiesInQueue());
    }

    /**
     * Tests the consume function on the simulation
     */
    
    @Test
    public void testConsumtion() {

        int numberOfEntitesToProduce = 2;
        int ticksToConsumeEntities = 1;
        int ticks = 2;

        // Create simulation

        Producer producer = createProducer(1, numberOfEntitesToProduce);
        Consumer consumer = new Consumer(ticksToConsumeEntities);
        Relationship relationship = new Relationship(producer, consumer, 100);

        Simulation simulation = intializeSimulation(producer, consumer, relationship, ticks);

        simulationHelper.simulate(simulation);
        simulation = simulationHelper.getSimulation();

        // Assert that entites have been consumed

        assertTrue(simulation.getResult().getEntitiesConsumed() > 0);

        // Assert that correct amount have been consumed

        assertEquals((ticksToConsumeEntities * ticks), simulation.getResult().getEntitiesConsumed());
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

        testSimulateWeight(50, 50, 10);
    }

    
    @Test
    public void testSimulateWeightNotEqual() {

        testSimulateWeight(70, 30, 10);
    }


    @Ignore
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
        ConsumerGroup consumerGroup = new ConsumerGroup(entitiesToConsume, 2);

        Consumer consumer = new Consumer(1);

        // Making producer

        List<TimetableEntry> timetableEntries = new ArrayList<>();
        timetableEntries.add(new TimetableEntry(0, 10));
        Producer producer = new Producer(new Timetable(timetableEntries, "Test"));

        // Establishing relationships

        List<Relationship> relationships = new ArrayList<>();

        Relationship producerRelationship = new Relationship(producer, consumerGroup, 100);
        relationships.add(producerRelationship);

        Relationship consumerGroupRelationship = new Relationship(consumerGroup, consumer, 100);
        relationships.add(consumerGroupRelationship);

        // Adding the Nodes to Lists

        List<Node> nodes = new ArrayList<>();
        nodes.add(producer);
        nodes.add(consumerGroup);
        nodes.add(consumer);

        // Simulation (with no regular consumers)

        Simulation simulation = new Simulation("Test Simulation", nodes, relationships, 20);
        simulationHelper.simulate(simulation);

        assertEquals(entitiesToConsume, simulation.getResult().getEntitiesConsumed());
        assertEquals(2, consumerGroup.getTicksToConsumeEntity());

        for(Node node : simulation.getNodes()) {

            if(node instanceof ConsumerGroup) {

                ConsumerGroup cg = (ConsumerGroup) node;

                assertTrue(cg.getEntitiesConsumed().size() > 0);

                break;
            }
        }
    }
    //endregion

    //region helping methods
    private void testSimulateWeight(int weight1, int weight2, int ticks) {

        Simulation simulation = setUpStandardSimulationOneProducerTwoConsumers(1, 1, 0, 1, ticks, weight1, weight2);
        simulationHelper.simulate(simulation);

        ConsumerHelper con = new ConsumerHelper();

        List<Consumer> consumers = simulation.getNodes().stream().filter(
                node -> node instanceof Consumer).map(
                node -> (Consumer) node).collect(Collectors.toList());

        assertEquals(ticks * weight1 / 100, con.getTotalSentToConsumer(consumers.get(0)), 0);
        assertEquals(ticks * weight2 / 100, con.getTotalSentToConsumer(consumers.get(1)), 0);
    }

    private Simulation setUpStandardSimulationOneProducerTwoConsumers(int ticksToConsumeEntities, int entitiesToProduce, int startTick,
                                                                      int tickBetweenArrivals, int ticks,
                                                                      int consumerWeight1, int consumerWeight2) {

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
        Relationship relationship = new Relationship(producer, consumer, 100);

        List<Relationship> relationshipList = new ArrayList<>();
        relationshipList.add(relationship);

        producerHelper.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals, entitiesToProduce);

        List<Node> nodes = new ArrayList<>();

        nodes.add(consumer);
        nodes.add(producer);

        return new Simulation("Test", nodes, relationshipList, ticks);
    }
    //endregion

    @Test
    public void bugTest1() {

        //InputStream inputStream = SimulationEngineIntegrationTest.class.getResourceAsStream("/Users/kristinesundtlorentzen/Dropbox/School/2015/hydra/src/main/resources/monday-friday.csv");
        Timetable timetable = new Timetable(new ArrayList<TimetableEntry>() {{
            add(new TimetableEntry(55000, 400));
        }}, "Test");

        List<Node> nodes = new ArrayList<Node>() {{
            add(new Producer(timetable));
            add(new Consumer(10));
        }};

        List<Relationship> relationships = new ArrayList<Relationship>() {{
            add(new Relationship(nodes.get(0), nodes.get(1), 100));
        }};

        Simulation simulation = new Simulation("Test", new Date(), nodes, relationships, 50400, 14400, 0);

        simulationHelper.setSimulation(simulation);
        simulationHelper.simulate(simulation);

        Simulation simulationResult = simulationHelper.getSimulation();

        assertEquals(2, simulationResult.getNodes().size());
        assertEquals(1, simulationResult.getRelationships().size());
        assertTrue(simulationResult.getResult().getEntitiesConsumed() > 1);
        assertEquals(0, simulationResult.getResult().getEntitiesInQueue());
        assertTrue(simulationResult.getResult().getMaxWaitingTimeInTicks() > 0);
    }
}
