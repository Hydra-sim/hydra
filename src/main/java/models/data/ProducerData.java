package models.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by kristinesundtlorentzen on 25/4/15.
 */
@Entity
public class ProducerData {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    // Entities produced is covered by NodeData.entitiesTransfered
    public int arrivals;

    public int numberOfBusesInQueue;

    public ProducerData() {

    }

    public ProducerData(int arrivals) {
        this(arrivals, 0);
    }

    public ProducerData(int arrivals, int numberOfBusesInQueue) {
        this.arrivals = arrivals;
        this.numberOfBusesInQueue = numberOfBusesInQueue;
    }
}
