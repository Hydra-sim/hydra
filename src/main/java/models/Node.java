package models;

import javax.persistence.Inheritance;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
@Inheritance
public class Node {

    @OneToMany
    List<Relationship> relationships = new ArrayList<>();

    int entitiesTransfered;

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
