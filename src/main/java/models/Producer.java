package models;

import models.data.ProducerData;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
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

    @OneToMany(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    List<ProducerData> producerDataList;

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

    //endregion
}
