package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * The parent of both {@link models.Consumer consumers} and {@link models.Producer producers}.
 * Has a unique ID, a list of {@link models.Relationship relationships} and a value representing the number of
 * {@link models.Entity entites} that have been transfered from this node to another.
 */
@javax.persistence.Entity
@Inheritance(strategy=InheritanceType.TABLE_PER_CLASS)
abstract public class Node {

    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    @Transient
    private int entitiesTransfered;

    @Transient
    private int entitiesRecieved;

    @Transient
    private List<Entity> entitiesReady;

    public Node() {

        entitiesTransfered = 0;
        entitiesRecieved = 0;
        entitiesReady = new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEntitiesTransfered() {
        return entitiesTransfered;
    }

    public void setEntitiesTransfered(int entitiesTransfered) {
        this.entitiesTransfered = entitiesTransfered;
    }

    public int getEntitiesRecieved() {
        return entitiesRecieved;
    }

    public void setEntitiesRecieved(int entitiesRecieved) {
        this.entitiesRecieved = entitiesRecieved;
    }

    public List<Entity> getEntitiesReady() {
        return entitiesReady;
    }

    public void setEntitiesReady(List<Entity> entitiesReady) {
        this.entitiesReady = entitiesReady;
    }
}
