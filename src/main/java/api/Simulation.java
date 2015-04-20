package api;

import helpers.ProducerHelper;
import models.Consumer;
import models.ConsumerGroup;
import models.Producer;
import models.Relationship;

import javax.ejb.EJB;
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

    @EJB
    private dao.Simulation simulationDao;

    @EJB
    private dao.Timetable timetableDao;

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
        List<Relationship> relationships = new ArrayList<>();
        List<Producer> producers;

        try {
            producers = initProducers(input);
        }
        catch(Exception e) {
            return Response.serverError().build();
        }

        List<Consumer> consumers =              initConsumers(input, relationships);

        List<ConsumerGroup> consumerGroups =    initConsumerGroups(input, relationships);

        // Iterates through all the producers and registers a relationship automatically
        // TODO: Remove this after relationships have been implemented frontend
        for(int i = 0; i < producers.size(); i++) {

            producers.get(i).setRelationships(relationships);
        }

        // Create the simulation
        models.Simulation sim = new models.Simulation(input.name, consumers, producers, consumerGroups, input.startTick, input.ticks);

        // Run the simulation
        models.Simulation.simulate(sim);

        // Persist the simulation, with results, to the database
        simulationDao.add(sim);

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
     */
     @SuppressWarnings("unchecked")
     private List<Producer> initProducers(InputValue input) throws Exception
     {
        List<Producer> producers = new ArrayList<>();

        for(int i = 0; i < input.timetableIds.length; i++) {


            models.Timetable timetable = timetableDao.get(input.timetableIds[i]);

            Producer producer = new Producer(timetable);

            producers.add(producer);
        }

         for(int i = 0; i < input.numberOfEntitiesList.length; i++ ){
             Producer producer = new Producer();
             new ProducerHelper().generateTimetable(producer, 0 , input.timeBetweenArrivalsList[i],
                     input.totalNumberOfEntititesList[i]/input.numberOfEntitiesList[i], input.numberOfEntitiesList[i]);

             producers.add(producer);
         }

        return producers;
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
        return Response.ok( simulationDao.list() ).build();
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
        models.Simulation item;

        try {
            item = simulationDao.get(id);
        } catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok(item).build();
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
            simulationDao.delete(id);
        } catch (Exception e) {

            return Response.serverError().build();
        }

        return Response.ok().build();
    }

    @Transactional
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response updatePassword(@PathParam("id") int id, PasswordFormData data)
    {
        try {

            models.Simulation simulation = simulationDao.get( id );
            simulation.setPassword( data.input );
            simulationDao.update(simulation);

        } catch (Exception e) {

            return Response.ok(new TrueFalse(false)).build();
        }

        return Response.ok(new TrueFalse(true)).build();
    }
}
