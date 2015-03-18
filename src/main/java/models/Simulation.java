package models;

import api.*;
import managers.ConsumerManager;
import managers.NodeManager;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.inject.Named;
import javax.persistence.*;
import java.lang.annotation.Repeatable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * A query to get all Simulations in the database
 */
@NamedQueries({
        @NamedQuery(name = "Simulation.findAll", query = "SELECT a FROM Simulation a"),
        @NamedQuery(name = "Simulation.findPresets", query = "SELECT a FROM Simulation a WHERE preset = TRUE"),
        @NamedQuery(name = "Simulation.findNotPreset", query = "SELECT a FROM Simulation a WHERE preset = FALSE")
})

/**
 * Created by knarf on 10/02/15.
 */
@javax.persistence.Entity
public class Simulation
{
    //region persistant attributes
    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    /**
     * The simulation name, limited to 255 characters
     */
    @NotBlank
    @Length(max = 255)
    private String name;

    /**
     * Date the simulation was created
     */
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    /**
     * Result of the simulation
     */
    @OneToOne(cascade = CascadeType.ALL)
    private SimulationResult result;

    @OneToMany(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Consumer> consumers;

    @OneToMany(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Producer> producers;

    private int ticks;

    private boolean preset;
    //endregion

    //region transient attributes
    @Transient
    ConsumerManager consumerManager;

    @Transient
    NodeManager nodeManager;
    //endregion

    //region constructors
    public Simulation() {

        this("Untitled simulation", new Date(), new ArrayList<>(), new ArrayList<>(), 0);
    }

    public Simulation(String name) {

        this(name, new Date(), new ArrayList<>(), new ArrayList<>(), 0);
    }

    public Simulation(String name, List<Consumer> consumers, List<Producer> producers, int ticks) {

        this(name, new Date(), consumers, producers, ticks);
    }

    public Simulation(String name, Date date, List<Consumer> consumers, List<Producer> producers, int ticks) {
        this.name = name;
        this.date = date;
        this.consumers = consumers;
        this.producers = producers;
        this.ticks = ticks;

        consumerManager = new ConsumerManager();
        nodeManager = new NodeManager();

        distributeWeightConsumers();
        distributeWeightProducers();

        preset = false;
    }
    //endregion

    //region getters and setters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public SimulationResult getResult() {
        return result;
    }

    public void setResult(SimulationResult result) {
        this.result = result;
    }

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

    public boolean isPreset() {
        return preset;
    }

    public void setPreset(boolean preset) {
        this.preset = preset;
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
     * @return A {@link models.SimulationResult} object with entities consumed, entities left in queue and max waiting time.
     */
    public void simulate() {

        int maxWaitingTime = 0;

        for(int i = 0; i < ticks; i++) {

            increaseWaitingTime();

            addEntitiesFromProducer(i);

            addEntitiesFromConsumers();

            consumeEntities();

            maxWaitingTime = calculateWaitingTime(maxWaitingTime);

        }

        setResult(new SimulationResult(getEntitesConsumed(), getEntitiesInQueue(), maxWaitingTime));
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

            int waitingTime = consumerManager.getMaxWaitingTime(consumer);
            if(waitingTime > maxWaitingTime) maxWaitingTime = waitingTime;
        }

        return maxWaitingTime;
    }

    /**
     * Takes the list of entities and deletes them from the list of entities according to the number and strength of
     * the consumers registered in the simulation. Every time an entity is deleted, the method adds 1 to the number of
     * entities consumed.
     * @return The number of entities consumed so far in the simulation + the number of entities consumed during the
     *         running of the method.
     */
    private void consumeEntities() {

        for(int i = 0; i < consumers.size(); i++) {

            consumerManager.consumeEntity(consumers.get(i));
        }
    }

    /**
     * Adds entities to the list of entities according to the number and strength of the producers registered in the
     * simulation.
     *
     * @param currentTick The current tick number the simulation is on, to check if it is time for the producer to
     *                    produce entities.
     */
    private void addEntitiesFromProducer(int currentTick) {

        for(Producer producer : producers) {

            models.Timetable timetable = producer.getTimetable();

            for(int i = 0; i < timetable.getArrivals().size(); i++) {

                if(timetable.getArrivals().get(i).getTime() == currentTick) {

                    if (producer.getRelationships().size() != 0) {

                        List<Relationship> relationships = producer.getRelationships();

                        for (int j = 0; j < timetable.getArrivals().get(i).getPassengers(); j++) {

                            for (Relationship relationship : relationships) {

                                int recieved = consumerManager.getTotalSentToConsumer(relationship.getChild());
                                double currentWeight = (double) recieved / producer.getEntitiesTransfered();

                                if (currentWeight <= relationship.getWeight() || producer.getEntitiesTransfered() == 0) {

                                    consumerManager.addEntity(relationship.getChild(), new Entity());
                                    producer.setEntitiesTransfered(producer.getEntitiesTransfered() + 1);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private void addEntitiesFromConsumers() {

        for(Consumer consumer : consumers) {

            List<Relationship> relationships = consumer.getRelationships();

            for(Relationship relationship : relationships) {

                int recieved = consumerManager.getTotalSentToConsumer(relationship.getChild());
                double currentWeight = (double) recieved / consumer.getEntitiesTransfered();

                if(currentWeight <= relationship.getWeight() || consumer.getEntitiesTransfered() == 0) {

                    if(consumer.getEntitesConsumed().size() != 0) {

                        Entity entity = consumer.getEntitesConsumed().get(0);
                        consumerManager.addEntity(relationship.getChild(), entity);
                    }
                }
            }
        }
    }

    /**
     * Increases the waiting time of all the entities that have not been consumed by 1.
     */
    private void increaseWaitingTime() {


        for(int i = 0; i < consumers.size(); i++) {

            consumerManager.increaseWaitingTime(consumers.get(i), 1);
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

            entitiesConsumed += consumer.getEntitesConsumed().size();
        }

        return entitiesConsumed;
    }

    private void distributeWeightProducers() {

        for (int i = 0; i < producers.size(); i++) {

            nodeManager.distributeWeightIfNotSpecified(producers.get(i));
        }
    }

    private void distributeWeightConsumers() {

        for(int i = 0; i < consumers.size(); i++) {

            nodeManager.distributeWeightIfNotSpecified(consumers.get(i));
        }
    }
    //endregion

    //endregion
}
