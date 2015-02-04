/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class SimulationData {

    private int entitiesConsumed;
    private int entitiesInQueue;
    private int maxWaitingTimeInTicks;

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
