package models;

import javax.persistence.*;
import javax.ws.rs.Produces;

/**
 * Created by kristinesundtlorentzen on 24/3/15.
 */
@NamedQuery(name = "Map.findAll", query = "SELECT a FROM Map a")

@javax.persistence.Entity
public class Map {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    @Lob
    @Basic(fetch=FetchType.LAZY)
    @Column(name="EMP_PIC", columnDefinition="BLOB NOT NULL")
    private byte[] image;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Map(byte[] image) {

        this.image = image;
    }

    public Map() {
        this(new byte[0]);
    }
}
