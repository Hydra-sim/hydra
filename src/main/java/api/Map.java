package api;

import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;
import org.apache.commons.io.IOUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
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

        return Response.ok( item.getUrl() ).build();
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
    @Path("upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response upload(@DefaultValue("true") @FormDataParam("enabled") boolean enabled,
                           @FormDataParam("file") InputStream uploadedInputStream,
                           @FormDataParam("file") FormDataContentDisposition fileDetail) {

        //Your local disk path where you want to store the file
        String uploadedFileLocation = fileDetail.getFileName();
        System.out.println(uploadedFileLocation);
        // save it
        File  objFile=new File(uploadedFileLocation);
        if(objFile.exists())
        {
            objFile.delete();

        }

        saveToFile(uploadedInputStream, uploadedFileLocation);

        models.Map map = new models.Map(uploadedFileLocation);
        entityManager.persist(map);
        String output = "File uploaded via Jersey based RESTFul Webservice to: " + uploadedFileLocation;
        return Response.status(200).entity(output).build();
    }

    private void saveToFile(InputStream uploadedInputStream,
                            String uploadedFileLocation) {

        try {
            OutputStream out = null;
            int read = 0;
            byte[] bytes = new byte[1024];

            out = new FileOutputStream(new File(uploadedFileLocation));
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
            out.flush();
            out.close();
        } catch (IOException e) {

            e.printStackTrace();
        }

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
