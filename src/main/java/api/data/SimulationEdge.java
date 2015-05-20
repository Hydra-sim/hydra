package api.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 * Created by knarf on 20/04/15.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SimulationEdge {
    public int id;
    public SimulationNode source;
    public SimulationNode target;
    public int weight;
}
