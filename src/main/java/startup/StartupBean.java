package startup;

import models.Simulation;
import models.Timetable;
import models.presets.OSLPreset;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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
        Timetable timetable = Timetable.getTimetableFromCsv("/Users/kristinesundtlorentzen/Dropbox/School/2015/hydra/src/main/resources/timetable.csv");
        timetable.setName("Persisted timetable");
        entityManager.persist(timetable);

        // Creating the OSL preset and saving it to the database
        Simulation simulation = new OSLPreset().createOSLPreset();
        entityManager.persist(simulation);
    }
}
