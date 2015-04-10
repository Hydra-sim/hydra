package api;

//import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;

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

        return Response.ok(query.getResultList()).build();
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

        return Response.ok( item.getUrl() ).build();
    }

    /*
    @POST
    @Path("/upload-file")
    @Consumes("multipart/form-data")
    public Response uploadFile(@MultipartForm FileUploadForm form) {

        String fileName = form.getFileName() == null ? "Unknown" : form.getFileName() ;

        String completeFilePath = "c:/temp/" + fileName;
        try
        {
            //Save the file
            File file = new File(completeFilePath);

            if (!file.exists())
            {
                file.createNewFile();
            }

            FileOutputStream fos = new FileOutputStream(file);

            fos.write(form.getFileData());
            fos.flush();
            fos.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        //Build a response to return
        return Response.status(200)
            .entity("uploadFile is called, Uploaded file name : " + fileName).build();
    }
    */
}
