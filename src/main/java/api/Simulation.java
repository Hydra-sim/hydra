package api;

import calculations.Simulation123;
import managers.ProducerManager;
import models.Consumer;
import models.Producer;
import models.Relationship;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.*;

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
        TypedQuery<models.Simulation> query = entityManager.createNamedQuery(
            "Simulation.findAll",
            models.Simulation.class
        );

        return Response.ok( query.getResultList() ).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response get(@PathParam("id") int id)
    {
        try {
            models.Simulation item = entityManager.find(models.Simulation.class, id);

            return Response.ok( item ).build();
        }
        catch (Exception e) {
            return Response.serverError().build();
        }
    }

    @Transactional
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response delete(@PathParam("id") int id)
    {
        try {
            models.Simulation item = entityManager.find(models.Simulation.class, id);
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
        models.Simulation sim = new models.Simulation(input.name);

        // Producer
        Producer producer = new Producer(input.entitesToProduce, null);
        new ProducerManager().generateTimetable(producer, input.startTickForProducer, input.timeBetweenBuses,
                input.ticks / input.timeBetweenBuses);


        List<Producer> producers = new ArrayList<>();
        producers.add(producer);
        
        // Consumers
        List<Relationship> relationships = new ArrayList<>();
        List<Consumer> consumers = new ArrayList<>();

        for(int i = 0; i < input.numberOfEntrances; i++) {
            Consumer consumer = new Consumer(input.entitesConsumedPerTick);
            Relationship relationship1 = new Relationship(consumer, 0.0);
            relationships.add(relationship1);
            consumers.add(consumer);
        }
        
        producer.setRelationships(relationships);

        // Create simulation123
        Simulation123 simulation123 = new Simulation123(consumers, producers, input.ticks);

        // Run and save to database
        sim.setResult(simulation123.simulate());
        entityManager.persist(sim);
        entityManager.persist(simulation123);

        // Return stuff
        return Response.ok(sim.getResult()).build();

    }

}
