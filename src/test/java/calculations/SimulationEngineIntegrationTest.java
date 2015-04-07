package calculations;

import api.*;
import managers.ProducerManager;
import models.*;
import models.Simulation;
import models.Timetable;
import models.presets.OSLPreset;
import org.junit.Before;
import org.junit.Test;

import managers.ConsumerManager;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Created by kristinesundtlorentzen on 25/2/15.
 */
public class SimulationEngineIntegrationTest {

    ProducerManager producerManager;

    @Before
    public void before() {
        producerManager = new ProducerManager();
    }

    //region tests
    @Test
    public void testSimulateEqualAmountProducedAndConsumed() throws Exception{

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(1, 1, 0, 1, 1);
        simulation.simulate();
        assertEquals(0, simulation.getResult().getEntitiesInQueue());
    }

    @Test
    public void testSimulateMoreProducedThanConsumed() throws Exception{

        int ticks = 10;
        int ticksBetweenArrival = 1;

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(1, 2, 0, ticksBetweenArrival, ticks);
        simulation.simulate();
        assertTrue(simulation.getResult().getEntitiesInQueue() > 0);
    }

    @Test
    public void testSimulateMoreConsumedThanProduced() throws Exception{

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(2, 1, 0, 1, 1);
        simulation.simulate();
        assertEquals(0, simulation.getResult().getEntitiesInQueue());
    }

    @Test
    public void testSimulate10ProducedPr10TicksAllConsumed() {

        int ticks = 10;
        int ticksBetweenArrival = 10;

        Simulation simulation = setUpStandardSimulationOneProducerOneConsumer(1, 10, 0, ticksBetweenArrival, ticks);
        simulation.simulate();

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

        simulation.simulate();

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

        sim.simulate();

        System.out.println((System.currentTimeMillis() - start));
    }
    //endregion

    //region helping methods
    private void testSimulateWeight(double weight1, double weight2, int ticks) {

        Simulation simulation = setUpStandardSimulationOneProducerTwoConsumers(1, 1, 0, 1, ticks, weight1, weight2);
        simulation.simulate();

        ConsumerManager con = new ConsumerManager();
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
        producerManager.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals, entitiesToProduce);

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
        producerManager.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals, entitiesToProduce);

        List<Consumer> consumerList = new ArrayList<>();
        List<Producer> producerList = new ArrayList<>();

        consumerList.add(consumer);
        producerList.add(producer);

        return new Simulation("Test", consumerList, producerList, ticks);
    }
    //endregion
}
