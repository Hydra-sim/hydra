package models;

import helpers.ConsumerHelper;
import helpers.NodeHelper;
import helpers.SimulationHelper;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.mindrot.jbcrypt.BCrypt;

import javax.persistence.*;
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
 * The simulation engine
 * Has information about all the elements of the simulation and calculates and contains the result
 */
@javax.persistence.Entity
public class Simulation
{
    @Transient
    final int MIDNIGHT = 0;
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
    private List<ConsumerGroup> consumerGroups;

    @OneToMany(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Producer> producers;

    private int startTick;
    private int ticks;
    private boolean preset;
    private boolean passwordProtected;
    private String password;
    // private boolean movementBasedOnQueues; //TODO: HPXIVXXI-188
    //endregion

    //region transient attributes
    @Transient
    ConsumerHelper consumerHelper;

    @Transient
    NodeHelper nodeHelper;

    @Transient
    SimulationHelper simulationHelper;
    //endregion

    //region constructors
    public Simulation() {

        this("Untitled simulation", new Date(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), 0);
    }

    public Simulation(String name) {

        this(name, new Date(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), 0);
    }

    public Simulation(String name, List<Consumer> consumers, List<Producer> producers, int ticks) {

        this(name, new Date(), consumers, new ArrayList<>(), producers, ticks);
    }

    public Simulation(String name, List<Consumer> consumers, List<Producer> producers, List<ConsumerGroup> consumerGroups, int ticks) {

        this(name, new Date(), consumers, consumerGroups, producers, ticks);
    }

    public Simulation(String name, List<Consumer> consumers, List<Producer> producers, List<ConsumerGroup> consumerGroups,
                      int startTick, int ticks) {

        this(name, new Date(), consumers, consumerGroups, producers, startTick, ticks);
    }

    public Simulation(String name, Date date, List<Consumer> consumers, List<ConsumerGroup> consumerGroups,
                      List<Producer> producers, int ticks) {

        this(name, date, consumers, consumerGroups, producers, 0, ticks);
    }

    public Simulation(String name, Date date, List<Consumer> consumers, List<ConsumerGroup> consumerGroups,
                      List<Producer> producers, int startTick, int ticks) {
        this.name = name;
        this.date = date;
        this.consumers = consumers;
        this.consumerGroups = consumerGroups;
        this.producers = producers;
        this.startTick = startTick;
        this.ticks = ticks;

        consumerHelper = new ConsumerHelper();
        nodeHelper = new NodeHelper();
        simulationHelper = new SimulationHelper();

        simulationHelper.distributeWeight(this, nodeHelper);

        preset = false;
        passwordProtected = false;
        password = null;
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

    public List<ConsumerGroup> getConsumerGroups() {
        return consumerGroups;
    }

    public void setConsumerGroups(List<ConsumerGroup> consumerGroups) {
        this.consumerGroups = consumerGroups;
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

    public boolean isPasswordProtected() {
        return passwordProtected;
    }

    private void setPasswordProtected(boolean passwordProtected) {
        this.passwordProtected = passwordProtected;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {

        if( password != null ) {

            String hash = BCrypt.hashpw( password, BCrypt.gensalt() );
            this.password = hash;
            setPasswordProtected( true );

        } else {

            setPasswordProtected( false );
            this.password = password;
        }
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
    public static void simulate(Simulation simulation) {

        int maxWaitingTime = 0;

        for(int i = simulation.startTick; i < simulation.startTick + simulation.ticks; i++) {

            // Increase waiting time
            for(Consumer consumer : simulation.consumers)
                simulation.consumerHelper.increaseWaitingTime(consumer);

            simulation.addEntitiesFromProducer(i);

            simulation.addEntitiesFromConsumers();

            simulation.consumeEntities();

            maxWaitingTime = simulation.simulationHelper.calculateWaitingTime(simulation, simulation.consumerHelper, maxWaitingTime);

        }

        simulation.setResult(
                new SimulationResult(
                        simulation.simulationHelper.getEntitesConsumed(simulation),
                        simulation.simulationHelper.getEntitiesInQueue(simulation),
                        maxWaitingTime
                )
        );
    }

    //region simulation methods


    /**
     * Takes the list of entities and deletes them from the list of entities according to the number and strength of
     * the consumers registered in the simulation. Every time an entity is deleted, the method adds 1 to the number of
     * entities consumed.
     * @return The number of entities consumed so far in the simulation + the number of entities consumed during the
     *         running of the method.
     */
    private void consumeEntities() {

        // Consume entities in queue on Consumer
        for(int i = 0; i < consumers.size(); i++) {

            consumerHelper.consumeEntity(consumers.get(i));
        }

        // Consume entities in queue on a ConsumerGroup
        for(ConsumerGroup consumerGroup : consumerGroups) {

            // Distribute the Entities to the Consumers
            // All have equal weight, so relationships are not needed (they use the ConsumerGroup relationship)

            // Get the current entites in queue on current ConsumerGroup
            List<Entity> entitiesToDistribute = consumerGroup.getEntitesInQueue();

            // Take each entity, add it to the queue for a spesific Consumer, and remove it from the list of entities in
            // queue on the current ConsumerGroup
            // Continues to iterate though the Entities untill all have been distributed
            while(!entitiesToDistribute.isEmpty()) {

                for(Consumer consumer : consumerGroup.getConsumers()) {

                    List<Entity> entitiesInQueue = consumer.getEntitesInQueue();
                    entitiesInQueue.add(entitiesToDistribute.get(0));
                    entitiesToDistribute.remove(0);
                    consumer.setEntitesInQueue(entitiesInQueue);
                }
            }

            // Loop through the Consumes in the current ConsumerGroup and consume Entities in queue on the current
            // Consumer
            for(int i = 0; i < consumerGroup.getConsumers().size(); i++) {

                consumerHelper.consumeEntity(consumerGroup.getConsumers().get(i));
            }


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

                                int recieved = consumerHelper.getTotalSentToConsumer(relationship.getChild());
                                double currentWeight = (double) recieved / producer.getEntitiesTransfered();

                                if (currentWeight <= relationship.getWeight() || producer.getEntitiesTransfered() == 0) {

                                    consumerHelper.addEntity(relationship.getChild(), new Entity());
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

        // Current consumer sending entities
        for(Consumer consumer : consumers) {

            List<Relationship> relationships = consumer.getRelationships();

            for(Relationship relationship : relationships) {

                sendEntitiesFromConsumerToConsumerInRelationship(consumer, relationship);
            }
        }

        for(ConsumerGroup consumerGroup : consumerGroups) {

            for( Consumer consumer : consumerGroup.getConsumers() ){

                // Uses the relationship given to the consumerGroup
                List<Relationship> relationships = consumerGroup.getRelationships();

                for(Relationship relationship : relationships) {

                    sendEntitiesFromConsumerToConsumerInRelationship(consumer, relationship);
                }
            }
        }
    }

    private void sendEntitiesFromConsumerToConsumerInRelationship(Consumer sender, Relationship relationship) {

        // If the consumer has any entities to send
        if(sender.getEntitesConsumed().size() != 0) {

            // Number of entities already sent to the receiving consumer
            int received = consumerHelper.getTotalSentToConsumer(relationship.getChild());

            // The percentage of entities already sent from our sending consumer to the receiving consumer
            double currentWeight = (double) received / sender.getEntitiesTransfered();

            // Checks if the percentage already sent to the receiving consumer is equal or greater to what it should
            // have, and runs the code if either this is true, or it is the first entity sent from the sending
            // consumer
            if(currentWeight <= relationship.getWeight() || sender.getEntitiesTransfered() == 0) {

                // Get the data about the entity that is to be sent
                Entity entity = sender.getEntitesConsumed().get(0);

                List<Entity> entities = relationship.getChild().getEntitesInQueue();
                entities.add(entity);
                relationship.getChild().setEntitesInQueue(entities);
            }
        }
    }


    //endregion

    //endregion
}
