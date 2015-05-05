package models;

import models.data.ProducerData;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents something bringing {@link models.Entity entities} to a location.
 * Has a {@link models.Timetable}.
 */
@javax.persistence.Entity
public class Producer extends Node{

    @ManyToOne(cascade= CascadeType.ALL, fetch = FetchType.EAGER)
    Timetable timetable;

    @Transient
    List<ProducerData> producerDataList;

    int numberOfArrivals;

    //region constructors
    public Producer() {
        this(new Timetable());
    }

    public Producer(Timetable timetable) {
        this.timetable = timetable;
        producerDataList = new ArrayList<>();
    }

    public Producer(Timetable timetable, int x, int y) {
        this.timetable = timetable;
        this.setX(x);
        this.setY(y);
        this.producerDataList = new ArrayList<>();
        this.numberOfArrivals = 0;
    }


    //endregion

    //region getters and setters

    public Timetable getTimetable() {
        return timetable;
    }

    public void setTimetable(Timetable timetable) {
        this.timetable = timetable;
    }

    public List<ProducerData> getProducerDataList() {
        return producerDataList;
    }

    public void setProducerDataList(List<ProducerData> producerDataList) {
        this.producerDataList = producerDataList;
    }

    public int getNumberOfArrivals() {
        return numberOfArrivals;
    }

    public void setNumberOfArrivals(int numberOfArrivals) {
        this.numberOfArrivals = numberOfArrivals;
    }

    //endregion
}
