package models.data;

import models.Node;

import javax.persistence.*;

/**
 * Created by kristinesundtlorentzen on 5/5/15.
 */

@Entity
public class TransferData {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    public int entitiesTransfered;
    public int entitiesRecieved;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    public Node target;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    public Node source;

    public TransferData() {

    }

    public TransferData(int entitiesTransfered, int entitiesRecieved, Node target, Node source) {
        this.entitiesTransfered = entitiesTransfered;
        this.entitiesRecieved = entitiesRecieved;
        this.target = target;
        this.source = source;
    }
}
