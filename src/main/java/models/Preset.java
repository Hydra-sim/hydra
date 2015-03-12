package models;

import calculations.SimulationEngine;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 12/3/15.
 */
public class Preset {

    List<SimulationEngine> presets;

    public Preset() {

        presets = new ArrayList<>();
    }

    /**
     * (What, quantity, weight)
     *              Bus stops,      5,  equal
     * -            Doors,          5,  80% / 5% / 5% / 5% / 5%
     * - -          Terminals,      39, equal
     * - - -        Bag drop,       26, equal
     * - - - - -    Security check, 1,  85%
     * - - - - -    Toilet,         2,  5% / 5%
     * - - - - - -  Security check, 1,  100%
     * - - - - -    Cafe,           1,  5%
     * - - - - - -  Security check, 1,  100%
     *
     * @return preset for OSL airport
     */
    private SimulationEngine createOSLPreset() {

        List<Consumer> consumers = new ArrayList<>();
        List<Producer> producers = new ArrayList<>();

        List<Consumer> busStops = new ArrayList<>();
        List<Consumer> doors = new ArrayList<>();
        List<Consumer> terminals = new ArrayList<>();
        List<Consumer> bagDrops = new ArrayList<>();
        List<Consumer> securityChecks = new ArrayList<>();
        List<Consumer> toilets = new ArrayList<>();
        List<Consumer> cafes = new ArrayList<>();

        // Number of each consumer
        final int BUS_STOP_QUANTITY       = 5;
        final int DOOR_QUANTITY           = 5;
        final int TERMINAL_QUANTITY       = 39;
        final int BAG_DROP_QUANTITY       = 26;
        final int SECURITY_CHECK_QUANTITY = 1;
        final int TOILET_QUANTITY         = 2;
        final int CAFE_QUANTITY           = 1;

        // Consumption time in ticks
        final int BUS_STOP_CONSUMPTION_TIME       = 60;
        final int DOOR_CONSUMPTION_TIME           = 10;
        final int TERMINAL_CONSUMPTION_TIME       = 60 * 2;
        final int BAG_DROP_CONSUMPTION_TIME       = 60 * 2;
        final int SECURITY_CHECK_CONSUMPTION_TIME = 60 * 10;
        final int TOILET_CONSUMPTION_TIME         = 60 * 5;
        final int CAFE_CONSUMPTION_TIME           = 60 * 30;

        busStops       = createConsumers(BUS_STOP_QUANTITY,       BUS_STOP_CONSUMPTION_TIME);
        doors          = createConsumers(DOOR_QUANTITY,           DOOR_CONSUMPTION_TIME);
        terminals      = createConsumers(TERMINAL_QUANTITY,       TERMINAL_CONSUMPTION_TIME);
        bagDrops       = createConsumers(BAG_DROP_QUANTITY,       BAG_DROP_CONSUMPTION_TIME);
        securityChecks = createConsumers(SECURITY_CHECK_QUANTITY, SECURITY_CHECK_CONSUMPTION_TIME);
        toilets        = createConsumers(TOILET_QUANTITY,         TOILET_CONSUMPTION_TIME);
        cafes          = createConsumers(CAFE_QUANTITY,           CAFE_CONSUMPTION_TIME);

        for(int i = 0; i < busStops.size(); i++) ;

        return null;
    }

    private List<Consumer> createConsumers(int quantity, int consumptionTime) {

        List<Consumer> consumers = new ArrayList<>();

        for(int i = 0; i < quantity; i++) {
            consumers.add(new Consumer(consumptionTime));
        }

        return consumers;
    }
}
