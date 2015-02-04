/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class Consumer {

    private int entitesConsumedPerTick;

    //region constructors
    public Consumer() {
        this.entitesConsumedPerTick = 0;
    }

    public Consumer(int entitesConsumedPerTick) {
        this.entitesConsumedPerTick = entitesConsumedPerTick;
    }
    //endregion

    //region getters and setters
    public int getEntitesConsumedPerTick() {
        return entitesConsumedPerTick;
    }

    public void setEntitesConsumedPerTick(int entitesConsumedPerTick) {
        this.entitesConsumedPerTick = entitesConsumedPerTick;
    }
    //endregion
}
