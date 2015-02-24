package pojos;

import interfaces.Node;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class Consumer implements Node{

    private int entitesConsumedPerTick;
    private int entitesConsumed;
    private List<Entity> entitesInQueue;

    //region constructors
    public Consumer() {
        this(0);
    }

    public Consumer(int entitesConsumedPerTick) {
        this.entitesConsumedPerTick = entitesConsumedPerTick;
        this.entitesConsumed = 0;
        this.entitesInQueue = new ArrayList<>();
    }
    //endregion

    //region getters and setters

    public int getEntitesConsumedPerTick() {
        return entitesConsumedPerTick;
    }

    public void setEntitesConsumedPerTick(int entitesConsumedPerTick) {
        this.entitesConsumedPerTick = entitesConsumedPerTick;
    }

    public int getEntitesConsumed() {
        return entitesConsumed;
    }

    public void setEntitesConsumed(int entitesConsumed) {
        this.entitesConsumed = entitesConsumed;
    }

    public List<Entity> getEntitesInQueue() {
        return entitesInQueue;
    }

    public void setEntitesInQueue(List<Entity> entitesInQueue) {
        this.entitesInQueue = entitesInQueue;
    }

    //endregion

    public String toString() {

        return "Entites consumed pr. tick: " + entitesConsumedPerTick;
    }
}
