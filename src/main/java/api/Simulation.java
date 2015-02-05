package api;

import pojos.Consumer;
import pojos.Producer;
import pojos.SimulationData;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
class InputValue {
    public int timeBetweenBuses;
    public int numberOfEntrances;
    public int days;
    public int hours;
    public int minutes;
}

/**
 * Created by knarf on 04/02/15.
 */
@Path("simulation")
public class Simulation {
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public SimulationData tasks(InputValue input)
    {
        int baseValue = 1;

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(baseValue, input.timeBetweenBuses * 60));

        List<Consumer> consumers = new ArrayList<>();
        for(int i = 0; i < input.numberOfEntrances; i++)
            consumers.add(new Consumer(baseValue));

        int ticks = input.days * 24 * 60 + input.hours * 60 + input.minutes;

        calculations.Simulation simulation = new calculations.Simulation(consumers, producers, ticks);
        return simulation.simulate();
    }

}
