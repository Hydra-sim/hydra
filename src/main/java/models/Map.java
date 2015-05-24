package models;

import javax.persistence.*;
import java.io.File;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    private String width, height;

    public int getId() {
        return id;
    }

    public double getScale() {
        return scale;
    }

    public void setScale(double scale) {
        this.scale = scale;
    }

    @JsonIgnore
    public File getFile() {
        return new File(filepath);
    }

    public String getUrl() {
        return "api/map/" + this.id;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public Map(String filepath, double scale, String width, String height) {
        this.scale = scale;
        this.filepath = filepath;
        this.width = width;
        this.height = height;
    }

    public Map(String filepath, double scale) {
        this.filepath = filepath;
        this.scale = scale;
    }

    public Map() {

    }
}
