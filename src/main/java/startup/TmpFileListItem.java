package startup;

/**
 * Created by knarf on 29/04/15.
 */
public class TmpFileListItem {
    private String name;
    private String filename;

    public TmpFileListItem(String filename, String name) {
        this.name = name;
        this.filename = filename;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
