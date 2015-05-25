package factory;

import api.data.MapUploadForm;
import helpers.EncryptionHelper;
import models.Map;

import javax.ejb.Singleton;

/**
 * Created by knarf on 15/05/15.
 */
@Singleton
public class MapFactory {
    public Map createMap(MapUploadForm fileUploadForm) throws Exception {
        return createMap(
                fileUploadForm.getData(),
                fileUploadForm.getZoom(),
                fileUploadForm.getWidth(),
                fileUploadForm.getHeight()
        );
    }

    public Map createMap(byte[] data, int zoom, String width, String height) throws Exception {
        // Hash the content to generate unique name
        String hash = EncryptionHelper.hashByteArray(data);

        // Generate filename
        String filename = EncryptionHelper.getPath() + "/" + hash;

        return new Map(filename, zoom, width, height);
    }
}
