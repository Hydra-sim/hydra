package api.data;

/**
 * Created by knarf on 09/04/15.
 */
import javax.ws.rs.FormParam;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.jboss.resteasy.annotations.providers.multipart.PartType;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FileUploadForm {

    @FormParam("file")
    @PartType("application/octet-stream")
    private byte[] data;

    @FormParam("name")
    public String name;

    public InputStream getInputStream() {
        return new ByteArrayInputStream(data);
    }

    public byte[] getData() {
        return data;
    }
}