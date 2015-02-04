import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Created by kristinesundtlorentzen on 4/2/15.
 */
public class TestSimulation {

    private int ticks = 10;
    private int baseValue = 10;

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
}
