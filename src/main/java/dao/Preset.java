package dao;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

/**
 * Created by knarf on 10/04/15.
 */
@Singleton
public class Preset extends Simulation {

    // EntityManager for communications with the database.
    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    /**
     * Gets a list all the presets in the database with a named query defined in {@link models.Simulation}
     *
     * @return the list of the presets found
     */
    public List<models.Simulation> list()
    {
        TypedQuery<models.Simulation> query = entityManager.createNamedQuery(

                "Simulation.findPresets", // Uses one of three available queries for Simulation
                models.Simulation.class
        );

        return query.getResultList();
    }
}
