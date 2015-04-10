package helpers;

import models.Consumer;
import models.Entity;

import java.util.ArrayList;
import java.util.List;

/**
 * A manager with helper method(s) for {@link models.Consumer}
 */
public class ConsumerHelper {

    /**
     * Adds entity to the queue of a consumer
     *
     * @param con the consumer to add entity to
     * @param entity the entity to add
     */
    public void addEntity(Consumer con, Entity entity) {

        List<Entity> conEntities = con.getEntitesInQueue();
        conEntities.add(entity);
        con.setEntitesInQueue(conEntities);
    }

    /**
     * Increases the registered waiting time for entities in queue on a consumer
     *
     * @param con the consumer on which the entities are queueing
     * @param ticks the number of ticks the entities have waited
     */
    public static void increaseWaitingTime(Consumer con, int ticks) {

        for (Entity entity : con.getEntitesInQueue()) {

            entity.setWaitingTimeInTicks(entity.getWaitingTimeInTicks() + ticks);
        }
    }

    /**
     * Moves as many entities as consumer can consume from queue to consumed
     *
     * @param con the consumer on which the entities are to be moved
     */
    public void consumeEntity(Consumer con) {

        List<Entity> entities = con.getEntitesInQueue();
        List<Entity> entitiesConsumed = new ArrayList<>();

        for(int i = 0; i < con.getTicksToConsumeEntities(); i++) {

            if(!entities.isEmpty()) {

                entitiesConsumed.add(con.getEntitesInQueue().get(0));
                entities.remove(0);
            }
        }

        con.setEntitesInQueue(entities);

        List<Entity> entitiesConsumedBeforeSimulation = con.getEntitesConsumed();

        for(Entity entity : entitiesConsumed) {
            entitiesConsumedBeforeSimulation.add(entity);
        }

        con.setEntitesConsumed(entitiesConsumedBeforeSimulation);
    }

    /**
     * Gets the highest waiting time registered on an entity (in total, not waiting time for the specific consumer)
     *
     * @param con the consumer on which the entities to be checked are
     * @return the highest recorded waiting time on a entity on the given consumer
     */
    public int getMaxWaitingTime(Consumer con) {

        int maxWaitingTime = 0;

        for(Entity entity : con.getEntitesInQueue()) {

            if(entity.getWaitingTimeInTicks() > maxWaitingTime) maxWaitingTime = entity.getWaitingTimeInTicks();
        }

        return maxWaitingTime;
    }

    /**
     * Counts both the entites in queue and the consumed entites on a consumer
     *
     * @param consumer the consumer on which we wish to count the entites
     * @return the number of entites sent in total to the consumer
     */
    public int getTotalSentToConsumer(Consumer consumer) {

        return consumer.getEntitesConsumed().size() + consumer.getEntitesInQueue().size();
    }
}
