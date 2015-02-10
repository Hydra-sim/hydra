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
    public Response list()
    {
        TypedQuery<model.Simulation> query = entityManager.createNamedQuery(
            "Simulation.findAll",
            model.Simulation.class
        );

        return Response.ok( query.getResultList() ).build();
    }

    @Transactional
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response delete(@PathParam("id") int id)
    {
        try {
            model.Simulation item = entityManager.find(model.Simulation.class, id);
            entityManager.remove(item);
        }
        catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok().build();
    }

    @Transactional
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response add(InputValue input)
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
