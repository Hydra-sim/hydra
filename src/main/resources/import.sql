INSERT INTO SimulationResult (id, entitiesConsumed, entitiesInQueue, maxWaitingTimeInTicks) VALUES (1001, 1, 2, 3);
INSERT INTO Simulation (id, date, name, preset, ticks, result_id) VALUES (2001, null, 'Test', TRUE, 10, 1001);
