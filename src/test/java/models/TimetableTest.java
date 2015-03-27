package models;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

/**
 * Created by kristinesundtlorentzen on 26/3/15.
 */
public class TimetableTest {

    Timetable timetable;

    @Before
    public void setup() {
        timetable = new Timetable();
    }

    @Ignore
    @Test
    public void testTimetableFromCsv() {

        String path = "/Users/kristinesundtlorentzen/Dropbox/School/2015/hydra/src/main/resources/timetable.csv";

        timetable.getTimetableFromCsv(path);
    }
}
