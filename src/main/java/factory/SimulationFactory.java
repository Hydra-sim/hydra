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
        List<Node> nodes = new ArrayList<>();
        List<Relationship> relationships = new ArrayList<>();

        for (SimulationNode node : input.nodes) {
            if (isProducer(node)) {
                Timetable timetable = timetableDao.get(node.timetableId);
                nodes.add(createProducer(node, timetable));

            } else if (isConsumer(node)) {
                nodes.add(createConsumer(node));

            } else if (isConsumerGroup(node)) {
                ConsumerGroup consumerGroup = new ConsumerGroup(node.consumerGroupName, node.numberOfConsumers, node.ticksToConsumeEntity);
                nodes.add(consumerGroup);
            } else {
                throw new RuntimeException("Unknown node type (" + node.type + ")!");
            }
        }

        for (SimulationEdge edge : input.edges) {
            Node source = findNodeWithId(edge.source.id, nodes).get();
            Node target = findNodeWithId(edge.target.id, nodes).get();

            Relationship relationship = new Relationship(source, target, edge.weight);
            relationships.add(relationship);
        }

        // Create the simulation
        return new models.Simulation(
                input.name,
                new Date(),
                nodes,
                relationships,
                input.startTick,
                input.ticks,
                input.breakpoints
        );
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

        return node.type.contains("consumerGroup");
    }

    private boolean isConsumer(SimulationNode node) {
        return  node.type.equals("consumer") ||
                node.type.equals("desktop") ||
                node.type.equals("arrows-h") ||
                node.type.equals("suitcase") ||
                node.type.equals("parking") ||
                node.type.equals("door");
    }

    private boolean isProducer(SimulationNode node) {
        return  node.type.equals("producer") ||
                node.type.equals("train") ||
                node.type.equals("bus");
    }
}
