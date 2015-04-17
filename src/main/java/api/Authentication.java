package api;

import org.mindrot.jbcrypt.BCrypt;

import javax.ejb.EJB;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("auth")
public class Authentication {

    // EntityManager for communications with the database.
    @EJB
    private dao.Simulation simulationDao;

    @Transactional
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response auth(PasswordFormData passwordFormData) {
        System.out.println(passwordFormData.input);

        models.Simulation item;

        try {
            item = simulationDao.get(passwordFormData.id);
            if(BCrypt.checkpw(passwordFormData.input, item.getPassword())){

                return Response.ok( new TrueFalse(true) ).build();
            }

        } catch (Exception e) {
            return Response.serverError().build();
        }
        /**/
        return Response.ok( new TrueFalse(false) ).build();
    }
}
