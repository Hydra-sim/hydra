package startup;

import models.Timetable;
import models.TimetableEntry;

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
        Timetable test1 = new Timetable("test1");
        test1.setArrivals(new ArrayList<TimetableEntry>() {{
            add(new TimetableEntry(10, 10));
            add(new TimetableEntry(10, 20));
        }});

        entityManager.persist(test1);
    }
}
