package api;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by knarf on 10/03/15.
 */
@Path("/preset")
public class Preset {

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response list()
    {
        TypedQuery<models.Simulation> query = entityManager.createNamedQuery(
                "Presets.findAll",
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
}
