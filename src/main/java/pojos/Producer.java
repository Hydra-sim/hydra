package pojos;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class Producer {

    private int entitiesToProduce;
    private int ticksToWait;

    //region constructors
    public Producer() {

        this(0, 0);
    }

    public Producer(int entitiesToProduce, int ticksToWait) {
        this.entitiesToProduce = entitiesToProduce;
        this.ticksToWait = ticksToWait;
    }
    //endregion

    //region getters and setters
    public int getEntitiesToProduce() {
        return entitiesToProduce;
    }

    public void setEntitiesToProduce(int entitiesToProduce) {
        this.entitiesToProduce = entitiesToProduce;
    }

    public int getTicksToWait() {
        return ticksToWait;
    }

    public void setTicksToWait(int ticksToWait) {
        this.ticksToWait = ticksToWait;
    }
    //endregion

    public String toString() {

        return "Entities to produce: " + entitiesToProduce +
                "Ticks to wait: " + ticksToWait;
    }
}
