package startup;

import models.Map;
import models.Simulation;
import models.Timetable;
import models.TimetableEntry;
import models.presets.OSLPreset;
import org.apache.commons.io.IOUtils;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
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

        //Test image
        try (InputStream inputStream = new FileInputStream("/Users/kristinesundtlorentzen/Dropbox/School/2015/hydra/src/main/resources/IMG_0005.JPG")){

            Map map = new Map(IOUtils.toByteArray(inputStream));
            //Map map = new Map();
            entityManager.persist(map);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
