package models;

import models.data.ProducerData;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
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

    int personsPerArrival;

    int timeBetweenArrivals;

    int numberOfArrivals;

    int numberOfBusesInQueue;

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
        this.numberOfBusesInQueue = 0;
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

    public int getPersonsPerArrival() {
        return personsPerArrival;
    }

    public void setPersonsPerArrival(int personsPerArrival) {
        this.personsPerArrival = personsPerArrival;
    }

    public int getTimeBetweenArrivals() {
        return timeBetweenArrivals;
    }

    public void setTimeBetweenArrivals(int timeBetweenArrivals) {
        this.timeBetweenArrivals = timeBetweenArrivals;
    }

    public int getNumberOfBusesInQueue() {
        return numberOfBusesInQueue;
    }

    public void setNumberOfBusesInQueue(int numberOfBusesInQueue) {
        this.numberOfBusesInQueue = numberOfBusesInQueue;
    }

    public int getTimetableId() {
        return timetable.getId();
    }


    //endregion
}
