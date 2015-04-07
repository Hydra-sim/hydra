package models;

import java.util.ArrayList;
import java.util.List;

public class ConsumerGroup extends Consumer{

    private List<Consumer> consumers;

    public ConsumerGroup(int numberOfConsumers, int ticksToConsumeEntities) {

        consumers = new ArrayList<>();

        for(int i = 0; i < numberOfConsumers; i++) {

            // Doesn't need a relationship, because all the consumers are equally weighted
            Consumer consumer = new Consumer(ticksToConsumeEntities);
            consumers.add(consumer);
        }
    }

    public List<Consumer> getConsumers() {
        return consumers;
    }

    public void setConsumers(List<Consumer> consumers) {
        this.consumers = consumers;
    }
}
