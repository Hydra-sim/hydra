package models;

import javax.persistence.*;

/**
 * Represents a path an {@link models.Entity entity} can take from a {@link models.Node node} to another node.
 * Has a unique ID, a {@link Consumer consumer} that the {@link models.Node parent node} can send entites to and a
 * value representing the weight of the relationship.
 */
//TODO: Add a check when using dependencies so that it doesn't crash if you make something dependent to itself?
@javax.persistence.Entity
public class Relationship implements Comparable<Relationship>{

    //region attributes

    /**
     * An automatically generated id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    @ManyToOne(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    private Node parent;

    @ManyToOne(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    private Node child;

    private double weight;

    //endregion

    //region constructors

    public Relationship(Node parent, Node child, double weight) {
        this.parent = parent;
        this.child = child;
        this.weight = weight;
    }

    //endregion

    //region getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Node getParent() {
        return parent;
    }

    public void setParent(Node parent) {
        this.parent = parent;
    }

    public Node getChild() {
        return child;
    }

    public void setChild(Node child) {
        this.child = child;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    @Override
    public int compareTo(Relationship o) {

        if(o == this) return 0;

        if(o.getChild().getEntitiesRecieved() > child.getEntitiesRecieved()) return 1;
        if(o.getWeight() > this.getWeight()) return 1;
        return -1;
    }

    //endregion
}
