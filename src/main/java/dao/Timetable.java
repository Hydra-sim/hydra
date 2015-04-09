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
public class Timetable {

    /**
     * EntityManager for communications with the database.
     */
    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    /**
     * Creates and persists a new timetable
     *
     * @param timetable the data from which the timetable is built
     */
    public void add(models.Timetable timetable)
    {
        entityManager.persist(timetable);
    }

    /**
     * Gets a list all the timetables in the database with a named query defined in {@link models.Timetable}
     *
     * @return the list of the timetables found
     */
    public List<models.Timetable> list()
    {
        TypedQuery<models.Timetable> query = entityManager.createNamedQuery(
                "Timetable.findAll",
                models.Timetable.class
        );

        return query.getResultList();
    }

    /**
     * Gets a single timetable
     *
     * @param id the id of the timetable to be retrieved
     */
    public models.Timetable get(int id) throws Exception
    {
        return entityManager.find(models.Timetable.class, id);
    }

    /**
     * Edits the data on an existing timetable
     *
     * @param timetable the new data
     */
    public void edit(models.Timetable timetable) throws Exception
    {
        entityManager.merge(timetable);
    }

    /**
     * Deletes a timetable from the database
     *
     * @param id the id of the timetable to be deleted
     */
    public void delete(int id) throws Exception
    {
        models.Timetable item = entityManager.find(models.Timetable.class, id);
        entityManager.remove(item);
    }
}
