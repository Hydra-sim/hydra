package calculations;

import controllers.ConsumerController;
import controllers.DependencyController;
import interfaces.Node;
import pojos.*;

import java.util.ArrayList;
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
    private List<Dependency> dependencies;
    private int ticks;

    ConsumerController consumerController;
    DependencyController dependencyController;
    //endregion

    //region constructors
    public Simulation() {

        this(new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), 0);
    }

    public Simulation(List<Consumer> consumers, List<Producer> producers, int ticks) {
        this(consumers, producers, new ArrayList<>(), ticks);
    }

    public Simulation(List<Consumer> consumers, List<Producer> producers, List<Dependency> dependencies, int ticks) {
        this.consumers = consumers;
        this.producers = producers;
        this.dependencies = dependencies;
        this.ticks = ticks;

        consumerController = new ConsumerController();
        dependencyController = new DependencyController();
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

        int maxWaitingTime = 0;

        for(int i = 0; i < ticks; i++) {

            increaseWaitingTime();

            addEntities(i);

            consumeEntities();

            maxWaitingTime = calculateWaitingTime(maxWaitingTime);

        }

        return new SimulationData(getEntitesConsumed(), getEntitiesInQueue(), maxWaitingTime);
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

        for(Consumer consumer : consumers) {

            int waitingTime = consumerController.getMaxWaitingTime(consumer);
            if(waitingTime > maxWaitingTime) maxWaitingTime = waitingTime;
        }

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
    private void consumeEntities() {

        for(int i = 0; i < consumers.size(); i++) {

            consumerController.consumeEntity(consumers.get(0));
        }
    }

    /**
     * Adds entities to the list of entities according to the number and strength of the producers registered in the
     * simulation.
     *
     * @param currentTick The current tick number the simulation is on, to check if it is time for the producer to
     *                    produce entities.
     */
    private void addEntities(int currentTick) {

        for(int i = 0; i < producers.size(); i++) {

            if(currentTick % producers.get(i).getTicksToWait() == 0) {

                List<Dependency> currentDependencies = getCurrentDependencies(i);

                for(Dependency dependency : currentDependencies) {

                    Node node = dependencyController.getDependantID(dependency, producers.get(i));
                    int index = consumers.indexOf(node);
                    Consumer consumer = consumers.get(index);
                    ConsumerController consumerController = new ConsumerController();

                    for(int j = 0; j < producers.get(i).getEntitiesToProduce(); j++) {

                        consumerController.addEntity(consumer, new Entity());
                    }
                }
            }
        }
    }

    private List<Dependency> getCurrentDependencies(int i) {

        List<Dependency> currentDependencies = new ArrayList<>();

        for(Dependency dependency : dependencies) {

            Node node = dependencyController.getDependantID(dependency, producers.get(i));

            if(node != null) {

                currentDependencies.add(dependency);
            }
        }

        return currentDependencies;
    }

    /**
     * Increases the waiting time of all the entities that have not been consumed by 1.
     */
    private void increaseWaitingTime() {


        for(int i = 0; i < consumers.size(); i++) {

            consumerController.increaseWaitingTime(consumers.get(i), 1);
        }
    }

    private int getEntitiesInQueue() {

        int entitiesInQueue = 0;

        for(Consumer consumer : consumers) {

            entitiesInQueue += consumer.getEntitesInQueue().size();
        }

        return entitiesInQueue;
    }

    private int getEntitesConsumed() {

        int entitiesConsumed = 0;

        for(Consumer consumer : consumers) {

            entitiesConsumed += consumer.getEntitesConsumed();
        }

        return entitiesConsumed;
    }

    //endregion

    //endregion
}
