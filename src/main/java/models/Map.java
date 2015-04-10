package models;

import javax.persistence.*;
import javax.ws.rs.Produces;

@NamedQuery(name = "Map.findAll", query = "SELECT a FROM Map a")

/**
 * A model containing information used to display, scale and zoom into a Map
 */
@javax.persistence.Entity
public class Map {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    private String url;
    private double scale;
    private int zoom;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public double getScale() {
        return scale;
    }

    public void setScale(double scale) {
        this.scale = scale;
    }

    public int getZoom() {
        return zoom;
    }

    public void setZoom(int zoom) {
        this.zoom = zoom;
    }

    public Map(String url, double scale, int zoom) {
        this.url = url;
        this.scale = scale;
        this.zoom = zoom;
    }

    public Map(String url) {

        this("", 1.0, 0);
    }


    public Map() {
        this("");
    }
}
