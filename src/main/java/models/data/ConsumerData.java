package models.data;

/**
 * Created by kristinesundtlorentzen on 25/4/15.
 */
public class ConsumerData {

    public int entitiesInQueue;
    public int entitiesConsumed;
    public int maxWaitingTime;

    public ConsumerData(int entitiesInQueue, int entitiesConsumed, int maxWaitingTime) {
        this.entitiesInQueue = entitiesInQueue;
        this.entitiesConsumed = entitiesConsumed;
        this.maxWaitingTime = maxWaitingTime;
    }
}
