package factory;

import api.data.FileUploadForm;
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
        // Hash the content to generate unique name
        String hash = EncryptionHelper.hashByteArray(fileUploadForm.getData());

        // Generate filename
        String filename = EncryptionHelper.getPath() + "/" + hash;

        return new Map(filename, fileUploadForm.getZoom());
    }
}
