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

        List<Entity> entities = new ArrayList<>();

        int entitiesConsumed = 0;

        for(int i = 0; i < ticks; i++) {

            for(Entity entity : entities) {

                entity.setWaitingTimeInTicks(entity.getWaitingTimeInTicks() + 1 );
            }

            for(Producer producer : producers) {

                if(i == 0 || producer.getTicksToWait() % i == 0) {

                    for(int j = 0; j < producer.getEntitiesToProduce(); j++) {
                        entities.add(new Entity(0));
                    }
                }
            }

            for(Consumer consumer : consumers) {

                for (int j = 0; j < consumer.getEntitesConsumedPerTick(); j++) {
                    if (entities.size() != 0) entities.remove(0);
                    else break;
                    entitiesConsumed++;
                }
            }

        }
        //Calculate longest waiting time in ticks

        int maxWaitingTime;
        if(entities.size() == 0) maxWaitingTime = 0;
        else maxWaitingTime = entities.get(0).getWaitingTimeInTicks();

        return new SimulationData(entitiesConsumed, entities.size(), maxWaitingTime);
    }
}
