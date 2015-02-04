/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class Entity {

    private int waitingTimeInTicks;

    //region constructor
    public Entity() {

        this.waitingTimeInTicks = 0;
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
}
