package startup;

import models.Simulation;
import models.Timetable;
import models.TimetableEntry;
import models.presets.OSLPreset;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;

/**
 * Created by knarf on 18/03/15.
 */
@Singleton
@Startup
public class StartupBean {

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    @PostConstruct
    public void startup() {
        // Creating a test timetable and saving it to the database
        Timetable timetable1 = new Timetable("Timetable 1");
        timetable1.setArrivals(new ArrayList<TimetableEntry>() {{
            add(new TimetableEntry(10, 10));
            add(new TimetableEntry(10, 20));
        }});

        Timetable timetable2 = new Timetable("Timetable 2");
        timetable2.setArrivals(new ArrayList<TimetableEntry>() {{
            add(new TimetableEntry(10, 30));
            add(new TimetableEntry(10, 40));
        }});

        Timetable timetable3 = new Timetable("Timetable 3");
        timetable3.setArrivals(new ArrayList<TimetableEntry>() {{
            add(new TimetableEntry(10, 50));
            add(new TimetableEntry(10, 60));
        }});

        entityManager.persist(timetable1);
        entityManager.persist(timetable2);
        entityManager.persist(timetable3);

        // Creating the OSL preset and saving it to the database
        Simulation simulation = new OSLPreset().createOSLPreset();
        entityManager.persist(simulation);
    }
}
