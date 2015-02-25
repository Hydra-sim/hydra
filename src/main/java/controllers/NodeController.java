package controllers;

import models.Node;
import models.Relationship;

import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class NodeController {

    public void addRelationship(Node node, Relationship relationship) {

        List<Relationship> relationships = node.getRelationships();
        relationships.add(relationship);
        node.setRelationships(relationships);
    }
}
