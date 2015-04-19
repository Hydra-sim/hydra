(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('NewConsumerInstanceCtrl', function($scope, $modalInstance, $log, ticksToConsumeEntitiesList, type){

        $scope.ticksToConsumeEntitiesList = ticksToConsumeEntitiesList;
        $scope.modalTitle = type;
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitConsumer = function(amountOfTime, timeSelectConsumer){

            $log.info(amountOfTime);
            $log.info(timeSelectConsumer.item.label);

            var ticksToConsumeEntities = amountOfTime; // Seconds by default


            if(timeSelectConsumer.item.label == "Minutes") { // Minutes

                ticksToConsumeEntities *= 60;

            } else if(timeSelectConsumer.item.label == "Hours") { // Hours

                ticksToConsumeEntities *= 60 * 60;
            }


            $scope.ticksToConsumeEntitiesList.push(ticksToConsumeEntities);

            $modalInstance.close();
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('NewProducerInstanceCtrl', function($scope, $modalInstance, Timetable, timetableIds, $log, type){

        $scope.timetableIds = timetableIds;
        $scope.modalTitle = type;

        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $scope.submitProducer = function(selectedItem){

            /*Lage funksjon som finner og returnerer aktiv tidstabell id så pushe den inn i $scope.timetableIds liste*/

            $log.info(selectedItem);
            timetableIds.push(selectedItem);


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });

    app.controller("NewPassengerflowInstanceCtrl", function($scope, $modal, $modalInstance, $log, totalNumberOfEntititesList, numberOfEntitiesList, timeBetweenArrivalsList){
        $scope.totalNumberOfEntititesList = totalNumberOfEntititesList;
        $scope.numberOfEntitiesList = numberOfEntitiesList;
        $scope.timeBetweenArrivalsList = timeBetweenArrivalsList;

        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitPassengerflow =  function(totalNumberOfEntities, numberOfEntities, timeBetweenArrivals , timeSelect){


            $scope.totalNumberOfEntititesList.push(totalNumberOfEntities);
            $scope.numberOfEntitiesList.push(numberOfEntities);



            if(timeSelect.item.label == "Minutes"){
                timeBetweenArrivals *= 60;
            }
            else if(timeSelect.item.label == "Hours"){
                timeBetweenArrivals *= 60 * 60;
            }

            $scope.timeBetweenArrivalsList.push(timeBetweenArrivals);

            $modalInstance.close();
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

    });

    app.controller('ChoosePresetInstanceCtrl', function($scope, $modalInstance){
        $scope.loadPreset = function(preset){

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ConsumerGroupInstanceCtrl', function($scope, $modalInstance, consumerGroupNames, numberOfConsumersInGroups,
                                                ticksToConsumeEntitiesGroups) {

        $scope.consumerGroupNames = consumerGroupNames;
        $scope.numberOfConsumersInGroups = numberOfConsumersInGroups;
        $scope.ticksToConsumeEntitiesGroups = ticksToConsumeEntitiesGroups;

        $scope.submitConsumerGroup = function(consumerGroupName, numberOfConsumersInGroup, ticksToConsumeEntitiesGroup){
            consumerGroupNames.push( consumerGroupName );
            numberOfConsumersInGroups.push( numberOfConsumersInGroup );
            ticksToConsumeEntitiesGroups.push( ticksToConsumeEntitiesGroup );
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
    app.controller('ConfigModalInstanceCtrl', function ($scope, $modalInstance, startTime, endTime) {

        $scope.startTime = startTime;
        $scope.endTime = endTime;

        $scope.submitConfig = function () {
            var time = {startTime: $scope.startTime, endTime: $scope.endTime};

            $modalInstance.close(time);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('SimulationEditCtrl', function ($log, $scope, $routeParams, $rootScope, $location, Simulation, SimResult, menu_field_name) {

        Simulation.get({}, {"id": $routeParams.id}, function(result) {
            $scope.id = result.id;

            menu_field_name.setValue(result.name);

            $scope.ticks = result.ticks;

            $scope.ticksToConsumeEntitiesList = [];

            for(var i = 0; i < result.consumers.length; i++) {
                $scope.ticksToConsumeEntitiesList.push (result.consumers[i].ticksToConsumeEntities);
            }

            $scope.timetableIds = [];

            for(var i = 0; i < result.producers.length; i++) {
                $scope.timetableIds.push(result.producers[i].timetable.id);
            }
        });

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,

                'ticksToConsumeEntitiesList' : $scope.ticksToConsumeEntitiesList,
                'timetableIds' : $scope.timetableIds
            });

            sim.$save().then(function(result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };
    });

    app.controller('SimulationResultCtrl', function($scope, $rootScope, SimResult) {
        $scope.producerTooltip =  'Next arrival: 14:20 \n Passengers: 40 \n Persons delivered: 120 \n Persons remaining: 0';
        $scope.consumerTooltip = "Number in line: 10 \n Longest waiting time: 40 seconds";
        $scope.parkingTooltip = "Number arrived: 6";

        $scope.entitiesConsumed         = SimResult.data.entitiesConsumed;
        $scope.entitiesInQueue          = SimResult.data.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = SimResult.data.maxWaitingTimeInTicks;

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

    app.controller('SimulationShowCtrl', function($scope, $rootScope, $routeParams, Simulation) {
        Simulation.get({}, {"id": $routeParams.id}, function(data) {
            console.log(data);

            $scope.entitiesConsumed         = data.result.entitiesConsumed;
            $scope.entitiesInQueue          = data.result.entitiesInQueue;
            $scope.maxWaitingTimeInTicks    = data.result.maxWaitingTimeInTicks;
        });

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

})();