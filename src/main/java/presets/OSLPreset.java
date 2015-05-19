package presets;

import models.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by knarf on 07/05/15.
 */
public class OSLPreset {

    public Simulation createPreset(Timetable t) {

        // List over nodes
        List<Node> nodes = new ArrayList<>();

        // Create and add consumers

        //Busstops
        Consumer busstop4 = new Consumer(2*60, 834, 472);
        busstop4.setType("parking");
        nodes.add(busstop4);

        Consumer busstop3 = new Consumer(2*60, 1015, 472);
        busstop3.setType("parking");
        nodes.add(busstop3);

        Consumer busstop2 = new Consumer(2*60, 566, 472);
        busstop2.setType("parking");
        nodes.add(busstop2);

        Consumer busstop1 = new Consumer(2*60, 335, 472);
        busstop1.setType("parking");
        nodes.add(busstop1);

        //Doors
        Consumer door5 = new Consumer(3, 290, 401);
        door5.setType("door");
        nodes.add(door5);

        Consumer door4 = new Consumer(3, 480, 401);
        door4.setType("door");
        nodes.add(door4);

        Consumer door3 = new Consumer(3, 689, 401);
        door3.setType("door");
        nodes.add(door3);

        Consumer door2 = new Consumer(3, 875, 401);
        door2.setType("door");
        nodes.add(door2);

        Consumer door1 = new Consumer(3, 1085, 401);
        door1.setType("door");
        nodes.add(door1);

        //Terminals
        ConsumerGroup terminal1 = new ConsumerGroup(30, 60);
        terminal1.setType("consumerGroup-desktop");
        terminal1.setX(977);
        terminal1.setY(316);
        nodes.add(terminal1);

        ConsumerGroup terminal2 = new ConsumerGroup(30, 60);
        terminal2.setType("consumerGroup-desktop");
        terminal2.setX(692);
        terminal2.setY(316);
        nodes.add(terminal2);

        ConsumerGroup terminal3 = new ConsumerGroup(30, 60);
        terminal3.setType("consumerGroup-desktop");
        terminal3.setX(400);
        terminal3.setY(316);
        nodes.add(terminal3);


        // Create a relationship from the producer to the consumer
        List<Relationship> relationships = new ArrayList<>();

        //Bustop 4 to door 3, 2 and 1
        Relationship bd1 = new Relationship(busstop4, door3, 34);
        relationships.add(bd1);
        Relationship bd2 = new Relationship(busstop4, door2, 33);
        relationships.add(bd2);
        Relationship bd3 = new Relationship(busstop4, door1, 33);
        relationships.add(bd3);
        //Bussstop 3 to door 2 and 1
        Relationship bd4 = new Relationship(busstop3, door2, 50);
        relationships.add(bd4);
        Relationship bd5 = new Relationship(busstop3, door1, 50);
        relationships.add(bd5);
        //Bussstop 2 to door 3, 4 and 5
        Relationship bd6 = new Relationship(busstop2, door3, 34);
        relationships.add(bd6);
        Relationship bd7 = new Relationship(busstop2, door4, 33);
        relationships.add(bd7);
        Relationship bd8 = new Relationship(busstop2, door5, 33);
        relationships.add(bd8);
        //Bussstop 1 to door 2 and 1
        Relationship bd9 = new Relationship(busstop1, door4, 50);
        relationships.add(bd9);
        Relationship bd10 = new Relationship(busstop1, door5, 50);
        relationships.add(bd10);

        //Door 1 to terminal 1
        Relationship dt1 = new Relationship(door1, terminal1, 100);
        relationships.add(dt1);
        //Door 2 to terminal 1 and 2
        Relationship dt2 = new Relationship(door2, terminal1, 50);
        relationships.add(dt2);
        Relationship dt3 = new Relationship(door2, terminal2, 50);
        relationships.add(dt3);
        //Door 3 to terminal 1, 2 and 3
        Relationship dt4 = new Relationship(door3, terminal1, 34);
        relationships.add(dt4);
        Relationship dt5 = new Relationship(door3, terminal2, 33);
        relationships.add(dt5);
        Relationship dt6 = new Relationship(door3, terminal3, 33);
        relationships.add(dt6);
        //Door 4 to terminal 2 and 3
        Relationship dt7 = new Relationship(door4, terminal2, 50);
        relationships.add(dt7);
        Relationship dt8 = new Relationship(door4, terminal3, 50);
        relationships.add(dt8);
        //Door 5 to terminal 3
        Relationship dt9 = new Relationship(door5, terminal3, 50);
        relationships.add(dt9);


        // Create the simulation
        Simulation simulation = new Simulation(
                "OSL Preset",
                nodes,
                relationships,
                3600 * 2
        );

        simulation.setPreset(true);
        return simulation;
    }
}
