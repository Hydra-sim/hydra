package api.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 * Created by knarf on 17/04/15.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TrueFalse {
    public boolean truefalse;

    public TrueFalse(boolean truefalse) {
        this.truefalse = truefalse;
    }
}
