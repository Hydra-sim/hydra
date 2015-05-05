package models.data;

import models.Relationship;

import java.util.List;

/**
 * Created by kristinesundtlorentzen on 5/5/15.
 */
public class QueueElement {

    private int entities;
    private List<Relationship> relationships;

    public QueueElement(int entities, List<Relationship> relationships) {
        this.entities = entities;
        this.relationships = relationships;
    }

    public int getEntities() {
        return entities;
    }

    public void setEntities(int entities) {
        this.entities = entities;
    }

    public List<Relationship> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<Relationship> relationships) {
        this.relationships = relationships;
    }
}
