package models;

/**
 * Represents a person traveling through the location.
 * Has a value containing how many ticks the entity have waited on all the conumers it's been at combined.
 */
public class Entity implements Comparable<Entity>{

    private int waitingTimeInTicks;

    //region constructor
    public Entity() {

        this(0);
    }

    public Entity(int waitingTimeInTicks) {
        this.waitingTimeInTicks = waitingTimeInTicks;
    }
    //endregion

    //region getters and setters
    public int getWaitingTimeInTicks() {
        return waitingTimeInTicks;
    }

    public void setWaitingTimeInTicks(int waitingTimeInTicks) {
        this.waitingTimeInTicks = waitingTimeInTicks;
    }
    //endregion

    @Override
    public int compareTo(Entity o) {
        if(o == this) return 0;

        if(o.getWaitingTimeInTicks() > getWaitingTimeInTicks()) return 1;
        return -1;
    }
}
