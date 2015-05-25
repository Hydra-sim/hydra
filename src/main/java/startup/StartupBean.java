package startup;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import helpers.ProducerHelper;
import models.*;
import org.apache.commons.io.IOUtils;
import presets.SimplePreset;
import presets.OSLPreset;

import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;
import java.io.*;
import java.util.LinkedList;
import java.util.List;

/**
 * This class contains all the data that is to be persisted at deployment
 */
@Singleton
@Startup
public class StartupBean {

    // EntityManager for communications with the database.

    @PersistenceContext( unitName = "manager" )
    private EntityManager entityManager;

    @EJB
    private dao.Timetable timetableDao;

    @EJB
    private factory.MapFactory mapFactory;

    @EJB
    private dao.Map mapDao;

    List< Timetable > timetables;

    /**
     * This method is run on every deployment
     */
    @PostConstruct
    public void startup() {
        try {
            // Timetables
            setupTimetables();

            timetables = timetableDao.list();

            // Upload map
            InputStream InputStreamOslPng = StartupBean.class.getResourceAsStream("osl.png");
            byte[] bytes = IOUtils.toByteArray(InputStreamOslPng);
            models.Map map = mapFactory.createMap(bytes, 30, 1741, 752);

            // Create the output stream & copy the input stream to the output
            OutputStream os = new FileOutputStream(map.getFile());
            IOUtils.copy(new ByteArrayInputStream(bytes), os);
            os.close();

            // Persist the map to the database
            mapDao.add(map);

            Simulation OSLPreset2 = persistJsonFile( "presets/OSLPreset.json" );
            OSLPreset2.setMap(map);
            OSLPreset2.setName( "OSL" );


        } catch(Exception e) {

        }
    }

