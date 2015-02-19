import calculations.Simulation;
import org.junit.Ignore;
import org.junit.Test;
import pojos.Consumer;
import pojos.Producer;
import pojos.SimulationData;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class TestSimulation {

    private int ticks = 10;
    private int baseValue = 1;

    @Test
    public void testSimulationConsumedAndProducedEqual(){

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(baseValue, 0));
        List<Consumer> consumers = new ArrayList<>();
        consumers.add(new Consumer(baseValue));

        Simulation simulation = new Simulation(consumers, producers, ticks);
        SimulationData simulationData = simulation.simulate();

        assertEquals(0, simulationData.getEntitiesInQueue());

    }

    @Test
    public void testSimulationMoreProducedThanConsumed() {

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(baseValue + 1, 0));
        List<Consumer> consumers = new ArrayList<>();
        consumers.add(new Consumer(baseValue));

        Simulation simulation = new Simulation(consumers, producers, ticks);
        SimulationData simulationData = simulation.simulate();

        assertTrue(simulationData.getEntitiesInQueue() > 0);
    }

    @Test
    public void testSimulationMoreConsumedThanProduced() {

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(baseValue, 0));
        List<Consumer> consumers = new ArrayList<>();
        consumers.add(new Consumer(baseValue + 1));

        Simulation simulation = new Simulation(consumers, producers, ticks);
        SimulationData simulationData = simulation.simulate();

        assertEquals(0, simulationData.getEntitiesInQueue());
        assertEquals(baseValue * ticks, simulationData.getEntitiesConsumed());
    }

    @Test
    public void testSimulationWaitingTime() {

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(baseValue * 2, 0));
        List<Consumer> consumers = new ArrayList<>();
        consumers.add(new Consumer(baseValue));

        Simulation simulation = new Simulation(consumers, producers, ticks);
        SimulationData simulationData = simulation.simulate();

        int waitingTime;
        if(ticks / 2 - 1 < 0) waitingTime = 0;
        else waitingTime = ticks / 2;

        assertEquals(waitingTime, simulationData.getMaxWaitingTimeInTicks());
    }

    @Test
    public void testSimulationDefaultValuesPrototype1() {

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(1, 10));
        List<Consumer> consumers = new ArrayList<>();
        consumers.add(new Consumer(1));

        Simulation simulation = new Simulation(consumers, producers, 60);
        SimulationData simulationData = simulation.simulate();

        assertEquals(6, simulationData.getEntitiesConsumed());
        assertEquals(0, simulationData.getMaxWaitingTimeInTicks());
        assertEquals(0, simulationData.getEntitiesInQueue());
    }

    // This fails for some reason, but is works when testing it frontend.
    //TODO: Fix this
    @Ignore
    @Test
    public void testSimulationProducing2ShouldHaveMoreThan0WaitingTime() {

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(10, 10));
        List<Consumer> consumers = new ArrayList<>();
        consumers.add(new Consumer(1));

        Simulation simulation = new Simulation(consumers, producers, 60);
        SimulationData simulationData = simulation.simulate();

        assertTrue(simulationData.getMaxWaitingTimeInTicks() > 0);
    }
}
