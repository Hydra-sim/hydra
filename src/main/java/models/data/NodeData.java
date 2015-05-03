package models.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by kristinesundtlorentzen on 25/4/15.
 */
@Entity
public class NodeData {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    public int entitiesTransfered;
    public int entitiesRecieved;
    public int entitiesReady;

    public NodeData(int entitiesTransfered, int entitiesRecieved, int entitiesReady) {
        this.entitiesTransfered = entitiesTransfered;
        this.entitiesRecieved = entitiesRecieved;
        this.entitiesReady = entitiesReady;
    }
}
