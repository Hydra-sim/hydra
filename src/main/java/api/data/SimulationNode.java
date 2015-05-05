package api.data;

import models.Timetable;

/**
 * Created by knarf on 20/04/15.
 */
public class SimulationNode {
    public int id;
    public String type;
    public int x;
    public int y;

    // Producer
    public int timetableId;

    // Consumer
    public int ticksToConsumeEntity;

    // Passengerflow / people
    public int personsPerArrival;
    public int timeBetweenArrivals;

    // ConsumerGroup
    public String consumerGroupName;
    public int numberOfConsumers;

    public Timetable timetable;
}
