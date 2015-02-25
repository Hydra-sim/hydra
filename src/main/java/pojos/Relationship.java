package pojos;

import controllers.ConsumerController;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */

//TODO: Add a check when using dependencies so that it doesn't crash if you make something dependent to itself?
public class Relationship implements Comparable<Relationship>{

    //region attributes

    private Consumer child;
    private double weight;

    //endregion

    //region constructors

    public Relationship(Consumer child, double weight) {
        this.child = child;
        this.weight = weight;
    }

    public Relationship() {

        this(new Consumer(), 0.0);
    }

    //endregion

    //region getters and setters

    public Consumer getChild() {
        return child;
    }

    public void setChild(Consumer child) {
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

        ConsumerController controller = new ConsumerController();
        if(controller.getTotalSentToConsumer(o.getChild()) > controller.getTotalSentToConsumer(this.getChild())) return 1;
        if(o.getWeight() > this.getWeight()) return 1;
        return -1;
    }

    //endregion


}
