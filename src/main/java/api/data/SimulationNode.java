package api.data;

import models.Timetable;

/**
 * Created by knarf on 20/04/15.
 */
public class SimulationNode {
    public int id;
    public String type;
    public String name;
    public int x;
    public int y;

    // Producer
    public int timetableId;

    // Consumer
    public int ticksToConsumeEntity;

    // Passengerflow / people
    public int timeBetweenArrivals;

    // ConsumerGroup
    public String consumerGroupName;
    public int numberOfConsumers;

    public int entitiesTransfered;
    public int entitiesRecieved;
    public int tmpId;

    public Object[] nodeDataList;
    public Object[] producerDataList;
    public Object[] consumerDataList;

    public Object[] entitesConsumed;
    public Object[] entitesInQueue;
    public Object[] entitiesReady;

    public Timetable timetable;
}
