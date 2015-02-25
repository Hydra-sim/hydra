package controllers;

import models.Node;
import models.Relationship;

import java.util.List;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class NodeManager {

    public void addRelationship(Node node, Relationship relationship) {

        List<Relationship> relationships = node.getRelationships();
        relationships.add(relationship);
        node.setRelationships(relationships);
    }

    public void distributeWeightIfNotSpecified(Node node) {

        List<Relationship> relationships = node.getRelationships();

        boolean weighted = false;

        for(Relationship relationship : relationships) {

            if(relationship.getWeight() != 0.0) weighted = true;
        }

        if(!weighted) {
            double weight = (double) 1 / relationships.size();

            for (int i = 0; i < relationships.size(); i++) {

                relationships.get(i).setWeight(weight);
            }
        }
    }
}
