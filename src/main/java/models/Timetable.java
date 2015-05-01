package models;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;


/**
 * A query to get all Timetables in the database
 */
@NamedQuery(name = "Timetable.findAll", query = "SELECT a FROM Timetable a")

/**
 * Used by {@link models.Producer producers} to dictate when the producers is to produces its entites, and how many
 * entities to produce per. arrival.
 */
@javax.persistence.Entity
public class Timetable {

    //region attributes
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
    @Fetch(FetchMode.SUBSELECT)
    private List<TimetableEntry> arrivals;
    //endregion


    //region getters and setters
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
    //endregion

    //region constructors
    public Timetable() {
        this(new ArrayList<>(), "Undefined");
    }

    public Timetable(String name) {
        this(new ArrayList<>(), name);
    }

    public Timetable(List<TimetableEntry> arrivals, String name) {
        this.arrivals = arrivals;
        this.name = name;
    }
    //endregion

    public static Timetable getTimetableFromCsv(InputStream is, String name) {

        List<TimetableEntry> entries = new ArrayList<>();

        Scanner scanner = new Scanner(is);

        scanner.nextLine(); //Column names

        while(scanner.hasNextLine()) {

            String[] data = scanner.nextLine().split(",");

            String[] times = data[0].split(":");

            int hours = Integer.parseInt(times[0]);
            int minutes = Integer.parseInt(times[1]);
            int seconds = Integer.parseInt(times[2]);

            int tick = (hours * 60 * 60) + (minutes * 60) + seconds;

            int passengers = Integer.parseInt(data[1]);
            entries.add(new TimetableEntry(tick, passengers));
        }

        return new Timetable(entries, name);
    }
}
