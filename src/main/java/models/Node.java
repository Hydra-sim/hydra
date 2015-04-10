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

    @OneToMany(cascade= CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Relationship> relationships = new ArrayList<>();

    @Transient
    private int entitiesTransfered;

    public Node() {

        relationships = new ArrayList<>();
        entitiesTransfered = 0;
    }

    public List<Relationship> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<Relationship> relationships) {
        this.relationships = relationships;
    }

    public int getEntitiesTransfered() {
        return entitiesTransfered;
    }

    public void setEntitiesTransfered(int entitiesTransfered) {
        this.entitiesTransfered = entitiesTransfered;
    }
}
