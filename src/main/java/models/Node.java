package models;

import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import javax.persistence.Inheritance;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
@Embeddable
@Inheritance
public class Node {

    @ElementCollection
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
