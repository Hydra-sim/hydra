package api;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("auth")
public class Authentication {

    // EntityManager for communications with the database.

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response auth(@FormParam("password") String password) {

        return Response.ok().build();
    }
}
