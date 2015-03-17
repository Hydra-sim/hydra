package models.presets;

import managers.NodeManager;
import models.Consumer;
import models.Relationship;
import models.Simulation;

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
public class OSLPreset extends Simulation {

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

    private List<Consumer> createConsumers(int quantity, int consumptionTime) {

        List<Consumer> consumers = new ArrayList<>();

        for(int i = 0; i < quantity; i++) {
            consumers.add(new Consumer(consumptionTime));
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
