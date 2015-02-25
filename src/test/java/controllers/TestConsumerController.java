package controllers;

import org.junit.Test;
import pojos.Consumer;
import pojos.Entity;

import static org.junit.Assert.assertEquals;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class TestConsumerController {

    @Test
    public void testAdd1Entity() {

        Consumer con = new Consumer();
        ConsumerController controller = new ConsumerController();

        controller.addEntity(con, new Entity());
        assertEquals(1, con.getEntitesInQueue().size());
    }

    @Test
    public void testIncreaseWaitingTimeBy1() {

        Consumer con = new Consumer();
        ConsumerController controller = new ConsumerController();

        controller.addEntity(con, new Entity());

        int ticks = 1;
        controller.increaseWaitingTime(con, ticks);
        assertEquals(ticks, con.getEntitesInQueue().get(0).getWaitingTimeInTicks());
    }

    @Test
    public void testConsumeEntites() {

        Consumer con = new Consumer(1);
        ConsumerController controller = new ConsumerController();

        controller.addEntity(con, new Entity());
        assertEquals(1, con.getEntitesInQueue().size());

        controller.consumeEntity(con);
        assertEquals(0, con.getEntitesInQueue().size());
        assertEquals(1, con.getEntitesConsumed().size());
    }

    @Test
    public void testGetMaxWaitingTime() {

        Consumer consumer = new Consumer();
        ConsumerController controller = new ConsumerController();

        controller.addEntity(consumer, new Entity(0));
        controller.addEntity(consumer, new Entity(1));

        assertEquals(2, consumer.getEntitesInQueue().size());
        assertEquals(1, controller.getMaxWaitingTime(consumer));
    }
}
