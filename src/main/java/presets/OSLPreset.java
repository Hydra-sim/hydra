package presets;

import models.Consumer;
import models.Relationship;
import models.Simulation;

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
// - - - - -        Security check, 1,          85%
// - - - - -        Toilet,         2,          5% / 5%
// - - - - - -      Security check, 1,          equal
// - - - - -        Cafe,           1,          5%
// - - - - - -      Security check, 1,          equal
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
    final int TOILET_QUANTITY       = 2;

    // Consumption time in ticks for each pre-defined consumer
    final int BUS_STOP_CONSUMPTION_TIME       = 60;         // 1 minute
    final int DOOR_CONSUMPTION_TIME           = 10;         // 10 seconds
    final int TERMINAL_CONSUMPTION_TIME       = 60 * 2;     // 2 minutes
    final int BAG_DROP_CONSUMPTION_TIME       = 60 * 2;     // 2 minutes
    final int TOILET_CONSUMPTION_TIME         = 60 * 5;     // 5 minutes
    final int CAFE_CONSUMPTION_TIME           = 60 * 30;    // 30 minutes
    final int SECURITY_CHECK_CONSUMPTION_TIME = 60 * 10;    // 10 minutes

    /**
     * Intializes the preset
     *
     * @return the preset
     */
    public Simulation createOSLPreset() {

        // Creation of single consumers
        Consumer cafe           = new Consumer(      "Café",        CAFE_CONSUMPTION_TIME );
        Consumer securityCheck  = new Consumer(      "Security",    SECURITY_CHECK_CONSUMPTION_TIME );

        // Creation of single consumers in list
        List<Consumer> doors    = createConsumers(   "Door",        DOOR_QUANTITY,      DOOR_CONSUMPTION_TIME);

        /*
        // Creation of consumer-groups
        ConsumerGroup busStops  = new ConsumerGroup( "Bus stop",    BUS_STOP_QUANTITY,  BUS_STOP_CONSUMPTION_TIME );
        ConsumerGroup terminals = new ConsumerGroup( "Terminal",    TERMINAL_QUANTITY,  TERMINAL_CONSUMPTION_TIME );
        ConsumerGroup bagDrops  = new ConsumerGroup( "Bag drop",    BAG_DROP_QUANTITY,  BAG_DROP_CONSUMPTION_TIME );
        ConsumerGroup toilets   = new ConsumerGroup( "Toilet",      TOILET_QUANTITY,    TOILET_CONSUMPTION_TIME );
        */

        // Iterates through the doors and sets relationships to and from them

        // TESTING TO SEE IF RELATIONSHIP WORKS 
        List<Relationship> relationships = new ArrayList<>();
        /*
        for(int i = 0; i < doors.size(); i++) {

            if(i == 0) {
                relationships.add(new Relationship(busStops, doors.get(i), 0.8 ) );
            } else {
                relationships.add(new Relationship(busStops, doors.get(1), 0.05 ) );
            }
            relationships.add(new Relationship(doors.get(i), terminals, 1.0));
        }

        //Sets the rest of the relationships
        relationships.add( new Relationship(terminals, bagDrops, 1.0));
        relationships.add( new Relationship(bagDrops, securityCheck, 0.85));
        relationships.add( new Relationship(bagDrops, toilets, 0.1));
        relationships.add( new Relationship(bagDrops, cafe, 0.05));
        relationships.add( new Relationship( toilets, securityCheck,   1.0 ) );
        */
        relationships.add( new Relationship( cafe, securityCheck,   1.0 ) );

        // All the consumers
        List<Consumer> consumers = new ArrayList<>();

        consumers.addAll(doors);
        consumers.add(cafe);
        consumers.add(securityCheck);

        // All the consumer-groups
        /*
        List<ConsumerGroup> consumerGroups = new ArrayList<>();

        consumerGroups.add(busStops);
        consumerGroups.add(terminals);
        consumerGroups.add(bagDrops);
        consumerGroups.add(toilets);
        */

        // Initialize the simulation
        Simulation simulation = new Simulation("OSL Preset");

        simulation.setConsumers(consumers);
        // simulation.setConsumerGroups(consumerGroups);
        simulation.setRelationships(relationships);

        simulation.setTicks(100);
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
