package calculations;

import managers.ProducerManager;
import org.junit.Before;
import org.junit.Test;
import models.Consumer;
import models.Producer;
import models.Relationship;
import models.SimulationData;

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

        SimulationData simulationData = setUpStandardSimulationOneProducerOneConsumer(1, 1, 0, 1, 1).simulate();
        assertEquals(0, simulationData.getEntitiesInQueue());
    }

    @Test
    public void testSimulateMoreProducedThanConsumed() throws Exception{

        int ticks = 10;
        int ticksBetweenArrival = 1;

        SimulationData simulationData = setUpStandardSimulationOneProducerOneConsumer(1, 2, 0, ticksBetweenArrival, ticks).simulate();
        assertTrue(simulationData.getEntitiesInQueue() > 0);
    }

    @Test
    public void testSimulateMoreConsumedThanProduced() throws Exception{

        SimulationData simulationData = setUpStandardSimulationOneProducerOneConsumer(2, 1, 0, 1, 1).simulate();
        assertEquals(0, simulationData.getEntitiesInQueue());
    }

    @Test
    public void testSimulate10ProducedPr10TicksAllConsumed() {

        int ticks = 10;
        int ticksBetweenArrival = 10;

        SimulationData simulationData = setUpStandardSimulationOneProducerOneConsumer(1, 10, 0, 10, 10).simulate();

        assertEquals(0, simulationData.getEntitiesInQueue());
        assertTrue(simulationData.getMaxWaitingTimeInTicks() > 0);
        assertTrue(simulationData.getEntitiesConsumed() > 0);
    }

    @Test
    public void testSimulateWeightEqual() {

        testSimulateWeight(0.5, 0.5, 10);
    }

    @Test
    public void testSimulateWeightNotEqual() {

        testSimulateWeight(0.7, 0.3, 10);
    }
    //endregion

    //region helping methods
    private void testSimulateWeight(double weight1, double weight2, int ticks) {

        SimulationEngine simulationEngine = setUpStandardSimulationOneProducerTwoConsumers(1, 1, 0, 1, ticks, weight1, weight2);
        simulationEngine.simulate();

        ConsumerManager con = new ConsumerManager();
        assertEquals(ticks * weight1, con.getTotalSentToConsumer(simulationEngine.getConsumers().get(0)), 0.0);
        assertEquals(ticks * weight2, con.getTotalSentToConsumer(simulationEngine.getConsumers().get(1)), 0.0);
    }

    private SimulationEngine setUpStandardSimulationOneProducerTwoConsumers(int consumedPrTick, int entitiesToProduce, int startTick,
                                                                      int tickBetweenArrivals, int ticks,
                                                                      double consumerWeight1, double consumerWeight2) {

        Producer producer = new Producer(entitiesToProduce, null);
        Consumer consumer1 = new Consumer(consumedPrTick);
        Consumer consumer2 = new Consumer(consumedPrTick);

        Relationship relationship1 = new Relationship(consumer1, consumerWeight1);
        Relationship relationship2 = new Relationship(consumer2, consumerWeight2);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(relationship1);
        relationships.add(relationship2);

        producer.setRelationships(relationships);
        producerManager.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals);

        List<Producer> producers = new ArrayList<>();
        List<Consumer> consumers = new ArrayList<>();

        producers.add(producer);
        consumers.add(consumer1);
        consumers.add(consumer2);

        return new SimulationEngine(consumers, producers, 10);
    }

    private SimulationEngine setUpStandardSimulationOneProducerOneConsumer(int consumedPrTick, int entitiesToProduce, int startTick,
                                                                     int tickBetweenArrivals,
                                                                     int ticks) {

        Consumer consumer = new Consumer(consumedPrTick);
        Producer producer = new Producer(entitiesToProduce, null);
        Relationship relationship = new Relationship(consumer, 1.0);

        List<Relationship> relationshipList = new ArrayList<>();
        relationshipList.add(relationship);

        producer.setRelationships(relationshipList);
        producerManager.generateTimetable(producer, startTick, tickBetweenArrivals, ticks / tickBetweenArrivals);

        List<Consumer> consumerList = new ArrayList<>();
        List<Producer> producerList = new ArrayList<>();

        consumerList.add(consumer);
        producerList.add(producer);

        SimulationEngine simulationEngine = new SimulationEngine(consumerList, producerList, ticks);

        return simulationEngine;
    }
    //endregion
}
