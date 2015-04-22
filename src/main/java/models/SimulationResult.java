package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * An object that saves all the data from the simulation done in {@link models.Simulation}
 */
@javax.persistence.Entity
public class SimulationResult {

    //region attributes
    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    private int startTime;
    private int endTime;
    private int entitiesConsumed;
    private int entitiesInQueue;
    private int maxWaitingTimeInTicks;
    //endregion

    //region constructors
    public SimulationResult() {

        this(0, 0, 0);
    }

    public SimulationResult(int entitiesConsumed, int entitiesInQueue, int maxWaitingTimeInTicks) {
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

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getEndTime() {
        return endTime;
    }

    public void setEndTime(int endTime) {
        this.endTime = endTime;
    }

    //endregion
}
