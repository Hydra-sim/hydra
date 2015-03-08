package managers;

import models.Producer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kristinesundtlorentzen on 2/3/15.
 */
public class ProducerManager {

    public void generateTimetable(Producer producer, int startTick, int tickBetweenArrivals, int numberOfArrivals) {

        List<Integer> timetable = new ArrayList<>();

        for(int i = startTick; i < numberOfArrivals*tickBetweenArrivals; i += tickBetweenArrivals) {

            timetable.add(i);
        }

        producer.setTimetable(timetable);
    }
}
