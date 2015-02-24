package pojos;

import interfaces.Node;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */

//TODO: Add a check when using dependencies so that it doesn't crash if you make something dependent to itself?
public class Dependency {

    //region attributes

    private Node node1, node2;
    private double weight;

    //endregion

    //region constructors


    public Dependency(Node node1, Node node2, double weight) {
        this.node1 = node1;
        this.node2 = node2;
        this.weight = weight;
    }

    public Dependency(Node node1, Node node2) {
        this(node1, node2, 0.0);
    }


    public Dependency() {
        this(null, null);
    }

    //endregion

    //region getters and setters

    public Node getNode1() {
        return node1;
    }

    public void setNode1(Node node1) {
        this.node1 = node1;
    }

    public Node getNode2() {
        return node2;
    }

    public void setNode2(Node node2) {
        this.node2 = node2;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    //endregion
}
