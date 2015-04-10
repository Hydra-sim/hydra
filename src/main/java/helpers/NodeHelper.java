package helpers;

import models.Node;
import models.Relationship;

import java.util.List;

/**
 * A manager with helper method(s) for {@link models.Node}
 */
public class NodeHelper {

    /**
     * Automatically distributes weight to the {@link models.Relationship relationships} if they are all 0.0
     * @param node the node we wish to distribute weight on
     */
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
