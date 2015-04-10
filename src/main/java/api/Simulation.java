package api;

import models.Consumer;
import models.ConsumerGroup;
import models.Producer;
import models.Relationship;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

/**
 * This class handles all REST-ful calls for {@link models.Simulation}
 * TODO: Make an update method?
 */

@Path("simulation")
public class Simulation {

    // EntityManager for communications with the database.

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    /**
     * Creates and persists a new simulation
     *
     * @param input the data from which the simulation is built
     * @return 200 OK and the result of the simulation
     */
    @Transactional
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response add(InputValue input)
    {
        List<Relationship> relationships =      new ArrayList<>();

        List<Producer> producers =              initProducers(input);

        List<Consumer> consumers =              initConsumers(input, relationships);

        List<ConsumerGroup> consumerGroups =    initConsumerGroups(input, relationships);

        // Iterates through all the producers and registers a relationship automatically
        // TODO: Remove this after relationships have been implemented frontend
        for(int i = 0; i < producers.size(); i++) {

            producers.get(i).setRelationships(relationships);
        }

        // Create the simulation
        models.Simulation sim = new models.Simulation(input.name, consumers, producers, consumerGroups, input.ticks);

        // Run the simulation
        sim.simulate();

        // Persist the simulation, with results, to the database
        entityManager.persist(sim);

        return Response.ok(sim.getResult()).build();

    }

    // Helper methods for add

    /**
     * Initializes consumers
     * @param input the data from which the consumers are built
     * @param relationships a list of relationships where all consumers and consumerGroups currently gets added to.
     *                      TODO: Remove this
     * @return a list of consumers
     */
    private List<Consumer> initConsumers(InputValue input, List<Relationship> relationships) {
        List<Consumer> consumers = new ArrayList<>();

        for(int i = 0; i < input.ticksToConsumeEntitiesList.length; i++) {
            Consumer consumer = new Consumer(input.ticksToConsumeEntitiesList[i]);

            // Sets a relationship for later use
            // TODO: Remove this after relationships have been implemented frontend
            Relationship relationship = new Relationship(consumer, 0.0);
            relationships.add(relationship);

            consumers.add(consumer);
        }

        return consumers;
    }

    /**
     *Initializes consumer-groups
     *
     * @param input the data from which the consumer-groups are built
     * @param relationships a list of relationships where all consumers and consumerGroups currently gets added to.
     *                      TODO: Remove this
     * @return a list of consumer-groups
     */
    private List<ConsumerGroup> initConsumerGroups(InputValue input, List<Relationship> relationships) {
        List<ConsumerGroup> consumerGroups = new ArrayList<>();

        for(int i = 0; i < input.consumerGroupNames.length; i++) {

            ConsumerGroup consumerGroup = new ConsumerGroup(input.consumerGroupNames[i],
                                                            input.numberOfConsumersInGroups[i],
                                                            input.ticksToConsumeEntitiesGroups[i]);

            // Sets a relationship for later use
            // TODO: Remove this after relationships have been implemented frontend
            Relationship relationship = new Relationship(consumerGroup, 0.0);
            relationships.add(relationship);

            consumerGroups.add(consumerGroup);
        }

        return consumerGroups;
    }

    /**
     * Initializes producers
     *
     * @param input the data from which the producers are built
     * @return a list of producers
     * */
    private List<Producer> initProducers(InputValue input) {
        List<Producer> producers = new ArrayList<>();

        for(int i = 0; i < input.timetableIds.length; i++) {

            models.Timetable timetable = entityManager.find(models.Timetable.class, input.timetableIds[i]);

            Producer producer = new Producer(timetable);

            producers.add(producer);
        }

        return producers;
    }

    @POST
    @Path("auth")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response auth(@PathParam("password") String password) {

        return Response.ok( password.equals("123") ).build();
    }

    /**
     * Gets a list all the simulations in the database with a named query defined in {@link models.Simulation}
     *
     * @return 200 OK and the list of the simulations found
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response list()
    {
        TypedQuery<models.Simulation> query = entityManager.createNamedQuery(

            "Simulation.findNotPreset", // Uses one of three available queries for Simulation
            models.Simulation.class
        );

        return Response.ok( query.getResultList() ).build();
    }

    /**
     * Gets a single simulation
     *
     * @param id the id of the simulation to be retrieved
     * @return 200 OK if successfull, 500 SERVER ERROR if not
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response get(@PathParam("id") int id)
    {
        try {

            models.Simulation item = entityManager.find(models.Simulation.class, id);
            return Response.ok( item ).build();

        } catch (Exception e) {

            return Response.serverError().build();
        }
    }

    /**
     * Deletes a simulation from the database
     *
     * @param id the id of the simulation to be deleted
     * @return 200 OK if successfull, 500 SERVER ERROR if not
     */
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

        } catch (Exception e) {

            return Response.serverError().build();
        }

        return Response.ok().build();
    }
}