    @SuppressWarnings( "unchecked" )
    @Consumes( MediaType.APPLICATION_JSON )
    private Simulation persistJsonFile( String path ) {

        InputStream inputStream = StartupBean.class.getResourceAsStream( path );

        try {

            //Scanner scanner = new Scanner( new File( path ) );
            BufferedReader reader = new BufferedReader( new InputStreamReader( inputStream ) );

            JsonElement element = new JsonParser().parse( reader.readLine() );
            JsonObject object = element.getAsJsonObject();

            Simulation simulation = new Simulation();

            simulation.setName( object.get( "name" ).getAsString() );
            simulation.setStartTick( object.get( "startTick" ).getAsInt() );
            simulation.setTicks( object.get( "ticks" ).getAsInt() );
            simulation.setTickBreakpoints( object.get( "tickBreakpoints" ).getAsInt() );

            if ( !object.get( "password" ).isJsonNull() ) {

                simulation.setPassword( object.get( "password" ).getAsString() );
            }

            simulation.setPreset( true );

            JsonArray nodes = object.getAsJsonArray( "nodes" );

            for ( final JsonElement node : nodes ) {

                JsonObject nodeObject = node.getAsJsonObject();

                String type = nodeObject.get( "type" ).getAsString();

                switch ( type ) {

                    // PASSENGERFLOW
                    case "passengerflow":

                        Producer passengerFlow = new Producer();

                        passengerFlow.setType( type );
                        passengerFlow.setTmpId( nodeObject.get( "id" ).getAsInt() );
                        passengerFlow.setX( nodeObject.get( "x" ).getAsInt() );
                        passengerFlow.setY( nodeObject.get( "y" ).getAsInt() );

                        int personsPerArrival = nodeObject.get( "personsPerArrival" ).getAsInt();
                        int timeBetweenArrivals = nodeObject.get( "timeBetweenArrivals" ).getAsInt();
                        int numberOfArrivals = nodeObject.get( "numberOfArrivals" ).getAsInt();

                        new ProducerHelper().generateTimetable( passengerFlow, simulation.getStartTick(), timeBetweenArrivals,
                                numberOfArrivals, personsPerArrival );

                        simulation.getNodes().add( passengerFlow );

                        break;

                    // PRODUCER
                    case "producer":
                    case "train":
                    case "bus":

                        Producer producer = new Producer();

                        producer.setType( type );
                        producer.setTmpId( nodeObject.get( "id" ).getAsInt() );
                        producer.setX( nodeObject.get( "x" ).getAsInt() );
                        producer.setY( nodeObject.get( "y" ).getAsInt() );

                        Timetable timetable = new Timetable();
                        timetable.setName( nodeObject.get( "timetable" ).getAsJsonObject().get( "name" ).getAsString() );

                        timetables.stream().filter(
                                table -> table.getName().equals( timetable.getName() ) )
                                .forEach( producer::setTimetable );


                        simulation.getNodes().add( producer );
                        break;

                    // CONSUMER
                    case "consumer":
                    case "desktop":
                    case "suitcase":
                    case "parking":
                    case "door":
                    case "arrows-h":

                        Consumer consumer = new Consumer( nodeObject.get( "ticksToConsumeEntity" ).getAsInt() );

                        consumer.setType( type );
                        consumer.setTmpId( nodeObject.get( "id" ).getAsInt() );
                        consumer.setX( nodeObject.get( "x" ).getAsInt() );
                        consumer.setY( nodeObject.get( "y" ).getAsInt() );

                        consumer.setBusStop_inUse( nodeObject.get( "busStop_inUse" ).getAsBoolean() );

                        simulation.getNodes().add( consumer );

                        break;

                    // CONSUMER GROUP
                    default:

                        JsonArray consumers = nodeObject.getAsJsonArray( "consumers" );
                        int numberOfConsumers = consumers.size();
                        int ticksToConsumeEntities = nodeObject.get( "ticksToConsumeEntity" ).getAsInt();

                        ConsumerGroup consumerGroup = new ConsumerGroup( numberOfConsumers, ticksToConsumeEntities );

                        consumerGroup.setType( type );
                        consumerGroup.setTmpId( nodeObject.get( "id" ).getAsInt() );
                        consumerGroup.setX( nodeObject.get( "x" ).getAsInt() );
                        consumerGroup.setY( nodeObject.get( "y" ).getAsInt() );

                        simulation.getNodes().add( consumerGroup );
                }
            }

            JsonArray relationships = object.getAsJsonArray( "relationships" );

            for ( final JsonElement relationshipElement : relationships ) {

                JsonObject relationshipObject = relationshipElement.getAsJsonObject();

                Relationship relationship = new Relationship();

                relationship.setWeight( relationshipObject.get( "weight" ).getAsInt() );

                for ( Node node : simulation.getNodes() ) {

                    if ( node.getTmpId() == relationshipObject.get( "source" ).getAsJsonObject().get( "id" ).getAsInt() ) {

                        relationship.setSource( node );

                    } else if ( node.getTmpId() == relationshipObject.get( "target" ).getAsJsonObject().get( "id" ).getAsInt() ) {

                        relationship.setTarget( node );
                    }
                }

                simulation.getRelationships().add( relationship );
            }

            entityManager.persist( simulation );
            return simulation;

        } catch ( Exception e ) {

            e.printStackTrace();
        }

        return null;
    }

