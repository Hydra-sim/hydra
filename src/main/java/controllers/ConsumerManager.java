package controllers;

import models.Consumer;
import models.Entity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class ConsumerManager {

    public void addEntity(Consumer con, Entity entity) {

        List<Entity> conEntities = con.getEntitesInQueue();
        conEntities.add(entity);
        con.setEntitesInQueue(conEntities);
    }

    public static void increaseWaitingTime(Consumer con, int ticks) {

        for (Entity entity : con.getEntitesInQueue()) {

            entity.setWaitingTimeInTicks(entity.getWaitingTimeInTicks() + ticks);
        }
    }

    public void consumeEntity(Consumer con) {

        List<Entity> entities = con.getEntitesInQueue();
        List<Entity> entitiesConsumed = new ArrayList<>();

        for(int i = 0; i < con.getEntitesConsumedPerTick(); i++) {

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

    public int getMaxWaitingTime(Consumer con) {

        int maxWaitingTime = 0;

        for(Entity entity : con.getEntitesInQueue()) {

            if(entity.getWaitingTimeInTicks() > maxWaitingTime) maxWaitingTime = entity.getWaitingTimeInTicks();
        }

        return maxWaitingTime;
    }

    public int getTotalSentToConsumer(Consumer consumer) {

        return consumer.getEntitesConsumed().size() + consumer.getEntitesInQueue().size();
    }
}
