package models;

import javax.persistence.*;

/**
 * Represents a path an {@link models.Entity entity} can take from a {@link models.Node node} to another node.
 * Has a unique ID, a {@link Consumer consumer} that the {@link models.Node source node} can send entites to and a
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
    private Node source;

    @ManyToOne(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    private Node target;

    private double weight;

    //endregion

    //region constructors

    public Relationship(Node source, Node target, double weight) {
        this.source = source;
        this.target = target;
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

    public Node getSource() {
        return source;
    }

    public void setSource(Node source) {
        this.source = source;
    }

    public Node getTarget() {
        return target;
    }

    public void setTarget(Node target) {
        this.target = target;
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

        if(o.getTarget().getEntitiesRecieved() > target.getEntitiesRecieved()) return 1;
        if(o.getWeight() > this.getWeight()) return 1;
        return -1;
    }

    //endregion
}