    private void setupTimetables() {
        List< TmpFileListItem > timetables = new LinkedList< TmpFileListItem >() {{
            add( new TmpFileListItem( "timetables/flybussekspressen/F1/monday-friday.csv", "Flybussekspressen: F1 Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/flybussekspressen/F1/saturday.csv", "Flybussekspressen: F1 Saturday" ) );
            add( new TmpFileListItem( "timetables/flybussekspressen/F1/sunday.csv", "Flybussekspressen: F1 Sunday" ) );

            add( new TmpFileListItem( "timetables/flybussekspressen/F3/monday-friday.csv", "Flybussekspressen: F3 Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/flybussekspressen/F3/saturday.csv", "Flybussekspressen: F3 Saturday" ) );
            add( new TmpFileListItem( "timetables/flybussekspressen/F3/sunday.csv", "Flybussekspressen: F3 Sunday" ) );

            add( new TmpFileListItem( "timetables/flybussekspressen/F4/monday-friday.csv", "Flybussekspressen: F4 Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/flybussekspressen/F4/saturday-sunday.csv", "Flybussekspressen: F4 Saturday - Sunday" ) );

            add( new TmpFileListItem( "timetables/flybussekspressen/F11/monday-friday.csv", "Flybussekspressen: F11 Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/flybussekspressen/F11/saturday.csv", "Flybussekspressen: F11 Saturday" ) );
            add( new TmpFileListItem( "timetables/flybussekspressen/F11/sunday.csv", "Flybussekspressen: F11 Sunday" ) );

            add( new TmpFileListItem( "timetables/flytoget/monday-friday.csv", "Flytoget: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/flytoget/sunday.csv", "Flytoget: Sunday" ) );

            add( new TmpFileListItem( "timetables/nettbuss/timesekspressen/monday-friday.csv", "Nettbuss Timesekspress: TE15 Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nettbuss/timesekspressen/saturday.csv", "Nettbuss Timesekspress: TE15 Saturday" ) );
            add( new TmpFileListItem( "timetables/nettbuss/timesekspressen/sunday.csv", "Nettbuss Timesekspress: TE15 Sunday" ) );

            add( new TmpFileListItem( "timetables/nettbuss/shuttlebus/S22/monday-friday.csv", "Nettbuss Shuttle: S22 Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nettbuss/shuttlebus/S22/saturday.csv", "Nettbuss Shuttle: S22 Saturday" ) );
            add( new TmpFileListItem( "timetables/nettbuss/shuttlebus/S22/sunday.csv", "Nettbuss Shuttle: S22 Sunday" ) );
            add( new TmpFileListItem( "timetables/nettbuss/shuttlebus/S33/monday-sunday.csv", "Nettbuss Shuttle: S33" ) );
            add( new TmpFileListItem( "timetables/nettbuss/shuttlebus/S44/monday-friday.csv", "Nettbuss Shuttle S44: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nettbuss/shuttlebus/S44/saturday-sunday.csv", "Nettbuss Shuttle S44: Saturday - Sunday" ) );
            add( new TmpFileListItem( "timetables/nettbuss/shuttlebus/S55/monday-sunday.csv", "Nettbuss Shuttle S55" ) );

            add( new TmpFileListItem( "timetables/nettbuss/express/NX170/monday-sunday.csv", "Nettbuss Express NX170" ) );
            add( new TmpFileListItem( "timetables/nettbuss/express/NX145/monday-sunday.csv", "Nettbuss Express NX145" ) );
            add( new TmpFileListItem( "timetables/nettbuss/express/NX147/monday-sunday.csv", "Nettbuss Express NX147" ) );

            add( new TmpFileListItem( "timetables/nsb/eidsvoll-kongsberg/monday-friday.csv", "NSB Eidsvoll - Kongsberg: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nsb/eidsvoll-kongsberg/saturday-sunday.csv", "NSB Eidsvoll - Kongsberg: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nsb/kongsberg-eidsvoll/monday-sunday.csv", "NSB Kongsberg - Eidsvoll" ) );

            add( new TmpFileListItem( "timetables/nsb/lillehammer-skien/monday-friday.csv", "NSB Lillehamer - Skien: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nsb/lillehammer-skien/saturday.csv", "NSB Lillehamer - Skien: Saturday" ) );
            add( new TmpFileListItem( "timetables/nsb/lillehammer-skien/sunday.csv", "NSB Lillehamer - Skien: Sunday" ) );
            add( new TmpFileListItem( "timetables/nsb/skien-lillehammer/monday-friday.csv", "NSB Skien - Lillehamer: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nsb/skien-lillehammer/saturday.csv", "NSB Skien - Lillehamer: Saturday" ) );
            add( new TmpFileListItem( "timetables/nsb/skien-lillehammer/sunday.csv", "NSB Skien - Lillehamer: Sunday" ) );

            add( new TmpFileListItem( "timetables/nsb/trondheim-oslo/monday-friday.csv", "NSB Trondheim - Oslo: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/nsb/trondheim-oslo/saturday.csv", "NSB Trondheim - Oslo: Saturday" ) );
            add( new TmpFileListItem( "timetables/nsb/trondheim-oslo/sunday.csv", "NSB Trondheim - Oslo: Sunday" ) );

            add( new TmpFileListItem( "timetables/sasflybussen/monday-friday.csv", "SAS Flybussen: Monday - Friday" ) );
            add( new TmpFileListItem( "timetables/sasflybussen/saturday.csv", "SAS Flybussen: Saturday" ) );
            add( new TmpFileListItem( "timetables/sasflybussen/sunday.csv", "SAS Flybussen: Sunday" ) );

        }};


        for ( TmpFileListItem item : timetables ) {

            InputStream is = StartupBean.class.getResourceAsStream( item.getFilename() );
            Timetable t = Timetable.getTimetableFromCsv( is, item.getName() );
            entityManager.persist( t );
        }
    }
}
