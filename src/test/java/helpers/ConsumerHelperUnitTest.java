package helpers;

import org.junit.Before;
import org.junit.Test;
import models.Consumer;
import models.Entity;

import static org.junit.Assert.assertEquals;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class ConsumerHelperUnitTest {

    ConsumerHelper consumerHelper;
    @Before
    public void before() {

        consumerHelper = new ConsumerHelper();
    }

    @Test
    public void testAddEntity() {

        Consumer con = new Consumer();

        consumerHelper.addEntity(con, new Entity());
        assertEquals(1, con.getEntitesInQueue().size());
    }

    @Test
    public void testIncreaseWaitingTime() {

        Consumer con = new Consumer();

        consumerHelper.addEntity(con, new Entity());

        int ticks = 1;
        consumerHelper.increaseWaitingTime(con, ticks);
        assertEquals(ticks, con.getEntitesInQueue().get(0).getWaitingTimeInTicks());
    }

    @Test
    public void testConsumeEntites() {

        Consumer con = new Consumer(1);

        consumerHelper.addEntity(con, new Entity());
        assertEquals(1, con.getEntitesInQueue().size());

        consumerHelper.consumeEntity(con, 1);
        assertEquals(0, con.getEntitesInQueue().size());
        assertEquals(1, con.getEntitesConsumed().size());
    }

    @Test
    public void testGetMaxWaitingTime() {

        Consumer consumer = new Consumer();

        consumerHelper.addEntity(consumer, new Entity(0));
        consumerHelper.addEntity(consumer, new Entity(1));

        assertEquals(2, consumer.getEntitesInQueue().size());
        assertEquals(1, consumerHelper.getMaxWaitingTime(consumer));
    }

    @Test
    public void testTotalSentToConsumer() {

        Consumer consumer = new Consumer();

        consumer.getEntitesInQueue().add(new Entity());
        consumer.getEntitesConsumed().add(new Entity());

        assertEquals(2, consumerHelper.getTotalSentToConsumer(consumer));
    }
}
