package models.data;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by kristinesundtlorentzen on 25/4/15.
 */
@Entity
public class ConsumerData {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    public int entitiesInQueue;
    public int entitiesConsumed;
    public int maxWaitingTime;

    public ConsumerData() {

    }

    public ConsumerData(int entitiesInQueue, int entitiesConsumed, int maxWaitingTime) {
        this.entitiesInQueue = entitiesInQueue;
        this.entitiesConsumed = entitiesConsumed;
        this.maxWaitingTime = maxWaitingTime;
    }
}
