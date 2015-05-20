package api.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 * Password for {@link models.Simulation}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PasswordFormData {

    public int id;
    public String input;
}
