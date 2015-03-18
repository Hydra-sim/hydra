--INSERT INTO SimulationResult (id, entitiesConsumed, entitiesInQueue, maxWaitingTimeInTicks) VALUES (1001, 1, 2, 3);
--INSERT INTO Simulation (id, date, name, preset, ticks, result_id) VALUES (2001, null, 'Test', TRUE, 10, 1001);


insert into Timetable (name, id) values ('Test', 0);
insert into TimetableEntry (passengers, time, id) values (10, 10, 0);
insert into TimetableEntry (passengers, time, id) values (10, 20, 1);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (0, 0);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (0, 1);

insert into Timetable (name, id) values ('Test Ipsum', 1);
insert into TimetableEntry (passengers, time, id) values (10, 12, 2);
insert into TimetableEntry (passengers, time, id) values (100, 21, 3);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (1, 2);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (1, 3);

insert into Timetable (name, id) values ('Test Lorem', 2);
insert into TimetableEntry (passengers, time, id) values (10, 14, 4);
insert into TimetableEntry (passengers, time, id) values (1000, 22, 5);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (2, 4);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (2, 5);

insert into Timetable (name, id) values ('Test Noe Annet', 3);
insert into TimetableEntry (passengers, time, id) values (10, 16, 6);
insert into TimetableEntry (passengers, time, id) values (10000, 23, 7);
insert into TimetableEntry (passengers, time, id) values (10, 18, 8);
insert into TimetableEntry (passengers, time, id) values (10000, 24, 9);
insert into TimetableEntry (passengers, time, id) values (10, 25, 10);
insert into TimetableEntry (passengers, time, id) values (10000, 26, 11);
insert into TimetableEntry (passengers, time, id) values (10, 27, 12);
insert into TimetableEntry (passengers, time, id) values (10000, 28, 13);
insert into TimetableEntry (passengers, time, id) values (10, 29, 14);
insert into TimetableEntry (passengers, time, id) values (10000, 31, 15);
insert into TimetableEntry (passengers, time, id) values (10, 32, 16);
insert into TimetableEntry (passengers, time, id) values (10000, 33, 17);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 6);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 7);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 8);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 9);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 10);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 11);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 12);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 13);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 14);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 15);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 16);
insert into Timetable_TimetableEntry (Timetable_id, arrivals_id) values (3, 17);