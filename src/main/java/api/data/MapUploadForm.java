package api.data;

/**
 * Created by knarf on 09/04/15.
 */

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.jboss.resteasy.annotations.providers.multipart.PartType;

import javax.ws.rs.FormParam;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MapUploadForm {

    @FormParam("file")
    @PartType("application/octet-stream")
    private byte[] data;

    @FormParam("zoom")
    public int zoom;

    @FormParam("width")
    public int width;

    @FormParam("height")
    public int height;

    public InputStream getInputStream() {
        return new ByteArrayInputStream(data);
    }

    public byte[] getData() {
        return data;
    }

    public int getZoom() {
        return zoom;
    }

    public int getHeight() {
        return height;
    }

    public int getWidth() {
        return width;
    }
}