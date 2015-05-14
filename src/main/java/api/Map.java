package api;

import api.data.FileUploadForm;
import factory.MapFactory;
import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import javax.ejb.EJB;
import javax.ws.rs.*;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;

/**
 * Created by kristinesundtlorentzen on 24/3/15.
 */
@Path("/map")
public class Map {
    @EJB
    private MapFactory mapFactory;

    @EJB
    private dao.Map mapDao;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response list()
    {
        return Response.ok( mapDao.list() ).build();
    }


    @GET
    @Produces({"image/jpeg,image/png"})
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response get(@PathParam("id") int id)
    {
        try {
            models.Map map = mapDao.get(id);
            return Response.ok( map.getFile() ).build();
        }
        catch (Exception e) {
            return Response.serverError().build();
        }
    }

    @POST
    @Consumes("multipart/form-data")
    public Response uploadFile(@MultipartForm FileUploadForm form) {
        try
        {
            models.Map map = mapFactory.createMap(form);

            // Create the output stream & copy the input stream to the output
            OutputStream os = new FileOutputStream(map.getFile());
            IOUtils.copy(form.getInputStream(), os);
            os.close();

            // Persist the map to the database
            mapDao.add(map);
        }
        catch (Exception e)
        {
            return Response.serverError().build();
        }

        return Response.ok().build();
    }
}
