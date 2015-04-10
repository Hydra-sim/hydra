package models;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * A dataentry in a {@link models.Timetable}
 */
@javax.persistence.Entity
public class TimetableEntry {

    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    private int time;

    private int passengers;

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public int getPassengers() {
        return passengers;
    }

    public void setPassengers(int passengers) {
        this.passengers = passengers;
    }

    public TimetableEntry() {
    }

    public TimetableEntry(int time, int passengers) {
        this.time = time;
        this.passengers = passengers;
    }
}
