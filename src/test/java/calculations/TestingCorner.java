package calculations;

import helpers.ProducerHelper;
import helpers.SimulationHelper;
import models.*;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TestingCorner {

    SimulationHelper simulationHelper;

    @Before
    public void before() {

        simulationHelper = new SimulationHelper();
    }

    @Test
    public void testConsumeEntitiesWithConsumers() {

        Simulation simulation = new Simulation();
        List<Node> nodes = new ArrayList<>();

        Consumer consumer = new Consumer(4);

        List<Entity> entities = new ArrayList<>();
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());

        consumer.setEntitesInQueue(entities);

        nodes.add(consumer);

        simulation.setNodes(nodes);


        simulationHelper.setSimulation(simulation);

        simulationHelper.consumeEntities();

        Consumer consumerResult = (Consumer) simulationHelper.getSimulation().getNodes().get(0);

        assertEquals(4, consumerResult.getEntitesConsumed().size());
        assertEquals(1, consumerResult.getEntitesInQueue().size());
    }

    @Test
    public void testConsumeEntitiesWithConsumerGroups() {

        Simulation simulation = new Simulation();
        List<Node> nodes = new ArrayList<>();

        List<Entity> entities = new ArrayList<>();
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());

        ConsumerGroup consumerGroup = new ConsumerGroup(1, 4);
        consumerGroup.setEntitesInQueue(entities);

        nodes.add(consumerGroup);
        simulation.setNodes(nodes);


        simulationHelper.setSimulation(simulation);

        simulationHelper.consumeEntities();


        ConsumerGroup consumerGroupResult = (ConsumerGroup) simulationHelper.getSimulation().getNodes().get(0);

        assertEquals(4, consumerGroupResult.getConsumers().get(0).getEntitesConsumed().size());
        assertEquals(1, consumerGroupResult.getConsumers().get(0).getEntitesInQueue().size());
    }

    @Test
    public void testAddEntitesFromProducer() {

        Simulation simulation = new Simulation();

        List<Node> nodes = new ArrayList<>();

        Producer source = new Producer();
        new ProducerHelper().generateTimetable(source, 0, 1, 1, 10);
        nodes.add(source);

        Consumer target = new Consumer(0);
        nodes.add(target);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(new Relationship(source, target, 1.0));

        simulation.setNodes(nodes);
        simulation.setRelationships(relationships);

        simulationHelper.setSimulation(simulation);
        simulationHelper.addEntitiesFromProducer(0);

        Producer sourceResult = (Producer) simulationHelper.getSimulation().getNodes().get(0);
        Consumer targetResult = (Consumer) simulationHelper.getSimulation().getNodes().get(1);

        assertEquals(10, sourceResult.getEntitiesTransfered());
        assertEquals(10, targetResult.getEntitiesRecieved());
        assertEquals(10, targetResult.getEntitesInQueue().size());
    }

    @Test
    public void testAddEntitiesFromConsumers() {

        Simulation simulation = new Simulation();

        List<Node> nodes = new ArrayList<>();

        Consumer source = new Consumer(0);

        List<Entity> entities = new ArrayList<>();
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());
        entities.add(new Entity());

        source.setEntitiesReady(entities);

        nodes.add(source);

        Consumer target = new Consumer(0);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(new Relationship(source, target, 1.0));

        nodes.add(target);

        simulation.setNodes(nodes);
        simulation.setRelationships(relationships);

        simulationHelper.setSimulation(simulation);

        simulationHelper.addEntitiesFromConsumers();

        Consumer sourceResult = (Consumer) simulationHelper.getSimulation().getNodes().get(0);
        Consumer targetResult = (Consumer) simulationHelper.getSimulation().getNodes().get(1);

        assertEquals(0, sourceResult.getEntitiesReady().size());
        assertEquals(5, targetResult.getEntitesInQueue().size());
    }

    @Test
    public void testSimulationWithBreakpoints() {

        List<Node> nodes = new ArrayList<>();

        Timetable timetable = new Timetable();
        timetable.getArrivals().add(new TimetableEntry(0, 50));
        timetable.getArrivals().add(new TimetableEntry(10, 50));
        timetable.getArrivals().add(new TimetableEntry(20, 50));

        Producer producer = new Producer(timetable);

        Consumer consumer = new Consumer(10);

        nodes.add(producer);
        nodes.add(consumer);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(new Relationship(producer, consumer, 1.0));

        Simulation simulation3 = new Simulation("Simulation with data which has been simulated", new Date(), nodes, relationships, 0, 100, 25);
        SimulationHelper simulationHelper = new SimulationHelper();
        simulationHelper.simulate(simulation3);

        // producer
        Producer producerResult = (Producer) simulationHelper.getSimulation().getNodes().get(0);
        assertTrue(producerResult.getNodeDataList().size() > 0);
        assertTrue(producerResult.getProducerDataList().size() > 0);

        // consumer

        Consumer consumerrResult = (Consumer) simulationHelper.getSimulation().getNodes().get(1);
        assertTrue(consumerrResult.getNodeDataList().size() > 0);
        assertTrue(consumerrResult.getConsumerDataList().size() > 0);

    }
}
