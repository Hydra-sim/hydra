package api.data;

import models.Timetable;

import javax.persistence.EntityManager;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by kristinesundtlorentzen on 22/4/15.
 */
@Path("startup")
public class Startup {
    
    EntityManager entityManager;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getData() {

        entityManager.persist(Timetable.getTimetableFromCsv("../../resources/timetables/flybussekspressen/monday-friday.csv", "Flybussekspressen: Monday-Friday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/flybussekspressen/saturday.csv", "Flybussekspressen: Saturday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/flybussekspressen/sunday.csv", "Flybussekspressen: Sunday"));

        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/flytoget/moday-friday.csv", "Flytoget: Monday - Friday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/flytoget/sunday.csv", "Flytoget: Sunday"));

        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nettbuss/monday-friday_express.csv", "Nettbus Timesekspress: Monday - Friday "));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nettbuss/saturday_express.csv", "Nettbuss Timesekspress: Saturday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nettbuss/sunday_express.csv", "Nettbuss Timesekspress: Sunday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nettbuss/monday-friday_shuttle.csv", "Nettbuss Shuttle: Monday-Friday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nettbuss/saturday_shuttle.csv", "Nettbuss Shuttle: Saturday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nettbuss/sunday_shuttle.csv", "Nettbus Shuttle: Sunday"));

        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nsb/monday-friday.csv", "NSB: Monday-Friday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nsb/saturday.csv", "NSB: Saturday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/nsb/sunday.csv", "NSB: Sunday"));

        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/sas-flybussen/monday-friday.csv", "SAS Flybussen: Monday-Friday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/sas-flybussen/saturday.csv", "SAS Flybussen: Saturday"));
        entityManager.persist(Timetable.getTimetableFromCsv("src/main/resources/timetables/sas-flybussen/sunday.csv", "SAS Flybussen: Sunday"));

        return Response.ok().build();
    }
}
