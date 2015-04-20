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
        setRelationship(producer, consumer);

        Simulation simulation = intializeSimulation(producer, consumer, 1);

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
        setRelationship(producer, consumer);

        Simulation simulation = intializeSimulation(producer, consumer, 1);

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

    private void setRelationship(Node parent, Consumer child) {

        List<Relationship> relationships = new ArrayList<>();
        Relationship relationship = new Relationship(child, 1.0);
        relationships.add(relationship);
        parent.setRelationships(relationships);
    }

    private Simulation intializeSimulation(Producer producer, Consumer consumer, int ticks) {

        List<Producer> producers = new ArrayList<>();
        producers.add(producer);

        List<Consumer> consumers = new ArrayList<>();
        consumers.add(consumer);

        return new Simulation("Test", consumers, producers, ticks);

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
            simulation.getConsumers().add(c);
        }

        List<TimetableEntry> tList = new ArrayList<>();

        for(int i = 1; i <= 100; i++) {

            TimetableEntry t = new TimetableEntry(i, 100);
            tList.add(t);
        }

        Producer p = new Producer(new Timetable(tList, "Timetable"));

        simulation.getProducers().add(p);

        long start = System.currentTimeMillis();

        simulationHelper.simulate(simulation);

        System.out.println((System.currentTimeMillis() - start));
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

        sim.getProducers().add(p);

        long start = System.currentTimeMillis();

        simulationHelper.simulate(sim);

        System.out.println((System.currentTimeMillis() - start));
    }

    @Test
    public void testConsumerGroup() {

        // Making ConsumerGroup

        ConsumerGroup consumerGroup = new ConsumerGroup(10, 1);

        Consumer consumer = new Consumer(10);

        // Making producer

        List<TimetableEntry> timetableEntries = new ArrayList<>();
        timetableEntries.add(new TimetableEntry(0, 10));
        Producer producer = new Producer(new Timetable(timetableEntries, "Test"));

        // Establishing relationships

        List<Relationship> producerRelationships = new ArrayList<>();
        Relationship producerRelationship = new Relationship(consumerGroup, 1.0);
        producerRelationships.add(producerRelationship);
        producer.setRelationships(producerRelationships);

        List<Relationship> consumerGroupRelationships = new ArrayList<>();
        Relationship consumerGroupRelationship = new Relationship(consumer, 1.0);
        consumerGroupRelationships.add(consumerGroupRelationship);
        consumerGroup.setRelationships(consumerGroupRelationships);


        // Adding the Nodes to Lists

        List<ConsumerGroup> consumerGroups = new ArrayList<>();
        consumerGroups.add(consumerGroup);

        List<Consumer> consumers = new ArrayList<>();
        consumers.add(consumer);

        List<Producer> producers = new ArrayList<>();
        producers.add(producer);

        // Simulation (with no regular consumers)

        Simulation simulation = new Simulation("Test Simulation", consumers, producers, consumerGroups, 10);
        simulationHelper.simulate(simulation);

        assertTrue(simulation.getResult().getEntitiesConsumed() > 0);
        assertTrue(simulation.getConsumers().get(0).getEntitesConsumed().size() > 0);
    }
    //endregion

    //region helping methods
    private void testSimulateWeight(double weight1, double weight2, int ticks) {

        Simulation simulation = setUpStandardSimulationOneProducerTwoConsumers(1, 1, 0, 1, ticks, weight1, weight2);
        simulationHelper.simulate(simulation);

        ConsumerHelper con = new ConsumerHelper();
        assertEquals(ticks * weight1, con.getTotalSentToConsumer(simulation.getConsumers().get(0)), 0.0);
        assertEquals(ticks * weight2, con.getTotalSentToConsumer(simulation.getConsumers().get(1)), 0.0);
    }

    private Simulation setUpStandardSimulationOneProducerTwoConsumers(int ticksToConsumeEntities, int entitiesToProduce, int startTick,
                                                                      int tickBetweenArrivals, int ticks,
                                                                      double consumerWeight1, double consumerWeight2) {

        Producer producer = new Producer();
        Consumer consumer1 = new Consumer(ticksToConsumeEntities);
        Consumer consumer2 = new Consumer(ticksToConsumeEntities);

        Relationship relationship1 = new Relationship(consumer1, consumerWeight1);
        Relationship relationship2 = new Relationship(consumer2, consumerWeight2);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(relationship1);
        relationships.add(relationship2);

        producer.setRelationships(relationships);
        producerHelper.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals, entitiesToProduce);

        List<Producer> producers = new ArrayList<>();
        List<Consumer> consumers = new ArrayList<>();

        producers.add(producer);
        consumers.add(consumer1);
        consumers.add(consumer2);

        return new Simulation("Test", consumers, producers, 10);
    }

    private Simulation setUpStandardSimulationOneProducerOneConsumer(int ticksToConsumeEntities, int entitiesToProduce, int startTick,
                                                                     int tickBetweenArrivals,
                                                                     int ticks) {

        Consumer consumer = new Consumer(ticksToConsumeEntities);
        Producer producer = new Producer();
        Relationship relationship = new Relationship(consumer, 1.0);

        List<Relationship> relationshipList = new ArrayList<>();
        relationshipList.add(relationship);

        producer.setRelationships(relationshipList);
        producerHelper.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals, entitiesToProduce);

        List<Consumer> consumerList = new ArrayList<>();
        List<Producer> producerList = new ArrayList<>();

        consumerList.add(consumer);
        producerList.add(producer);

        return new Simulation("Test", consumerList, producerList, ticks);
    }

    //endregion
}
