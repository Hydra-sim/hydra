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
public class Simulation {

    /**
     * EntityManager for communications with the database.
     */
    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    /**
     * Persists a new simulation to the database
     * @param item The new item to persist
     */
    public void add(models.Simulation item)
    {
        entityManager.persist(item);
    }

    /**
     * Gets a list all the simulations in the database with a named query defined in {@link models.Simulation}
     *
     * @return the list of the simulations found
     */
    public List<models.Simulation> list()
    {
        TypedQuery<models.Simulation> query = entityManager.createNamedQuery(

                "Simulation.findNotPreset", // Uses one of three available queries for Simulation
                models.Simulation.class
        );

        return query.getResultList();
    }

    /**
     * Gets a single simulation
     *
     * @param id the id of the simulation to be retrieved
     */
    public models.Simulation get(int id) throws Exception
    {
        return entityManager.find(models.Simulation.class, id);
    }

    /**
     * Deletes a simulation from the database
     *
     * @param id the id of the simulation to be deleted
     */
    public void delete(int id) throws Exception
    {
        models.Simulation item = entityManager.find(models.Simulation.class, id);
        item.setMap(null); // Set image to null before deleting it since that won't work
        entityManager.remove(item);
    }

    /**
     * TODO: Comment
     */
    public void update(models.Simulation simulation) throws Exception
    {
        entityManager.merge(simulation);
    }
}
