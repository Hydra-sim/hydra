package api.data;

/**
 * Created by knarf on 09/04/15.
 */

import org.jboss.resteasy.annotations.providers.multipart.PartType;

import javax.ws.rs.FormParam;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class MapUploadForm {

    @FormParam("file")
    @PartType("application/octet-stream")
    private byte[] data;

    @FormParam("zoom")
    public int zoom;

    public InputStream getInputStream() {
        return new ByteArrayInputStream(data);
    }

    public byte[] getData() {
        return data;
    }

    public int getZoom() {
        return zoom;
    }
}