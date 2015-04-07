package models.presets;

import managers.NodeManager;
import models.Consumer;
import models.Relationship;
import models.Simulation;
import models.SimulationResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 17/3/15.
 */

/**
 * (What, quantity, weight)
 *              Bus stops,      5,  equal
 * -            Doors,          5,  80% / 5% / 5% / 5% / 5%
 * - -          Terminals,      39, equal
 * - - -        Bag drop,       26, equal
 * - - - - -    Security check, 1,  85%
 * - - - - -    Toilet,         2,  5% / 5%
 * - - - - - -  Security check, 1,  equal
 * - - - - -    Cafe,           1,  5%
 * - - - - - -  Security check, 1,  equal
 *
 * @return preset for OSL airport
 */
public class OSLPreset {

    public Simulation createOSLPreset() {
        List<Consumer> consumers = new ArrayList<>();

        List<Consumer> busStops;
        List<Consumer> doors;
        List<Consumer> terminals;
        List<Consumer> bagDrops;
        List<Consumer> toilets;
        List<Consumer> cafes;
        List<Consumer> securityChecks;

        // Number of each consumer
        final int BUS_STOP_QUANTITY       = 5;
        final int DOOR_QUANTITY           = 5;
        final int TERMINAL_QUANTITY       = 39;
        final int BAG_DROP_QUANTITY       = 26;
        final int TOILET_QUANTITY         = 2;
        final int CAFE_QUANTITY           = 1;
        final int SECURITY_CHECK_QUANTITY = 1;


        // Consumption time in ticks
        final int BUS_STOP_CONSUMPTION_TIME       = 60;
        final int DOOR_CONSUMPTION_TIME           = 10;
        final int TERMINAL_CONSUMPTION_TIME       = 60 * 2;
        final int BAG_DROP_CONSUMPTION_TIME       = 60 * 2;
        final int TOILET_CONSUMPTION_TIME         = 60 * 5;
        final int CAFE_CONSUMPTION_TIME           = 60 * 30;
        final int SECURITY_CHECK_CONSUMPTION_TIME = 60 * 10;


        busStops       = createConsumers(BUS_STOP_QUANTITY,       BUS_STOP_CONSUMPTION_TIME,        "Bus stop");
        doors          = createConsumers(DOOR_QUANTITY,           DOOR_CONSUMPTION_TIME,            "Door");
        terminals      = createConsumers(TERMINAL_QUANTITY,       TERMINAL_CONSUMPTION_TIME,        "Terminal");
        bagDrops       = createConsumers(BAG_DROP_QUANTITY,       BAG_DROP_CONSUMPTION_TIME,        "Bag drop");
        toilets        = createConsumers(TOILET_QUANTITY,         TOILET_CONSUMPTION_TIME,          "Toilet");
        cafes          = createConsumers(CAFE_QUANTITY,           CAFE_CONSUMPTION_TIME,            "Café");
        securityChecks = createConsumers(SECURITY_CHECK_QUANTITY, SECURITY_CHECK_CONSUMPTION_TIME,  "Security check");

        busStops = setRelationshipsBusStops(busStops, doors);
        doors = setRelationships(doors, terminals);
        terminals = setRelationships(terminals, bagDrops);
        bagDrops = setRelationshipBagDrops(bagDrops, securityChecks, toilets, cafes);
        toilets = setRelationships(toilets, securityChecks);
        cafes = setRelationships(cafes, securityChecks);

        Relationship relationship = new Relationship(doors.get(1), 1.0);
        List<Relationship> relationships = new ArrayList<>();
        relationships.add(relationship);
        doors.get(0).setRelationships(relationships);

        consumers = addConsumers(consumers, busStops);
        consumers = addConsumers(consumers, doors);
        consumers = addConsumers(consumers, terminals);
        consumers = addConsumers(consumers, bagDrops);
        consumers = addConsumers(consumers, toilets);
        consumers = addConsumers(consumers, cafes);
        consumers = addConsumers(consumers, securityChecks);

        Simulation simulation = new Simulation("OSL Preset");
        simulation.setConsumers(consumers);
        simulation.setTicks(100);
        simulation.setPreset(true);
        simulation.setResult(new SimulationResult());
        //simulation.setBusStops(busStops);

        return simulation;
    }

    // Weights specified
    // Weights based on comment at the top of the method
    private List<Consumer> setRelationshipsBusStops(List<Consumer> busStops, List<Consumer> doors) {

        for(int i = 0; i < busStops.size(); i++) {

            List<Relationship> relationships = new ArrayList<>();

            for(int j = 0; j < doors.size(); j++) {

                double weight;
                if(j == i) {
                    weight = 0.8;
                } else {
                    weight = 0.05;
                }

                relationships.add(new Relationship(doors.get(j), weight));
            }

            busStops.get(i).setRelationships(relationships);
        }

        return busStops;
    }

    private List<Consumer> setRelationshipBagDrops(List<Consumer> bagDrops, List<Consumer> securityChecks,
                                                   List<Consumer> toilets , List<Consumer> cafes) {

        for(int i = 0; i < bagDrops.size(); i++) {

            List<Relationship> relationships = new ArrayList<>();

            for(int j = 0; j < securityChecks.size(); j++) {
                relationships.add(new Relationship(securityChecks.get(j), 0.85));
            }

            for(int j = 0; j < toilets.size(); j++) {
                relationships.add(new Relationship(toilets.get(j), 0.05));
            }

            for(int j = 0; j < cafes.size(); j++) {
                relationships.add(new Relationship(cafes.get(j), 0.05));
            }

            bagDrops.get(i).setRelationships(relationships);
        }

        return bagDrops;
    }

    // Weights equal
    private List<Consumer> setRelationships(List<Consumer> parents, List<Consumer> children) {

        for(int i = 0; i < parents.size(); i++) {

            List<Relationship> relationships = new ArrayList<>();

            for(int j = 0; j < children.size(); j++) {

                relationships.add(new Relationship(children.get(j), 0.0));
            }

            parents.get(i).setRelationships(relationships);
            new NodeManager().distributeWeightIfNotSpecified(parents.get(i));
        }

        return parents;
    }

    private List<Consumer> createConsumers(int quantity, int consumptionTime, String name) {

        List<Consumer> consumers = new ArrayList<>();

        for(int i = 0; i < quantity; i++) {
            Consumer consumer = new Consumer(consumptionTime);
            consumer.name = name;
            consumers.add(consumer);
        }

        return consumers;
    }

    private List<Consumer> addConsumers(List<Consumer> consumers, List<Consumer> toBeAdded) {

        for(Consumer consumer : toBeAdded) {

            consumers.add(consumer);
        }

        return consumers;
    }
}
