package startup;

import models.Simulation;
import models.Timetable;
import presets.OSLPreset;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * This class contains all the data that is to be persisted at deployment
 */
@Singleton
@Startup
public class StartupBean {

    // EntityManager for communications with the database.

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    /**
     * This method is run on every deployment
     */
    @PostConstruct
    public void startup() {

        // Creating the OSL preset and saving it to the database
        Simulation simulation1 = new OSLPreset().createOSLPreset();
        entityManager.persist(simulation1);

        // For testing purposes
        entityManager.persist(new Simulation("PassDefault"));

        Simulation simulation = new Simulation("PassTrue");
        simulation.setPassword("password");
        entityManager.persist(simulation);

        entityManager.persist(new Timetable().getTimetableFromCsv("monday-friday.csv", "Flybussekspressen: Monday-Friday"));

        /*
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
        */
    }
}
