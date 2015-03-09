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

    private int entitesConsumedPerTick;

    @Transient
    private List<Entity> entitesConsumed;

    @Transient
    private List<Entity> entitesInQueue;

    //region constructors
    public Consumer() {
        this(0);
    }

    public Consumer(int entitesConsumedPerTick) {
        this.entitesConsumedPerTick = entitesConsumedPerTick;
        this.entitesConsumed = new ArrayList<>();
        this.entitesInQueue = new ArrayList<>();
    }
    //endregion

    //region getters and setters

    public int getEntitesConsumedPerTick() {
        return entitesConsumedPerTick;
    }

    public void setEntitesConsumedPerTick(int entitesConsumedPerTick) {
        this.entitesConsumedPerTick = entitesConsumedPerTick;
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

        return "Entites consumed pr. tick: " + entitesConsumedPerTick;
    }
}
