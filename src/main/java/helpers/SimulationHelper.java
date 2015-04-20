package helpers;

import models.Consumer;
import models.ConsumerGroup;
import models.Simulation;

/**
 * Created by knarf on 20/04/15.
 */
public class SimulationHelper {

    /**
     * Checks which entity has the longest waiting time registered on it, and checks if this is higher than the highest
     * waiting time registered so far in the simulation.
     *
     * @param maxWaitingTime The largest of the registered waiting times so far in the simulation
     *
     * @return Whichever value is largest of the registered waiting times so far in the simulation and the highest
     *         waiting time of the entities registered on the entities list.
     */
    public int calculateWaitingTime(Simulation simulation, ConsumerHelper consumerHelper, int maxWaitingTime) {

        for(Consumer consumer : simulation.getConsumers()) {

            int waitingTime = consumerHelper.getMaxWaitingTime(consumer);
            if(waitingTime > maxWaitingTime) maxWaitingTime = waitingTime;
        }

        return maxWaitingTime;
    }

    /**
     *
     *
     * @param simulation
     * @param nodeHelper
     */
    public void distributeWeight(Simulation simulation, NodeHelper nodeHelper) {

        // Distribute weigh producers
        simulation.getProducers().forEach(nodeHelper::distributeWeightIfNotSpecified);

        // Distribute weight consumers
        simulation.getConsumers().forEach(nodeHelper::distributeWeightIfNotSpecified);
    }

    /**
     *
     * @param simulation
     * @return
     */
    public int getEntitesConsumed(Simulation simulation) {

        int entitiesConsumed = 0;

        for(Consumer consumer : simulation.getConsumers()) {
            entitiesConsumed += consumer.getEntitesConsumed().size();
        }

        for(ConsumerGroup consumerGroup : simulation.getConsumerGroups()) {

            for(Consumer consumer : consumerGroup.getConsumers()) {

                entitiesConsumed += consumer.getEntitesConsumed().size();
            }
        }

        return entitiesConsumed;
    }


    public int getEntitiesInQueue(Simulation simulation) {

        int entitiesInQueue = 0;

        for(Consumer consumer : simulation.getConsumers()) {

            entitiesInQueue += consumer.getEntitesInQueue().size();
        }

        for(ConsumerGroup consumerGroup : simulation.getConsumerGroups()) {

            entitiesInQueue += consumerGroup.getEntitesInQueue().size();
        }

        return entitiesInQueue;
    }

}
