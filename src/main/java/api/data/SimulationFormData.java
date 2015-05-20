package api.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

/**
 * The values used by the API to persist the simulation
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SimulationFormData {
    public String name;
    public int startTick;
    public int ticks;
    public int mapId;

    public List<SimulationNode> nodes;
    public List<SimulationEdge> edges;


}
