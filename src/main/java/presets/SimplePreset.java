package presets;

import models.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by knarf on 07/05/15.
 */
public class SimplePreset {

    public Simulation createPreset(Timetable t) {

        // List over nodes
        List<Node> nodes = new ArrayList<>();

        // Create and add one producer
        Producer producer = new Producer(t, 300, 300);
        producer.setType("bus");
        nodes.add(producer);

        // Create and add one conusmer
        Consumer consumer = new Consumer(10, 400, 300);
        consumer.setType("door");
        nodes.add(consumer);

        // Create a relationship from the producer to the consumer
        List<Relationship> relationships = new ArrayList<>();
        Relationship r1 = new Relationship(producer, consumer, 100);
        relationships.add(r1);

        // Create the simulation
        Simulation simulation = new Simulation(
                "Simple Preset",
                nodes,
                relationships,
                3600 * 2
        );

        simulation.setPreset(true);
        return simulation;
    }
}
