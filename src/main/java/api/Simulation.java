package api;

import api.data.PasswordFormData;
import api.data.SimulationFormData;
import api.data.TrueFalse;
import helpers.SimulationHelper;

import javax.ejb.EJB;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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

    @EJB
    private factory.SimulationFactory simulationFactory;

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
        try {
            models.Simulation simulation = simulationFactory.createSimulation(input);

            // Run the simulation
            new SimulationHelper().simulate(simulation);


            // Dummy data TODO: remove in actual solution
            simulation.getResult().setStartTime(3600*14);
            simulation.getResult().setEndTime(3600 * 16);
            simulation.getResult().setEntitiesConsumed(1300);
            simulation.getResult().setEntitiesInQueue(123);
            simulation.getResult().setMaxWaitingTimeInTicks(300);

            // Persist the simulation, with results, to the database
            simulationDao.add(simulation);


            return Response.ok(simulation.getResult()).build();

        }
        catch(Exception e)
        {
            return Response.serverError().build();
        }
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
