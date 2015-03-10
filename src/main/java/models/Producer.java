package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
@javax.persistence.Entity
public class Producer extends Node{


    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    private int entitiesToProduce;

    /**
     * Simulation123 starts at tick = 0. The ints in this list represent the number of ticks after 0 it should produce its
     * entities.
     */
    @Transient
    @ElementCollection
    private List<Integer> timetable;

    //region constructors
    public Producer() {

        this(0, new ArrayList<>());
    }

    public Producer(int entitiesToProduce, List<Integer> timetable) {
        setEntitiesToProduce(entitiesToProduce);

    }

    //endregion

    //region getters and setters

    public int getEntitiesToProduce() {
        return entitiesToProduce;
    }

    public void setEntitiesToProduce(int entitiesToProduce) {

        if(entitiesToProduce == 0) this.entitiesToProduce = 1;
        else this.entitiesToProduce = entitiesToProduce;
    }

    public List<Integer> getTimetable() {
        return timetable;
    }

    public void setTimetable(List<Integer> timetable) {
        this.timetable = timetable;
    }

    //endregion

    public String toString() {

        return "Entities to produce: " + entitiesToProduce +
                "\nNumber of producers:" + timetable.size();
    }
}