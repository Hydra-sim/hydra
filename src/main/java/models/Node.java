package models;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class Node {

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
