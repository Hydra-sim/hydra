package calculations;

import org.junit.Test;
import models.Consumer;
import models.Producer;
import models.Relationship;
import models.SimulationData;

import controllers.ConsumerManager;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Created by kristinesundtlorentzen on 25/2/15.
 */
public class SimulationIntegrationTest {

    //region tests
    @Test
    public void testSimulateEqualAmountProducedAndConsumed() throws Exception{

        SimulationData simulationData = setUpStandardSimulationOneProducerOneConsumer(1, 1, 1, 1).simulate();
        assertEquals(0, simulationData.getEntitiesInQueue());
    }

    @Test
    public void testSimulateMoreProducedThanConsumed() throws Exception{

        SimulationData simulationData = setUpStandardSimulationOneProducerOneConsumer(1, 2, 1, 10).simulate();
        assertTrue(simulationData.getEntitiesInQueue() > 0);
    }

    @Test
    public void testSimulateMoreConsumedThanProduced() throws Exception{

        SimulationData simulationData = setUpStandardSimulationOneProducerOneConsumer(2, 1, 1, 1).simulate();
        assertEquals(0, simulationData.getEntitiesInQueue());
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

        Simulation simulation = setUpStandardSimulationOneProducerTwoConsumers(1, 1, 1, ticks, weight1, weight2);
        simulation.simulate();

        ConsumerManager con = new ConsumerManager();
        assertEquals(ticks * weight1, con.getTotalSentToConsumer(simulation.getConsumers().get(0)), 0.0);
        assertEquals(ticks * weight2, con.getTotalSentToConsumer(simulation.getConsumers().get(1)), 0.0);
    }

    private Simulation setUpStandardSimulationOneProducerTwoConsumers(int consumedPrTick, int entitiesToProduce, int productionFrequency,
                                                                      int ticks, double consumerWeight1, double consumerWeight2) {

        Producer producer = new Producer(entitiesToProduce, productionFrequency);
        Consumer consumer1 = new Consumer(consumedPrTick);
        Consumer consumer2 = new Consumer(consumedPrTick);

        Relationship relationship1 = new Relationship(consumer1, consumerWeight1);
        Relationship relationship2 = new Relationship(consumer2, consumerWeight2);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(relationship1);
        relationships.add(relationship2);

        producer.setRelationships(relationships);

        List<Producer> producers = new ArrayList<>();
        List<Consumer> consumers = new ArrayList<>();

        producers.add(producer);
        consumers.add(consumer1);
        consumers.add(consumer2);

        return new Simulation(consumers, producers, 10);
    }

    private Simulation setUpStandardSimulationOneProducerOneConsumer(int consumedPrTick, int entitiesToProduce, int productionFrequency,
                                                                     int ticks) {

        Consumer consumer = new Consumer(consumedPrTick);
        Producer producer = new Producer(entitiesToProduce, productionFrequency);
        Relationship relationship = new Relationship(consumer, 1.0);

        List<Relationship> relationshipList = new ArrayList<>();
        relationshipList.add(relationship);

        producer.setRelationships(relationshipList);

        List<Consumer> consumerList = new ArrayList<>();
        List<Producer> producerList = new ArrayList<>();

        consumerList.add(consumer);
        producerList.add(producer);

        Simulation simulation = new Simulation(consumerList, producerList, ticks);

        return simulation;
    }
    //endregion
}
