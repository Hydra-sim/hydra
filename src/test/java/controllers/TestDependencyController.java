package controllers;

import org.junit.Test;
import pojos.Consumer;
import pojos.Dependency;
import pojos.Producer;

import static org.junit.Assert.assertTrue;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class TestDependencyController {

    @Test
    public void testGetDependencyID() {

        Producer producer = new Producer();
        Consumer consumer = new Consumer();

        Dependency dependency = new Dependency(producer, consumer);
        DependencyController controller = new DependencyController();

        assertTrue(producer == controller.getDependantID(dependency, consumer));
        assertTrue(consumer == controller.getDependantID(dependency, producer));
    }
}
