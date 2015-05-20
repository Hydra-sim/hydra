package api.data;

import models.Timetable;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 * Created by knarf on 20/04/15.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SimulationNode {

    public String name;
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

    // Values returned. Don't remove, or edit will break
    public Object entitiesTransfered;
    public Object entitiesRecieved;
    public Object entitiesConsumed;
    public Object entitiesInQueue;
    public Object entitiesReady;
    public Object nodeDataList;
    public Object consumerDataList;
    public Object producerDataList;
    public Object tmpId;
    public Object numberOfArrivals;
    public Object numberOfBusesInQueue;
    public Object maxWaitingTime;
    public Object busStop_inUse;
    public Object busStop_tickArrival;
    public Object consumers;
    public Object numberOfConsumersInQueue;
    public Object maxWaitingTimeOnCurrentNode;
}
