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

        // Timetables

        List<TmpFileListItem> timetables = new LinkedList<TmpFileListItem>() {{
            add(new TmpFileListItem("timetables/flybussekspressen/F1/monday-friday.csv", "Flybussekspressen: F1 Monday - Friday"));
            add(new TmpFileListItem("timetables/flybussekspressen/F1/saturday.csv", "Flybussekspressen: F1 Saturday"));
            add(new TmpFileListItem("timetables/flybussekspressen/F1/sunday.csv", "Flybussekspressen: F1 Sunday"));

            add(new TmpFileListItem("timetables/flybussekspressen/F3/monday-friday.csv", "Flybussekspressen: F3 Monday - Friday"));
            add(new TmpFileListItem("timetables/flybussekspressen/F3/saturday.csv", "Flybussekspressen: F3 Saturday"));
            add(new TmpFileListItem("timetables/flybussekspressen/F3/sunday.csv", "Flybussekspressen: F3 Sunday"));

            add(new TmpFileListItem("timetables/flybussekspressen/F4/monday-friday.csv", "Flybussekspressen: F4 Monday - Friday"));
            add(new TmpFileListItem("timetables/flybussekspressen/F4/saturday-sunday.csv", "Flybussekspressen: F4 Saturday - Sunday"));

            add(new TmpFileListItem("timetables/flybussekspressen/F11/monday-friday.csv", "Flybussekspressen: F11 Monday - Friday"));
            add(new TmpFileListItem("timetables/flybussekspressen/F11/saturday.csv", "Flybussekspressen: F11 Saturday"));
            add(new TmpFileListItem("timetables/flybussekspressen/F11/sunday.csv", "Flybussekspressen: F11 Sunday"));

            add(new TmpFileListItem("timetables/flytoget/monday-friday.csv", "Flytoget: Monday - Friday"));
            add(new TmpFileListItem("timetables/flytoget/sunday.csv", "Flytoget: Sunday"));

            add(new TmpFileListItem("timetables/nettbuss/timesekspressen/monday-friday.csv", "Nettbuss Timesekspress: TE15 Monday - Friday"));
            add(new TmpFileListItem("timetables/nettbuss/timesekspressen/saturday.csv", "Nettbuss Timesekspress: TE15 Saturday"));
            add(new TmpFileListItem("timetables/nettbuss/timesekspressen/sunday.csv", "Nettbuss Timesekspress: TE15 Sunday"));

            add(new TmpFileListItem("timetables/nettbuss/shuttlebus/S22/monday-friday.csv", "Nettbuss Shuttle: S22 Monday - Friday"));
            add(new TmpFileListItem("timetables/nettbuss/shuttlebus/S22/saturday.csv", "Nettbuss Shuttle: S22 Saturday"));
            add(new TmpFileListItem("timetables/nettbuss/shuttlebus/S22/sunday.csv", "Nettbuss Shuttle: S22 Sunday"));
            add(new TmpFileListItem("timetables/nettbuss/shuttlebus/S33/monday-sunday.csv", "Nettbuss Shuttle: S33"));
            add(new TmpFileListItem("timetables/nettbuss/shuttlebus/S44/monday-friday.csv", "Nettbuss Shuttle S44: Monday - Friday"));
            add(new TmpFileListItem("timetables/nettbuss/shuttlebus/S44/saturday-sunday.csv", "Nettbuss Shuttle S44: Saturday - Sunday"));
            add(new TmpFileListItem("timetables/nettbuss/shuttlebus/S55/monday-sunday.csv", "Nettbuss Shuttle S55"));

            add(new TmpFileListItem("timetables/nettbuss/express/NX170/monday-sunday.csv", "Nettbuss Express NX170"));
            add(new TmpFileListItem("timetables/nettbuss/express/NX145/monday-sunday.csv", "Nettbuss Express NX145"));
            add(new TmpFileListItem("timetables/nettbuss/express/NX147/monday-sunday.csv", "Nettbuss Express NX147"));

            add(new TmpFileListItem("timetables/nsb/monday-friday.csv", "NSB: Monday - Friday"));
            add(new TmpFileListItem("timetables/nsb/saturday.csv", "NSB: Saturday"));
            add(new TmpFileListItem("timetables/nsb/sunday.csv", "NSB: Sunday"));

            add(new TmpFileListItem("timetables/sasflybussen/monday-friday.csv", "SAS Flybussen: Monday - Friday"));
            add(new TmpFileListItem("timetables/sasflybussen/saturday.csv", "SAS Flybussen: Saturday"));
            add(new TmpFileListItem("timetables/sasflybussen/sunday.csv", "SAS Flybussen: Sunday"));

        }};

        timetables.stream().forEach((item) -> {

            InputStream is = StartupBean.class.getResourceAsStream(item.getFilename());
            Timetable t = Timetable.getTimetableFromCsv(is, item.getName());

            entityManager.persist(t);
        });

        // Simulation with data

        InputStream is = StartupBean.class.getResourceAsStream(timetables.get(0).getFilename());
        Timetable t = Timetable.getTimetableFromCsv(is, timetables.get(0).getName());

        List<Node> nodes = new ArrayList<>();

        Producer producer = new Producer();

        Consumer consumer = new Consumer(10);

        nodes.add(producer);
        nodes.add(consumer);

        List<Relationship> relationships = new ArrayList<>();
        relationships.add(new Relationship(producer, consumer, 1.0));

        Simulation simulation3 = new Simulation("Simulation with data which has been simulated", new Date(), nodes, relationships, 0, 100, 25);
        SimulationHelper simulationHelper = new SimulationHelper();
        simulationHelper.simulate(simulation3);
        entityManager.persist(simulationHelper.getSimulation());

    }
}
