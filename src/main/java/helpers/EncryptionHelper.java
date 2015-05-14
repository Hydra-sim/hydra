package helpers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;

/**
 * Created by knarf on 24/04/15.
 */
public class EncryptionHelper {

    private static Path tmpPath;

    public static Path getPath() throws IOException {
        if(tmpPath == null)
            tmpPath = Files.createTempDirectory("hydra_");

        return tmpPath;
    }

    /**
     * bytesToHex
     * @source http://www.herongyang.com/Cryptography/SHA1-Message-Digest-in-Java.html
     * @param b bytebuffer to convert to a hex-string
     * @return hex-encoded string
     */
    public static String bytesToHex(byte[] b) {
        char[] hexDigit = {'0', '1', '2', '3', '4', '5', '6', '7',
                '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
        StringBuilder buf = new StringBuilder();
        for (byte aB : b) {
            buf.append(hexDigit[(aB >> 4) & 0x0f]);
            buf.append(hexDigit[aB & 0x0f]);
        }
        return buf.toString();
    }

    /**
     * Hash the content to generate unique name
     * @param byteArray
     * @return
     */
    public static String hashByteArray(byte[] byteArray) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA1");
        md.update(byteArray);
        return bytesToHex(md.digest());
    }
}
