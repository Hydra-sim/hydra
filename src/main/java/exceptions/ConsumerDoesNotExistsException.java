package exceptions;

/**
 * Created by kristinesundtlorentzen on 25/2/15.
 */
public class ConsumerDoesNotExistsException extends Exception{

    @Override
    public String getMessage() {

        return "A relationship is pointing to a consumer that doesn't exist.";
    }
}
