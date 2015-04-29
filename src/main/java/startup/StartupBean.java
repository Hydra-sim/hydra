package startup;

import helpers.SimulationHelper;
import models.*;
import presets.OSLPreset;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

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

        Simulation simulation2 = new Simulation("PassTrue");
        simulation2.setPassword("password");
        entityManager.persist(simulation2);

        // Simulation with data

        List<Node> nodes = new ArrayList<>();

        Timetable timetable = new Timetable();
        timetable.getArrivals().add(new TimetableEntry(0, 50));
        timetable.getArrivals().add(new TimetableEntry(10, 50));
        timetable.getArrivals().add(new TimetableEntry(20, 50));

        Producer producer = new Producer(timetable);

        Consumer consumer = new Consumer(10);

        nodes.add(producer);
        nodes.add(consumer);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(new Relationship(producer, consumer, 1.0));

        Simulation simulation3 = new Simulation("Simulation with data which has been simulated", new Date(), nodes, relationships, 0, 100, 25);
        SimulationHelper simulationHelper = new SimulationHelper();
        simulationHelper.simulate(simulation3);
        entityManager.persist(simulationHelper.getSimulation());

        // Timetables

        List<TmpFileListItem> timetables = new LinkedList<TmpFileListItem>() {{
            add(new TmpFileListItem("timetables/flybussekspressen/monday-friday.csv", "Flybussekspressen: Monday - Friday"));
            add(new TmpFileListItem("timetables/flybussekspressen/saturday.csv", "Flybussekspressen: Saturday"));
            add(new TmpFileListItem("timetables/flybussekspressen/sunday.csv", "Flybussekspressen: Sunday"));

            /*
            add(new TmpFileListItem("timetables/flytoget/moday-friday.csv", "Flytoget: Monday - Friday"));
            add(new TmpFileListItem("timetables/flytoget/sunday.csv", "Flytoget: Sunday"));

            add(new TmpFileListItem("timetables/nettbuss/monday-friday_express.csv", "Nettbus Timesekspress: Monday - Friday "));
            add(new TmpFileListItem("timetables/nettbuss/monday-friday_shuttle.csv", "Nettbuss Shuttle: Monday-Friday"));
            add(new TmpFileListItem("timetables/nettbuss/saturday_express.csv", "Nettbuss Timesekspress: Saturday"));
            add(new TmpFileListItem("timetables/nettbuss/saturday_shuttle.csv", "Nettbuss Shuttle: Saturday"));
            add(new TmpFileListItem("timetables/nettbuss/sunday_express.csv", "Nettbuss Timesekspress: Sunday"));
            add(new TmpFileListItem("timetables/nettbuss/sunday_shuttle.csv", "Nettbus Shuttle: Sunday"));

            add(new TmpFileListItem("timetables/nsb/monday-friday.csv", "NSB: Monday-Friday"));
            add(new TmpFileListItem("timetables/nsb/saturday.csv", "NSB: Saturday"));
            add(new TmpFileListItem("timetables/nsb/sunday.csv", "NSB: Sunday"));

            add(new TmpFileListItem("timetables/sas_flybussen/monday-friday.csv", "SAS Flybussen: Monday-Friday"));
            add(new TmpFileListItem("timetables/sas_flybussen/saturday.csv", "SAS Flybussen: Saturday"));
            add(new TmpFileListItem("timetables/sas_flybussen/sunday.csv", "SAS Flybussen: Sunday"));
            */

        }};

        timetables.stream().forEach((item) -> {

            InputStream is = StartupBean.class.getResourceAsStream(item.getFilename());
            Timetable t = Timetable.getTimetableFromCsv(is, item.getName());

            entityManager.persist(t);
        });

    }
}
