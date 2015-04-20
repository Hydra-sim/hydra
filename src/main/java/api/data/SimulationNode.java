package api.data;

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

    // ConsumerGroup
    public String consumerGroupName;
    public int numberOfConsumers;

}
