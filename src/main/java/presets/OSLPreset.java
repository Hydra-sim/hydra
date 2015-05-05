package presets;

import models.*;

import java.util.ArrayList;
import java.util.List;

// VALUES FOR THE PRESET
// ======================================================================
// Level            What            Quantity    Weight
// ----------------------------------------------------------------------
//                  Bus stops,      5,          equal
// -                Doors,          5,          80% / 5% / 5% / 5% / 5%
// - -              Terminals,      39,         equal
// - - -            Bag drop,       26,         equal
// - - - - - -      Security check, 1,          100%
// ======================================================================

/**
 * Generates a preset for OSL that can be used as a foundation for a {@link models.Simulation simulation}
 * Only generates consumers and inter-consumer relationships, producers must be added when creating simulation
 */
public class OSLPreset {

    // Quantity of each pre-defined consumer
    final int BUS_STOP_QUANTITY     = 5;
    final int DOOR_QUANTITY         = 5;
    final int TERMINAL_QUANTITY     = 39;
    final int BAG_DROP_QUANTITY     = 26;

    // Consumption time in ticks for each pre-defined consumer
    final int BUS_STOP_CONSUMPTION_TIME       = 60;         // 1 minute
    final int DOOR_CONSUMPTION_TIME           = 10;         // 10 seconds
    final int TERMINAL_CONSUMPTION_TIME       = 60 * 2;     // 2 minutes
    final int BAG_DROP_CONSUMPTION_TIME       = 60 * 2;     // 2 minutes
    final int SECURITY_CHECK_CONSUMPTION_TIME = 60 * 10;    // 10 minutes

    /**
     * Intializes the preset
     *
     * @return the preset
     */
    public Simulation createOSLPreset() {

        TimetableEntry timetableEntry= new TimetableEntry(10, 10);
        List<TimetableEntry> timetableEntries = new ArrayList<>();
        timetableEntries.add(timetableEntry);
        Timetable timetable = new Timetable(timetableEntries, "Timetable");

        // Creation of single consumers
        Consumer securityCheck  = new Consumer(      "Security",    SECURITY_CHECK_CONSUMPTION_TIME );

        // Creation of single consumers in list
        List<Consumer> doors    = createConsumers(   "Door",        DOOR_QUANTITY,      DOOR_CONSUMPTION_TIME);

        // Creation of consumer-groups
        ConsumerGroup busStops  = new ConsumerGroup( "Bus stop",    BUS_STOP_QUANTITY,  BUS_STOP_CONSUMPTION_TIME );
        ConsumerGroup terminals = new ConsumerGroup( "Terminal",    TERMINAL_QUANTITY,  TERMINAL_CONSUMPTION_TIME );
        ConsumerGroup bagDrops  = new ConsumerGroup( "Bag drop",    BAG_DROP_QUANTITY,  BAG_DROP_CONSUMPTION_TIME );

        // Iterates through the doors and sets relationships to and from them

        List<Relationship> relationships = new ArrayList<>();
        for(int i = 0; i < doors.size(); i++) {

            if(i == 0) {
                relationships.add(new Relationship(busStops, doors.get(i), 80 ) );
            } else {
                relationships.add(new Relationship(busStops, doors.get(1), 5 ) );
            }
            relationships.add(new Relationship(doors.get(i), terminals, 100));
        }

        //Sets the rest of the relationships
        relationships.add( new Relationship(terminals, bagDrops, 100));
        relationships.add( new Relationship(bagDrops, securityCheck, 100));

        List<Node> nodes = new ArrayList<>();
        // All the consumers

        nodes.addAll(doors);
        nodes.add(securityCheck);

        // All the consumer-groups

        nodes.add(busStops);
        nodes.add(terminals);
        nodes.add(bagDrops);

        // Initialize the simulation
        Simulation simulation = new Simulation("Oslo Lufthavn", 100);

        simulation.setNodes(nodes);
        simulation.setRelationships(relationships);

        simulation.setPreset(true);

        return simulation;
    }

    /**
     * Initializes consumers and gathers them in a list
     *
     * @param name name for the consumers
     * @param quantity amount of consumers
     * @param consumptionTime the time taken for the consumers to consume an entity
     * @return a list of consumers
     */
    private List<Consumer> createConsumers(String name, int quantity, int consumptionTime) {

        List<Consumer> consumers = new ArrayList<>();

        for(int i = 0; i < quantity; i++) {

            Consumer consumer = new Consumer(name, consumptionTime);
            consumers.add(consumer);
        }

        return consumers;
    }
}
