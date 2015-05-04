package models;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/**
 * An extension of {@link models.Consumer}, representing a group of consumers where each consumer is weighted equally.
 * Has all the values of consumer and a list of consumers.
 */
@javax.persistence.Entity
public class ConsumerGroup extends Consumer{

    //region attributes

    @OneToMany(cascade= CascadeType.ALL, fetch = FetchType.EAGER)
    @Fetch(FetchMode.SUBSELECT)
    private List<Consumer> consumers;

    //endregion

    //region constructors

    public ConsumerGroup() {

        new ConsumerGroup("No name", 0, 0);
        consumers = new ArrayList<>();

    }

    public ConsumerGroup(String name, int numberOfConsumers, int ticksToConsumeEntities) {

        setName(name);
        consumers = new ArrayList<>();

        for(int i = 0; i < numberOfConsumers; i++) {

            // Doesn't need a relationship, because all the consumers are equally weighted
            Consumer consumer = new Consumer(ticksToConsumeEntities);
            consumers.add(consumer);
        }
    }

    public ConsumerGroup(int numberOfConsumers, int ticksToConsumeEntities) {

        this("Untitled Consumer Group", numberOfConsumers, ticksToConsumeEntities);
    }

    //endregion

    //region getters and setters

    public List<Consumer> getConsumers() {
        return consumers;
    }

    public void setConsumers(List<Consumer> consumers) {
        this.consumers = consumers;
    }

    public List<Entity> getEntitiesConsumed() {

        List<Entity> entitesConsumed = new ArrayList<>();

        for(Consumer consumer : consumers) {

            entitesConsumed.addAll(consumer.getEntitiesConsumed());
        }

        return entitesConsumed;
    }

    //endregion
}
