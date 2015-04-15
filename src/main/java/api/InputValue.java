package api;

/**
 * The values used by the API to persist the simulation
 */
class InputValue {

    // Simulation
    public String name;
    public int startTick;
    public int ticks;

    // Consumers (single)
    public int[] ticksToConsumeEntitiesList;

    // Consumer-Groups
    public String[] consumerGroupNames;
    public int[] numberOfConsumersInGroups;
    public int[] ticksToConsumeEntitiesGroups;

    // Proucers
    public int[] timetableIds;

    public int[] totalNumberOfEntititesList;
    public int[] timeBetweenArrivalsList;
    public int[] numberOfEntitiesList;

}
