package api.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 * Created by knarf on 15/05/15.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class RunSim {
    public int id;
    public int breakpoints;
}
