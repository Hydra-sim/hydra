package dao;

import javax.ejb.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by knarf on 15/05/15.
 */
@Singleton
public class Map {

    /**
     * EntityManager for communications with the database.
     */
    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    /**
     * Creates and persists a new map
     *
     * @param map the data from which the map is built
     */
    public void add(models.Map map)
    {
        entityManager.persist(map);
    }

    /**
     * Returns a list over maps
     * @return Returns a list over maps
     */
    public List<models.Map> list()
    {
        TypedQuery<models.Map> query = entityManager.createNamedQuery(
                "Map.findAll",
                models.Map.class
        );

        return query.getResultList();
    }

    /**
     * Returns a single map with a given ID
     * @param id ID of map to return
     * @return Return the map with the given ID
     * @throws Exception Throws exception if the map wasn't found
     */
    public String get(int id) //throws Exception
    {
        models.Map item = entityManager.find(models.Map.class, id);
        return item.getUrl();
    }

}
