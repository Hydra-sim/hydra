package models;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
@javax.persistence.Entity
public class Producer extends Node{

    /**
    private int entitiesToProduce;

    /**
     * Simulation123 starts at tick = 0. The ints in this list represent the number of ticks after 0 it should produce its
     * entities.

    @Transient
    @ElementCollection
    private List<Integer> timetable;
    */
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
