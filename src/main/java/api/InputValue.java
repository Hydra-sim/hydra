package api;

/**
 * The values used by the API to persist the simulation
 */
class InputValue {

    // TODO: Fix for format from frontend

    // Simulation
    public String name;
    public int startTick;
    public int ticks;

    // Consumers (single)
    public int[] ticksToConsumeEntitiesList;

    public String[] consumerTypes;

    // Consumer-Groups
    public String[] consumerGroupNames;
    public int[] numberOfConsumersInGroups;
    public int[] ticksToConsumeEntitiesGroups;

    public String[] consumerGroupTypes;

    // Proucers
    public int[] timetableIds;

    public int[] totalNumberOfEntititesList;
    public int[] timeBetweenArrivalsList;
    public int[] numberOfEntitiesList;

    public String[] producerType;

}
