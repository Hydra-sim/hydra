package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Used to represent units like doors, terminals and other units that consume time for an {@link models.Entity}.
 * Has all the attributes of {@link Node a node}, a name, a value representing how long it takes to consume an entity, a list of entities currently queueing to
 * get consumed, and the number of entities that have been consumed.
 */
@javax.persistence.Entity
public class Consumer extends Node{

    private String name;

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

        this("Untitled", ticksToConsumeEntities);
    }

    public Consumer(int ticksToConsumeEntities, int x, int y) {

        this("Untitled", ticksToConsumeEntities);
        this.setX(x);
        this.setY(y);
    }

    public Consumer(String name, int ticksToConsumeEntities) {

        this.name = name;
        this.ticksToConsumeEntities = ticksToConsumeEntities;
        this.entitesConsumed = new ArrayList<>();
        this.entitesInQueue = new ArrayList<>();
    }
    //endregion

    //region getters and setters

    public int getTicksToConsumeEntities() {
        return ticksToConsumeEntities;
    }

    public void setTicksToConsumeEntities(int ticksToConsumeEntities) {
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    //endregion

    public String toString() {

        return "Entites consumed pr. tick: " + ticksToConsumeEntities;
    }
}
