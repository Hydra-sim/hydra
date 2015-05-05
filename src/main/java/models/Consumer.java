package models;

import models.data.ConsumerData;

import javax.persistence.Transient;
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

    private int ticksToConsumeEntity;

    private int maxWaitingTime;

    @Transient
    private boolean busStop_inUse;

    @Transient
    private int busStop_tickArrival;

    @Transient
    private List<ConsumerData> consumerDataList;

    @Transient
    private List<Entity> entitiesConsumed;

    @Transient
    private List<Entity> entitiesInQueue;

    //region constructors
    public Consumer() {
        this(0);
    }

    public Consumer(int ticksToConsumeEntity) {

        this("Untitled", ticksToConsumeEntity);
    }

    public Consumer(int ticksToConsumeEntity, int x, int y) {

        this("Untitled", ticksToConsumeEntity);
        this.setX(x);
        this.setY(y);
    }

    public Consumer(String name, int ticksToConsumeEntity) {

        this.name = name;
        setTicksToConsumeEntity(ticksToConsumeEntity);
        this.entitiesConsumed = new ArrayList<>();
        this.entitiesInQueue = new ArrayList<>();
        this.consumerDataList = new ArrayList<>();
        this.maxWaitingTime = 0;
        this.busStop_inUse = false;
        this.busStop_tickArrival = -1;
    }
    //endregion

    //region getters and setters

    public int getTicksToConsumeEntity() {
        return ticksToConsumeEntity;
    }

    public void setTicksToConsumeEntity(int ticksToConsumeEntity) {

        if(ticksToConsumeEntity == 0) this.ticksToConsumeEntity = 1;
        else this.ticksToConsumeEntity = ticksToConsumeEntity;
    }

    public List<Entity> getEntitiesConsumed() {
        return entitiesConsumed;
    }

    public void setEntitiesConsumed(List<Entity> entitiesConsumed) {
        this.entitiesConsumed = entitiesConsumed;
    }

    public List<Entity> getEntitiesInQueue() {
        return entitiesInQueue;
    }

    public void setEntitiesInQueue(List<Entity> entitiesInQueue) {

        this.entitiesInQueue = entitiesInQueue;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ConsumerData> getConsumerDataList() {
        return consumerDataList;
    }

    public void setConsumerDataList(List<ConsumerData> consumerDataList) {
        this.consumerDataList = consumerDataList;
    }

    public int getMaxWaitingTime() {
        return maxWaitingTime;
    }

    public void setMaxWaitingTime(int maxWaitingTime) {
        this.maxWaitingTime = maxWaitingTime;
    }

    public boolean isBusStop_inUse() {
        return busStop_inUse;
    }

    public void setBusStop_inUse(boolean busStop_inUse) {
        this.busStop_inUse = busStop_inUse;
        this.busStop_tickArrival = -1;
    }

    public int getBusStop_tickArrival() {
        return busStop_tickArrival;
    }

    public void setBusStop_tickArrival(int busStop_tickArrival) {
        this.busStop_tickArrival = busStop_tickArrival;
    }

    //endregion

    public String toString() {

        return "Entites consumed pr. tick: " + ticksToConsumeEntity;
    }
}
