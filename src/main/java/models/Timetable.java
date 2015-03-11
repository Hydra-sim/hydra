package models;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import javax.persistence.criteria.Fetch;
import java.util.List;


/**
 * A query to get all Timetables in the database
 */
@NamedQuery(name = "Timetable.findAll", query = "SELECT a FROM Timetable a")

/**
 * Created by knarf on 10/03/15.
 */
@javax.persistence.Entity
public class Timetable {
    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    /**
     * The timetable name, limited to 255 characters
     */
    @NotBlank
    @Length(max = 255)
    private String name;

    /**
     * Simulation123 starts at tick = 0. The ints in this list represent the number of ticks after 0 it should produce its
     * entities.
     */
    @OneToMany(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    private List<TimetableEntry> arrivals;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<TimetableEntry> getArrivals() {
        return arrivals;
    }

    public void setArrivals(List<TimetableEntry> arrivals) {
        this.arrivals = arrivals;
    }

    public int getId() {
        return id;
    }
}
