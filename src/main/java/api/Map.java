package api;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by kristinesundtlorentzen on 24/3/15.
 */
@Path("/map")
public class Map {

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response list()
    {
        TypedQuery<models.Map> query = entityManager.createNamedQuery(
                "Map.findAll",
                models.Map.class
        );

        return Response.ok( query.getResultList() ).build();
    }

    @GET
    @Produces({"image/jpeg,image/png"})
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response get(@PathParam("id") int id)
    {
        models.Map item;

        try {
            item = entityManager.find(models.Map.class, id);
        }
        catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok( item.getImage() ).build();
    }

    @Transactional
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response delete(@PathParam("id") int id)
    {
        try {
            models.Map item = entityManager.find(models.Map.class, id);
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
    public Response add(models.Map map)
    {
        entityManager.persist(map);
        return Response.ok().build();
    }


    @Transactional
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response edit(@PathParam("id") int id, models.Timetable timetable)
    {
        try {
            entityManager.merge(timetable);
        }
        catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok().build();
    }
}
