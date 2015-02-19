package calculations;

import pojos.Consumer;
import pojos.Entity;
import pojos.Producer;
import pojos.SimulationData;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * This class represents the simulation engine in its current state.
 *
 * @author Kristine Sundt Lorentzen
 */
public class Simulation {

    //region attributes
    private List<Consumer> consumers;
    private List<Producer> producers;
    private int ticks;
    List<Entity> entities;
    //endregion

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

    //region getters, setters and toString
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

    public String toString() {

        return "Producers: " + producers.toString() + "\n" +
                "Consumers: " + consumers.toString() + "\n" +
                "Ticks: " + ticks;
    }
    //endregion

    //region simulation

    /**
     * This method simulates the trafic flow from the producers, through all the cosumers.
     *
     * Changelog:
     *
     * 13.02.2015, Kristine: The algorithm uses one list of producers and one list of consumers to add entities to
     * and remove entities from the list over entities. It uses the list of entities to check which one has the
     * highest waiting time at the end of the simulation.
     *
     * @return A {@link pojos.SimulationData} object with entities consumed, entities left in queue and max waiting time.
     */
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

    //region simulation methods

    /**
     * Checks which entity has the longest waiting time registered on it, and checks if this is higher than the highest
     * waiting time registered so far in the simulation.
     *
     * @param maxWaitingTime The largest of the registered waiting times so far in the simulation
     *
     * @return Whichever value is largest of the registered waiting times so far in the simulation and the highest
     *         waiting time of the entities registered on the entities list.
     */
    private int calculateWaitingTime(int maxWaitingTime) {

        if(entities.size() == 0) return 0;
        Collections.sort(entities);
        int temp = entities.get(0).getWaitingTimeInTicks();

        if(temp > maxWaitingTime) return temp;
        return maxWaitingTime;

    }

    /**
     * Takes the list of entities and deletes them from the list of entities according to the number and strength of
     * the consumers registered in the simulation. Every time an entity is deleted, the method adds 1 to the number of
     * entities consumed.
     * @param entitiesConsumed The number of entites consumed so far in the simulation
     * @return The number of entities consumed so far in the simulation + the number of entities consumed during the
     *         running of the method.
     */
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

    /**
     * Adds entities to the list of entities according to the number and strength of the producers registered in the
     * simulation.
     *
     * @param currentTick The current tick number the simulation is on, to check if it is time for the producer to
     *                    produce entities.
     */
    private void addEntities(int currentTick) {

        for(Producer producer : producers) {

            if(currentTick == 0 || producer.getTicksToWait() == 0 || currentTick % producer.getTicksToWait() == 0) {

                for(int j = 0; j < producer.getEntitiesToProduce(); j++) {
                    entities.add(new Entity(1));
                }
            }
        }
    }

    /**
     * Increases the waiting time of all the entities that have not been consumed by 1.
     */
    private void increaseWaitingTime() {

        for(Entity entity : entities) {

            entity.setWaitingTimeInTicks(entity.getWaitingTimeInTicks() + 1 );
        }
    }
    //endregion

    //endregion
}
