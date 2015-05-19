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
        //Groups
        /*
        Consumer terminal1 = new Consumer(30, 977, 316);
        terminal1.setType("desktop");
        nodes.add(terminal1);
        Consumer terminal2 = new Consumer(30, 692, 316);
        terminal2.setType("desktop");
        nodes.add(terminal2);
        Consumer terminal3 = new Consumer(30, 400, 316);
        terminal3.setType("desktop");
        nodes.add(terminal3);
        /**/

        //*
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
        //*/

        //Simple
        Consumer terminal4 = new Consumer(2*60, 1060, 242);
        terminal4.setType("desktop");
        nodes.add(terminal4);

        Consumer terminal5 = new Consumer(2*60, 822, 242);
        terminal5.setType("desktop");
        nodes.add(terminal5);

        Consumer terminal6 = new Consumer(2*60, 564, 242);
        terminal6.setType("desktop");
        nodes.add(terminal6);

        Consumer terminal7 = new Consumer(2*60, 332, 242);
        terminal7.setType("desktop");
        nodes.add(terminal7);

        //Bagdrops
        Consumer bagdrop1 = new Consumer(30, 566, 292);
        bagdrop1.setType("suitcase");
        nodes.add(bagdrop1);
        Consumer bagdrop2 = new Consumer(30, 818, 292);
        bagdrop2.setType("suitcase");
        nodes.add(bagdrop2);


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
        Relationship dt1 = new Relationship(door1, terminal1, 75);
        relationships.add(dt1);
        //Door 1 to simple terminal 4
        Relationship dt15 = new Relationship(door1, terminal4, 25);
        relationships.add(dt15);

        //Door 2 to terminal 1 and 2
        Relationship dt2 = new Relationship(door2, terminal1, 30);
        relationships.add(dt2);
        Relationship dt3 = new Relationship(door2, terminal2, 30);
        relationships.add(dt3);
        //Door 2 to simple terminal 5
        Relationship dt14 = new Relationship(door2, terminal5, 20);
        relationships.add(dt14);
        //Door 2 to bagdrop 1
        Relationship db1 = new Relationship(door2, bagdrop2, 20);
        relationships.add(db1);


        //Door 3 to terminal 1, 2 and 3
        Relationship dt4 = new Relationship(door3, terminal1, 20);
        relationships.add(dt4);
        Relationship dt5 = new Relationship(door3, terminal2, 20);
        relationships.add(dt5);
        Relationship dt6 = new Relationship(door3, terminal3, 20);
        relationships.add(dt6);
        //Door 3 to simple terminal 6 and 5
        Relationship dt12 = new Relationship(door3, terminal6, 20);
        relationships.add(dt12);
        Relationship dt13 = new Relationship(door3, terminal5, 20);
        relationships.add(dt13);

        //Door 4 to terminal 2 and 3
        Relationship dt7 = new Relationship(door4, terminal2, 30);
        relationships.add(dt7);
        Relationship dt8 = new Relationship(door4, terminal3, 30);
        relationships.add(dt8);
        //Door 4 to simple terminal 6
        Relationship dt11 = new Relationship(door4, terminal6, 20);
        relationships.add(dt11);
        //Door 4 to bagdrop 2
        Relationship db2 = new Relationship(door4, bagdrop1, 20);
        relationships.add(db2);

        //Door 5 to terminal 3
        Relationship dt9 = new Relationship(door5, terminal3, 75);
        relationships.add(dt9);
        //Door 5 to simple terminal 7
        Relationship dt10 = new Relationship(door5, terminal7, 25);
        relationships.add(dt10);

        //Terminal 3 to terminal 6 and 7
        Relationship tt1 = new Relationship(terminal3, terminal6, 50);
        relationships.add(tt1);
        Relationship tt2 = new Relationship(terminal3, terminal7, 50);
        relationships.add(tt2);
        //Terminal 2 to terminal 6 and 5
        Relationship tt3 = new Relationship(terminal2, terminal6, 50);
        relationships.add(tt3);
        Relationship tt4 = new Relationship(terminal2, terminal5, 50);
        relationships.add(tt4);
        //Terminal 1 to terminal 5 and 4
        Relationship tt5 = new Relationship(terminal1, terminal5, 50);
        relationships.add(tt5);
        Relationship tt6 = new Relationship(terminal1, terminal4, 50);
        relationships.add(tt6);



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
