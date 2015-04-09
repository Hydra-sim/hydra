package api;

import javax.ejb.EJB;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * This class handles all REST-ful calls for {@link models.Timetable}
 */
@Path("/timetable")
public class Timetable {

    @EJB
    private dao.Timetable timetableDao;

    /**
     * Creates and persists a new timetable
     *
     * @param timetable the data from which the timetable is built
     * @return 200 OK and the result of the simulation
     */
    @Transactional
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response add(models.Timetable timetable)
    {
        timetableDao.add(timetable);
        return Response.ok().build();
    }

    /**
     * Gets a list all the timetables in the database with a named query defined in {@link models.Timetable}
     *
     * @return 200 OK and the list of the timetables found
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response list()
    {
        return Response.ok(
            timetableDao.list()
        ).build();
    }

    /**
     * Gets a single timetable
     *
     * @param id the id of the timetable to be retrieved
     * @return 200 OK if successfull, 500 SERVER ERROR if not
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response get(@PathParam("id") int id)
    {
        models.Timetable item;

        try {
            item = timetableDao.get(id);
        }
        catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok( item ).build();
    }

    /**
     * Edits the data on an existing timetable
     *
     * @param id the id of the timetable to edit
     * @param timetable the new data
     * @return 200 OK
     */
    @Transactional
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response edit(@PathParam("id") int id, models.Timetable timetable)
    {
        try {
            timetableDao.edit(timetable);
        }
        catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok().build();
    }

    /**
     * Deletes a timetable from the database
     *
     * @param id the id of the timetable to be deleted
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
            timetableDao.delete(id);
        }
        catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok().build();
    }
}
