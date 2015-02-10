package api;

import pojos.Consumer;
import pojos.Producer;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by knarf on 04/02/15.
 */
@Path("simulation")
public class Simulation {

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response simulations()
    {
        /*
        List<model.Simulation> simulations = new ArrayList<model.Simulation>();

        simulations.add(new model.Simulation("Untitled simulation 1", new Date()));
        simulations.add(new model.Simulation("Untitled simulation 2", new Date()));
        simulations.add(new model.Simulation("Frank simulation 1", new Date()));

        return Response.ok(simulations).build();
        */

        TypedQuery<model.Simulation> query = entityManager.createNamedQuery(
            "Simulation.findAll",
            model.Simulation.class
        );

        List<model.Simulation> result = query.getResultList();

        return Response.ok(result).build();

    }

    @Transactional
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response tasks(InputValue input)
    {
        // Create new object in database
        model.Simulation sim = new model.Simulation();
        entityManager.persist(sim);

        // Create and run simulation
        int baseValue = 1;

        List<Producer> producers = new ArrayList<>();
        producers.add(new Producer(baseValue, input.timeBetweenBuses * 60));

        List<Consumer> consumers = new ArrayList<>();
        for(int i = 0; i < input.numberOfEntrances; i++)
            consumers.add(new Consumer(baseValue));

        int ticks = input.days * 24 * 60 + input.hours * 60 + input.minutes;

        calculations.Simulation simulation = new calculations.Simulation(consumers, producers, ticks);
        return Response.ok(simulation.simulate()).build();
    }

}
