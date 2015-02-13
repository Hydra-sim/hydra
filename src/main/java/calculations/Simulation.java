package calculations;

import pojos.Consumer;
import pojos.Entity;
import pojos.Producer;
import pojos.SimulationData;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class Simulation {

    private List<Consumer> consumers;
    private List<Producer> producers;
    private int ticks;
    List<Entity> entities;

    //region constructors
    public Simulation() {

        this(new ArrayList<>(), new ArrayList<>(), 0);
    }

    public Simulation(List<Consumer> consumers, List<Producer> producers, int ticks) {
        this.consumers = consumers;
        this.producers = producers;
        this.ticks = ticks;
        entities = new ArrayList<>();
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

    public String toString() {

        return "Producers: " + producers.toString() + "\n" +
                "Consumers: " + consumers.toString() + "\n" +
                "Ticks: " + ticks;
    }

    //region simulation
    public SimulationData simulate() {

        entities = new ArrayList<>();
        int maxWaitingTime = 0;

        int entitiesConsumed = 0;

        for(int i = 0; i < ticks; i++) {

            increaseWaitingTime();

            addEntities(i);

            entitiesConsumed = consumeEntities(entitiesConsumed);

            maxWaitingTime = calculateWaitingTime(maxWaitingTime);

        }

        return new SimulationData(entitiesConsumed, entities.size(), maxWaitingTime);
    }

    private int calculateWaitingTime(int maxWaitingTime) {

        if(entities.size() == 0) return 0;
        Collections.sort(entities);
        int temp = entities.get(0).getWaitingTimeInTicks();

        if(temp > maxWaitingTime) return temp;
        return maxWaitingTime;

    }

    private int consumeEntities(int entitiesConsumed) {

        for(Consumer consumer : consumers) {

            for (int j = 0; j < consumer.getEntitesConsumedPerTick(); j++) {
                if (entities.size() != 0) entities.remove(0);
                else break;
                entitiesConsumed++;
            }
        }

        return entitiesConsumed;
    }

    private void addEntities(int i) {

        for(Producer producer : producers) {

            if(i == 0 || producer.getTicksToWait() == 0 || i % producer.getTicksToWait() == 0) {

                for(int j = 0; j < producer.getEntitiesToProduce(); j++) {
                    entities.add(new Entity(1));
                }
            }
        }
    }

    private void increaseWaitingTime() {

        for(Entity entity : entities) {

            entity.setWaitingTimeInTicks(entity.getWaitingTimeInTicks() + 1 );
        }
    }
    //endregion
}
