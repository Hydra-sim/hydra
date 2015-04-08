package api;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * This class handles all REST-ful calls for presets located in {@link models.presets}
 * TODO: Make an update method?
 */

@Path("/preset")
public class Preset {

    // EntityManager for communications with the database.

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    /**
     * Gets a list all the presets in the database with a named query defined in {@link models.Simulation}
     *
     * @return 200 OK and the list of the simulations found
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response list()
    {
        TypedQuery<models.Simulation> query = entityManager.createNamedQuery(
                "Simulation.findPresets",
                models.Simulation.class
        );

        return Response.ok( query.getResultList() ).build();
    }

    /**
     * Gets a single preset
     *
     * @param id the id of the preset to be retrieved
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
        }
        catch (Exception e) {
            return Response.serverError().build();
        }
    }

    /**
     * Deletes a preset from the database
     *
     * @param id the id of the preset to be deleted
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
        }
        catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok().build();
    }
}
