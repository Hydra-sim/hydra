package api.data;

import java.util.List;

/**
 * The values used by the API to persist the simulation
 */
public class SimulationFormData {
    public String name;
    public int startTick;
    public int ticks;
    public int breakpoints;

    public List<SimulationNode> nodes;
    public List<SimulationEdge> edges;


}
