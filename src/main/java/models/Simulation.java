package models;

import helpers.SimulationHelper;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
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
    // region persistant attributes
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
    private List<Node> nodes;

    @OneToMany(cascade= CascadeType.ALL, fetch = FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    private List<Relationship> relationships;

    private int startTick;
    private int ticks;
    private boolean preset;
    private boolean passwordProtected;
    private String password;
    private int tickBreakpoints;

    // endregion

    // region constructors
    public Simulation() {

        this("Untitled simulation");
    }

    public Simulation(String name) {

        this(name, 0);
    }

    public Simulation(String name, int ticks) {

        this(name, new Date(), new ArrayList<>(), new ArrayList<>(), 0, ticks, 0);
    }

    public Simulation(String name, List<Node> nodes, List<Relationship> relationships, int ticks) {

        this(name, new Date(), nodes, relationships, 0, ticks, 0);
    }


    public Simulation(String name, Date date, List<Node> nodes, List<Relationship> relationships, int startTick, int ticks, int tickBreakpoints) {
        this.name = name;
        this.date = date;
        this.nodes = nodes;
        this.relationships = relationships;
        this.startTick = startTick;
        this.ticks = ticks;
        this.tickBreakpoints = tickBreakpoints;

        this.nodes.forEach(this::distributeWeightIfNotSpecified);

        preset = false;
        passwordProtected = false;
        password = null;
    }

    /**
     * Automatically distributes weight to the {@link models.Relationship relationships} if they are all 0.0
     * @param node the node we wish to distribute weight on
     */
    public void distributeWeightIfNotSpecified(Node node) {

        boolean weighted = false;

        for(Relationship relationship : relationships) {

            if(relationship.getSource() == node) {

                if (relationship.getWeight() != 0.0) weighted = true;
            }
        }

        if(!weighted) {
            double weight = (double) 1 / relationships.size();

            relationships.stream().filter(relationship
                    -> relationship.getSource() == node).forEach(relationship
                    -> relationship.setWeight(weight));
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

    public List<Node> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
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

    public List<Relationship> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<Relationship> relationships) {
        this.relationships = relationships;
    }

    public int getTickBreakpoints() {
        return tickBreakpoints;
    }

    public void setTickBreakpoints(int tickBreakpoints) {
        this.tickBreakpoints = tickBreakpoints;
    }

    //endregion

    public void simulate() {

        new SimulationHelper().simulate(this);
    }
}
