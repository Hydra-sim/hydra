package models;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

/**
 * Represents something bringing {@link models.Entity entities} to a location.
 * Has a {@link models.Timetable}.
 */
@javax.persistence.Entity
public class Producer extends Node{

    @ManyToOne(cascade= CascadeType.ALL, fetch = FetchType.EAGER)
    Timetable timetable;

    //region constructors

    public Producer(Timetable timetable) {
        this.timetable = timetable;
    }


    public Producer() {
        this(new Timetable());
    }

    //endregion

    //region getters and setters

    public Timetable getTimetable() {
        return timetable;
    }

    public void setTimetable(Timetable timetable) {
        this.timetable = timetable;
    }

    //endregion
}
