package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
@javax.persistence.Entity
public class Consumer extends Node{

    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    private int ticksToConsumeEntities;

    @Transient
    private List<Entity> entitesConsumed;

    @Transient
    private List<Entity> entitesInQueue;

    //region constructors
    public Consumer() {
        this(0);
    }

    public Consumer(int ticksToConsumeEntities) {
        this.ticksToConsumeEntities = ticksToConsumeEntities;
        this.entitesConsumed = new ArrayList<>();
        this.entitesInQueue = new ArrayList<>();
    }
    //endregion

    //region getters and setters

    public int getticksToConsumeEntities() {
        return ticksToConsumeEntities;
    }

    public void setticksToConsumeEntities(int ticksToConsumeEntities) {
        this.ticksToConsumeEntities = ticksToConsumeEntities;
    }

    public List<Entity> getEntitesConsumed() {
        return entitesConsumed;
    }

    public void setEntitesConsumed(List<Entity> entitesConsumed) {
        this.entitesConsumed = entitesConsumed;
    }

    public List<Entity> getEntitesInQueue() {
        return entitesInQueue;
    }

    public void setEntitesInQueue(List<Entity> entitesInQueue) {
        this.entitesInQueue = entitesInQueue;
    }

    //endregion

    public String toString() {

        return "Entites consumed pr. tick: " + ticksToConsumeEntities;
    }
}
