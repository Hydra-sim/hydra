package controllers;

import pojos.Consumer;
import pojos.Entity;

import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class ConsumerController {

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

        for(int i = 0; i < con.getEntitesConsumedPerTick(); i++) {

            if(!entities.isEmpty()) entities.remove(0);
        }

        con.setEntitesInQueue(entities);
        con.setEntitesConsumed(con.getEntitesConsumed() + 1);
    }

    public int getMaxWaitingTime(Consumer con) {

        int maxWaitingTime = 0;

        for(Entity entity : con.getEntitesInQueue()) {

            if(entity.getWaitingTimeInTicks() > maxWaitingTime) maxWaitingTime = entity.getWaitingTimeInTicks();
        }

        return maxWaitingTime;
    }
}
