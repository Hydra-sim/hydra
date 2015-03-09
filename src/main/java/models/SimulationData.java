package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * An object that saves all the data from the simulation done in {@link calculations.Simulation#simulate()}
 */
@javax.persistence.Entity
public class SimulationData {

    //region attributes
    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    @ElementCollection
    private List<Consumer> consumers = new ArrayList<>();
    @ElementCollection
    private List<Producer> producers = new ArrayList<>();

    private int entitiesConsumed;
    private int entitiesInQueue;
    private int maxWaitingTimeInTicks;
    //endregion

    //region constructors
    public SimulationData() {

        this(0, 0, 0);
    }

    public SimulationData(int entitiesConsumed, int entitiesInQueue, int maxWaitingTimeInTicks) {
        this.entitiesConsumed = entitiesConsumed;
        this.entitiesInQueue = entitiesInQueue;
        this.maxWaitingTimeInTicks = maxWaitingTimeInTicks;
    }
    //endregion

    //region getters and setters
    public int getEntitiesConsumed() {
        return entitiesConsumed;
    }

    public void setEntitiesConsumed(int entitiesConsumed) {
        this.entitiesConsumed = entitiesConsumed;
    }

    public int getEntitiesInQueue() {
        return entitiesInQueue;
    }

    public void setEntitiesInQueue(int entitiesInQueue) {
        this.entitiesInQueue = entitiesInQueue;
    }

    public int getMaxWaitingTimeInTicks() {
        return maxWaitingTimeInTicks;
    }

    public void setMaxWaitingTimeInTicks(int maxWaitingTimeInTicks) {
        this.maxWaitingTimeInTicks = maxWaitingTimeInTicks;
    }
    //endregion
}
