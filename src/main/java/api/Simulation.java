package api;

import api.data.PasswordFormData;
import api.data.SimulationFormData;
import api.data.TrueFalse;
import helpers.ProducerHelper;
import helpers.SimulationHelper;
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
import java.util.Date;
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
    public Response add(SimulationFormData input)
    {
        List<Producer> producers;

        try {
            producers = initProducers(input);
        }
        catch(Exception e) {
            return Response.serverError().build();
        }

        List<Consumer> consumers =              initConsumers(input);

        List<ConsumerGroup> consumerGroups =    initConsumerGroups(input);

        // TODO: Change this to make relationships according to frontend data
        List<Relationship> relationships =      initRelationships(input, producers, consumers, consumerGroups);

        // Create the simulation
        models.Simulation sim = new models.Simulation(input.name, new Date(), consumers, consumerGroups, producers,
                relationships, input.startTick, input.ticks);

        // Run the simulation
        new SimulationHelper().simulate(sim);

        // Persist the simulation, with results, to the database
        simulationDao.add(sim);

        return Response.ok(sim.getResult()).build();

    }

    // Helper methods for add

    /**
     * Initializes consumers
     * @param input the data from which the consumers are built
     * @return a list of consumers
     */
    private List<Consumer> initConsumers(SimulationFormData input) {
        List<Consumer> consumers = new ArrayList<>();

        for(int i = 0; i < input.ticksToConsumeEntitiesList.length; i++) {
            Consumer consumer = new Consumer(input.ticksToConsumeEntitiesList[i]);

            consumer.setType(input.consumerTypes[i]); // TODO: Fix for format from frontend
            consumers.add(consumer);
        }

        return consumers;
    }

    /**
     * Initializes relationships
     * @param input the data from which the consumers are built
     * @return a list of consumers
     */
    private List<Relationship> initRelationships(SimulationFormData input, List<Producer> producers, List<Consumer> consumers,
                                             List<ConsumerGroup> consumerGroups) {

        List<Relationship> relationships = new ArrayList<>();

        for( Producer producer : producers ) {

            for( Consumer consumer : consumers ) {

                relationships.add(new Relationship(producer, consumer, 0.0));
            }

            for( ConsumerGroup consumerGroup : consumerGroups) {

                relationships.add(new Relationship(producer, consumerGroup, 0.0));
            }
        }

        return relationships;
    }

    /**
     *Initializes consumer-groups
     *
     * @param input the data from which the consumer-groups are built
     * @return a list of consumer-groups
     */
    private List<ConsumerGroup> initConsumerGroups(SimulationFormData input) {
        List<ConsumerGroup> consumerGroups = new ArrayList<>();

        for(int i = 0; i < input.consumerGroupNames.length; i++) {

            ConsumerGroup consumerGroup = new ConsumerGroup(input.consumerGroupNames[i],
                                                            input.numberOfConsumersInGroups[i],
                                                            input.ticksToConsumeEntitiesGroups[i]);

            consumerGroup.setType(input.consumerGroupTypes[i]); // TODO: Fix for format from frontend

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
     private List<Producer> initProducers(SimulationFormData input) throws Exception
     {
        List<Producer> producers = new ArrayList<>();

        for(int i = 0; i < input.timetableIds.length; i++) {


            models.Timetable timetable = timetableDao.get(input.timetableIds[i]);

            Producer producer = new Producer(timetable);

            producer.setType(input.producerType[i]); // TODO: Fix for format from frontend

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
