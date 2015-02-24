package controllers;

import interfaces.Node;
import pojos.Dependency;

/**
 * Created by kristinesundtlorentzen on 24/2/15.
 */
public class DependencyController {

    public Node getDependantID(Dependency dependency, Node node) {

        if(node == dependency.getNode1()) return dependency.getNode2();
        if(node == dependency.getNode2()) return dependency.getNode1();
        return null;
    }
}
