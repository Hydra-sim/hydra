package models;

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

        // Distribute weight producers
        getProducers().forEach(this::distributeWeightIfNotSpecified);

        // Distribute weight consumers
        getConsumers().forEach(this::distributeWeightIfNotSpecified);

        preset = false;
        passwordProtected = false;
        password = null;
    }

    /**
     * Automatically distributes weight to the {@link models.Relationship relationships} if they are all 0.0
     * @param node the node we wish to distribute weight on
     */
    public void distributeWeightIfNotSpecified(Node node) {

        List<Relationship> relationships = node.getRelationships();

        boolean weighted = false;

        for(Relationship relationship : relationships) {

            if(relationship.getWeight() != 0.0) weighted = true;
        }

        if(!weighted) {
            double weight = (double) 1 / relationships.size();

            for (int i = 0; i < relationships.size(); i++) {

                relationships.get(i).setWeight(weight);
            }
        }
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

    public int getStartTick() {
        return startTick;
    }

    public void setStartTick(int startTick) {
        this.startTick = startTick;
    }

    //endregiong
}
