package factory;

import api.data.SimulationEdge;
import api.data.SimulationFormData;
import api.data.SimulationNode;
import models.*;

import javax.ejb.EJB;
import javax.ejb.Singleton;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Created by knarf on 21/04/15.
 */
@Singleton
public class SimulationFactory {
    @EJB
    private dao.Timetable timetableDao;

    public Simulation createSimulation(SimulationFormData input) throws Exception {
        List<Producer> producers = new ArrayList<>();
        List<Consumer> consumers = new ArrayList<>();
        List<ConsumerGroup> consumerGroups = new ArrayList<>();

        List<Relationship> relationships = new ArrayList<>();

        for (SimulationNode node : input.nodes) {
            if (isProducer(node)) {
                Timetable timetable = timetableDao.get(node.timetableId);
                producers.add(createProducer(node, timetable));

            } else if (isConsumer(node)) {
                consumers.add(createConsumer(node));

            } else if (isConsumerGroup(node)) {
                ConsumerGroup consumerGroup = new ConsumerGroup(node.consumerGroupName, node.numberOfConsumers, node.ticksToConsumeEntity);
                consumerGroups.add(consumerGroup);
            }
        }

        for (SimulationEdge edge : input.edges) {
            Node source = findNodeWithId(edge.source.id, (List<Node>)(List<?>)producers, (List<Node>)(List<?>)consumers);
            Node target = findNodeWithId(edge.target.id, (List<Node>)(List<?>)producers, (List<Node>)(List<?>)consumers);

            Relationship relationship = new Relationship(source,target,edge.weight);
            relationships.add(relationship);
        }

        List<Node> nodes = new ArrayList<>();

        nodes.addAll(producers);
        nodes.addAll(consumers);
        nodes.addAll(consumerGroups);

        // Create the simulation
        return new models.Simulation(input.name, new Date(), nodes, relationships, input.startTick, input.ticks);
    }

    private Node findNodeWithId(int id, List<Node> list1, List<Node> list2) throws RuntimeException {
        Optional<Node> node1 = findNodeWithId(id, list1);

        if(node1.isPresent())
            return node1.get();

        Optional<Node> node2 = findNodeWithId(id, list2);

        if(node2.isPresent())
            return node2.get();

        throw new RuntimeException("No node with id found");
    }

    private Optional<Node> findNodeWithId(int id, List<Node> nodes) {
        return nodes
                .stream()
                .filter(node -> node.getTmpId() == id)
                .findFirst();
    }

    private Consumer createConsumer(SimulationNode node) {
        Consumer consumer = new Consumer(node.ticksToConsumeEntity, node.x, node.y);
        consumer.setTmpId(node.id);
        return consumer;
    }

    private Producer createProducer(SimulationNode node, Timetable timetable) {
        Producer producer = new Producer(timetable, node.x, node.y);
        producer.setTmpId(node.id);
        return producer;
    }

    private boolean isConsumerGroup(SimulationNode node) {
        return node.type.equals("consumerGroup");
    }

    private boolean isConsumer(SimulationNode node) {
        return  node.type.equals("consumer") ||
                node.type.equals("desktop") ||
                node.type.equals("arrows-h") ||
                node.type.equals("suitcase");
    }

    private boolean isProducer(SimulationNode node) {
        return  node.type.equals("producer") ||
                node.type.equals("train") ||
                node.type.equals("bus");
    }
}
