import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class Simulation {

    private List<Consumer> consumers;
    private List<Producer> producers;
    private int ticks;

    //region constructors
    public Simulation() {

        consumers = new ArrayList<>();
        producers = new ArrayList<>();
        ticks = 0;
    }

    public Simulation(List<Consumer> consumers, List<Producer> producers, int ticks) {
        this.consumers = consumers;
        this.producers = producers;
        this.ticks = ticks;
    }
    //endregion

    //region getters and setters
    public List<Consumer> getConsumers() {
        return consumers;
    }

    public void setConsumers(List<Consumer> consumers) {
        this.consumers = consumers;
    }

    public List<Producer> getProducers() {
        return producers;
    }

    public void setProducers(List<Producer> producers) {
        this.producers = producers;
    }

    public int getTicks() {
        return ticks;
    }

    public void setTicks(int ticks) {
        this.ticks = ticks;
    }
    //endregion

    public SimulationData simulate() {

        int entitiesProduced, entitiesConsumed;

        entitiesProduced = entitiesConsumed = 0;

        for(int i = 0; i < ticks; i++) {

            for(Producer producer : producers) {

                if(i == 0 || producer.getTicksToWait() % i == 0) {

                    entitiesProduced += producer.getEntitiesToProduce();
                }
            }

            for(Consumer consumer : consumers) {

                entitiesConsumed += consumer.getEntitesConsumedPerTick();
            }

        }

        if(entitiesConsumed > entitiesProduced) entitiesConsumed = entitiesProduced;

        int entitesInQueue = entitiesProduced - entitiesConsumed;
        if(entitesInQueue < 0) entitesInQueue = 0;

        return new SimulationData(entitiesConsumed, entitesInQueue, 0);
    }
}
