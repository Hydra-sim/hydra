package models;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import javax.persistence.Entity;
import java.util.Date;

/**
 * A query to get all Simulations in the database
 */
@NamedQuery(name = "Simulation.findAll", query = "SELECT a FROM Simulation a")

/**
 * Created by knarf on 10/02/15.
 */
@Entity
public class Simulation
{
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
    @OneToOne(cascade = {CascadeType.ALL})
    private SimulationData result;

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

    public int getId() {
        return id;
    }

    public SimulationData getResult() {
        return result;
    }

    public void setResult(SimulationData result) {
        this.result = result;
    }

    public Simulation(String name, Date date) {
        this.name = name;
        this.date = date;
    }

    public Simulation(String name) {
        this.name = name;
        this.date = new Date();
    }

    public Simulation() {
        this.name = "Untitled Simulation";
        this.date = new Date();
    }
}
