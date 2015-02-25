package models;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
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
