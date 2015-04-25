package models.data;

/**
 * Created by kristinesundtlorentzen on 25/4/15.
 */
public class NodeData {

    public int entitiesTransfered;
    public int entitiesRecieved;
    public int entitiesReady;

    public NodeData(int entitiesTransfered, int entitiesRecieved, int entitiesReady) {
        this.entitiesTransfered = entitiesTransfered;
        this.entitiesRecieved = entitiesRecieved;
        this.entitiesReady = entitiesReady;
    }
}
