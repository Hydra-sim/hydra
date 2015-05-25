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

    private int width, height;

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

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public Map(String filepath, double scale, int width, int height) {
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
