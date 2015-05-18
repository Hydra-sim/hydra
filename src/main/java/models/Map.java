package models;

import javax.persistence.*;
import javax.ws.rs.Produces;
import java.io.File;

@NamedQuery(name = "Map.findAll", query = "SELECT a FROM Map a")

/**
 * A model containing information used to display, scale and zoom into a Map
 */
@javax.persistence.Entity
public class Map {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    private double scale;
    private String filepath;

    public int getId() {
        return id;
    }

    public double getScale() {
        return scale;
    }

    public void setScale(double scale) {
        this.scale = scale;
    }

    /**
     * @todo This shouldn't be returned from the api. We need to look into not serializing it.
     */
    public File getFile() {
        return new File(filepath);
    }

    public String getUrl() {
        return "api/map/" + this.id;
    }

    public Map(String filepath, double scale) {
        this.filepath = filepath;
        this.scale = scale;
    }

    public Map() {

    }
}
