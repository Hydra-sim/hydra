package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
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
