(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationEditCtrl', function ($scope, $routeParams, $rootScope, $location, $modal, Simulation, SimResult, menu_field_name, menu_field_button) {

        $scope.dataset = { nodes: [], edges: [] };

        $scope.control = {};
        $scope.addData = addData;

        //Default values
        $scope.startTime = new Date();
        $scope.endTime = new Date();

        $scope.updateTicks = function() {

            $scope.startTick = ($scope.startTime.getHours() * 60  * 60) + ($scope.startTime.getMinutes() * 60);
            $scope.ticks = ($scope.endTime.getHours() * 60 * 60) + ($scope.endTime.getMinutes() * 60) - $scope.startTick;
        };

        $scope.updateTime = function(result) {

            var hours = result.startTick / 60 / 60;
            $scope.startTime.setHours(hours);

            var minutes = (result.startTick - (hours * 60 * 60)) / 60;
            $scope.startTime.setMinutes(minutes);

            var hours = (result.startTick + result.ticks) / 60 / 60;
            $scope.endTime.setHours(hours);

            var minutes = ((result.startTick + result.ticks) - (hours * 60 * 60)) / 60;
            $scope.endTime.setMinutes(minutes);
        };

        function addData(data, type) {

            var pos = $scope.control.getlastpos();
            $scope.control.addNode(type || "consumer", pos.x, pos.y, data);
        }

        $scope.submit = function() {

            $scope.updateTicks();

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'startTick':                        $scope.startTick,
                'nodes':                            $scope.dataset.nodes,
                'edges':                            $scope.dataset.edges
            });

            $modal.open({

                templateUrl: 'templates/modals/saveAs.html',
                controller: 'SaveAsModalCtrl',
                size: 'sm',
                resolve: {
                    simulationName: function(){
                        return menu_field_name.value;
                    }
                }

            }).result.then(function(data) {

                console.log(data);
                SimResult.data = sim.$save();
                $location.path('/result');
                $location.replace();
            });
        };

        menu_field_button.value = "Submit";
        menu_field_button.icon = "fa-arrow-circle-right";
        menu_field_button.click = function () {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,
                'ticksToConsumeEntitiesList': $scope.ticksToConsumeEntitiesList,
                'timetableIds': $scope.timetableIds
            });

            sim.$save().then(function (result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };

        Simulation.get({}, {"id": $routeParams.id}, function (result) {

            var simAuth = false;

            console.log(result);

            for(var i = 0; i < $rootScope.simulationAuth.length; i++) {

                if($rootScope.simulationAuth[i] == $routeParams.id) simAuth = true;
            }

            if(result.passwordProtected && !simAuth) {

                $location.path("simulation/" + $routeParams.id + "/auth")

            } else {

                menu_field_name.setValue(result.name);
                $scope.id = result.id;

                $scope.ticks = result.ticks;
                $scope.startTick = result.startTick;
                $scope.dataset.nodes = result.nodes;
                $scope.dataset.edges = result.relationships;

                $scope.updateTime(result);

                for(var node in $scope.dataset.nodes) {

                    addData(node, node.type);
                }
            }
        });

        $scope.debug = function() {
            console.log("dataset: ", $scope.dataset);
        };

        $scope.newProducer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newProducer.html',
                controller: 'NewProducerModalCtrl',
                size: 'sm',
                resolve: {
                    timetableIds: function () {
                        return $scope.timetableIds;
                    },
                    type: function () {
                        return title;
                    }
                }
            }).result.then(function(data) {
                    addData(data, type)
                });
        };

        $scope.newConsumer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newConsumer.html',
                controller: 'NewConsumerModalCtrl',
                size: 'sm',
                resolve: {
                    type: function(){
                        return title;
                    }
                }
            }).result.then(function(data) {

                    if(data.hasOwnProperty('numberOfConsumers')) {

                        type = 'consumerGroup-' + type;

                    }

                    addData(data, type)
                });
        };

        $scope.newPassengerflow = function(){
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowModalCtrl',
                size: 'sm'
            }).result.then(function(data) {
                    addData(data, 'passengerflow');
                });
        };

        $scope.openConfigModal = function() {

            var configModal = $modal.open({
                templateUrl: 'templates/modals/configModal.html',
                controller: 'ConfigModalModalCtrl',
                size: 'sm',
                resolve: {
                    startTime: function() {
                        return $scope.startTime;
                    },
                    endTime: function() {
                        return $scope.endTime;
                    }
                }
            });

            configModal.result.then(function (time) {
                $scope.startTime = time.startTime;
                $scope.endTime = time.endTime;
                $scope.updateTicks();
            });
        };
    });

    app.controller('SimulationResultCtrl', function($scope, $rootScope, $filter, SimResult, cfpLoadingBar, menu_field_name, menu_field_button) {

        $scope.simulation = {
            nodes: [],
            relationships: []
        };
        $scope.loaded = false;

        menu_field_name.readonly = true;

        cfpLoadingBar.start();

        SimResult.data.then(function(result) {

            $scope.simulation = result;
            console.log(result);

            // Close the loading bar
            cfpLoadingBar.complete();
            $scope.loaded = true;

            var from  = ticksToTime($scope.simulation.startTick);
            var to = ticksToTime($scope.simulation.startTick + $scope.simulation.ticks);

            var fromHours = parseInt(from);
            var fromMinutes = Number( ( ( parseFloat( from ) % fromHours ) * 60 ).toFixed(2) );
            $scope.from = new Date();
            $scope.from.setHours( fromHours );
            $scope.from.setMinutes( fromMinutes );
            $scope.from.setSeconds(0);
            $scope.fromPrint = $filter('date')($scope.from, "HH:mm");

            var toHours = parseInt(to);
            var toMinutes = Number( ( ( parseFloat( to ) % toHours ) * 60 ).toFixed(2) );
            $scope.to = new Date();
            $scope.to.setHours( toHours );
            $scope.to.setMinutes( toMinutes );
            $scope.to.setSeconds(0);
            $scope.toPrint = $filter('date')($scope.to, "HH:mm");

            $scope.maxWaitingTimeInMinutes = $scope.simulation.result.maxWaitingTimeInTicks / 60;

            $scope.entitiesConsumed = $scope.simulation.result.entitiesConsumed;
            $scope.entitiesInQueue = $scope.simulation.result.entitiesInQueue;

        });

        //Function for ticks to seconds/minutes/hours
        function ticksToTime(ticks){
            if(ticks == 3600)   return "1 hour";
            if(ticks == 60)     return "1 minute";
            if(ticks == 1)      return "1 second";

            if(ticks > 3600)    return (ticks/3600).toFixed(2) + " hours";
            if(ticks > 60)      return (ticks/60).toFixed(2) + " minutes";
            if(ticks > 1)       return ticks + " seconds";
        }

        // Tooltip for resultpage
        $scope.extraTooltip = function() {

            return d3.behavior
                .tooltip()
                .text(function(d) {
                    switch (d.type) {
                        case "bus":
                        case "train":
                            return d.timetable.name + "<br/>" +
                                "Brought " + d.entitiesTransfered + " passengers to the location." + "<br/>" +
                                "Number of arrivals: " + d.numberOfArrivals + "<br/>" +
                                "Number of buses in queue: " + d.numberOfBusesInQueue;
                        //TODO: Legge number of buses in queue bare på buss


                        case "passengerflow":
                            return "Persons per arrival: " + d.personsPerArrival + "<br/>" +
                                "Time between arrivals: " + ticksToTime(d.timeBetweenArrivals) + "<br/>" +
                                "Brought " + d.entitiesTransfered + " passengers to the location.";


                        case "parking":
                            console.log("d:" + d);
                            return "Buses handled every " + ticksToTime(d.ticksToConsumeEntity) + "<br/>" +
                                "Brought " + d.entitiesTransfered + " passengeres to the location.";

                        case "desktop":
                        case "door":
                        case "suitcase":
                            return "Passengers handled every " + ticksToTime(d.ticksToConsumeEntity) + "<br/>" +
                                "Passengers in queue at simulation end: " + d.entitiesInQueue.length + "<br/>" +
                                "Passengers that went through: " + d.entitiesConsumed.length + "<br/>" +
                                "Max waiting time: " + ticksToTime(d.maxWaitingTime);

                        default:
                            console.log(d);
                            return d.weight + "%";

                    }
                });
        };


        $scope.extraBorder = function() {

            function hsv2rgb(h, s, v) {
                // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
                var rgb, i, data = [];
                if (s === 0) {
                    rgb = [v,v,v];
                } else {
                    h = h / 60;
                    i = Math.floor(h);
                    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
                    switch(i) {
                        case 0:
                            rgb = [v, data[2], data[0]];
                            break;
                        case 1:
                            rgb = [data[1], v, data[0]];
                            break;
                        case 2:
                            rgb = [data[0], v, data[2]];
                            break;
                        case 3:
                            rgb = [data[0], data[1], v];
                            break;
                        case 4:
                            rgb = [data[2], data[0], v];
                            break;
                        default:
                            rgb = [v, data[0], data[1]];
                            break;
                    }
                }
                return '#' + rgb.map(function(x){
                        return ("0" + Math.round(x*255).toString(16)).slice(-2);
                    }).join('');
            }

            return d3.behavior.border()
                .color(function (d) {
                    if(typeof d.entitiesInQueue !== "undefined") {
                        var val = d.entitiesInQueue.length;
                        var h = Math.floor((100 - val) * 120 / 100);
                        var s = Math.abs(val - 50) / 50;

                        return hsv2rgb(h, s, 1);
                    }
                })
                .width(function (d) {
                    return "5px";
                });
        };


        menu_field_button.reset();
    });

    app.controller('SimulationShowCtrl', function($scope, menu_field_button, $routeParams, SimResult) {

        var data = SimResult.data;

        $scope.entitiesConsumed         = data.result.entitiesConsumed;
        $scope.entitiesInQueue          = data.result.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = data.result.maxWaitingTimeInTicks;

        menu_field_button.reset();
    });

    app.controller('SimulationListCtrl', function ($scope, $rootScope, $log, Simulation, $location, $modal) {

        function updateSimulations() {
            $scope.simulations = Simulation.query({});
        }

        updateSimulations();

        $scope.auth = function (id, funcDesc) {

            Simulation.get({}, {'id': id}, function (result) {

                var func;

                switch (funcDesc) {
                    case 'edit':
                        func = $scope.editSimulation;
                        break;
                    case 'delete':
                        func = $scope.deleteSimulation;
                        break;
                    case 'show':
                        func = $scope.showSimulation;
                        break;
                    case 'setPassword':
                        func = $scope.setPassword;
                        break;
                    default:
                        func = null;
                }

                if (result.passwordProtected) {              // It really does find it

                    $modal.open({
                        templateUrl: 'templates/modals/passwordAuth.html',
                        controller: 'PasswordModalCtrl',
                        size: 'sm',
                        resolve: {
                            id: function () {
                                return id;
                            },
                            func: function () {
                                return func;
                            }
                        }
                    });

                } else {

                    func(id);
                }
            });
        };

        $scope.deleteSimulation = function (id) {

            var modalInstance = $scope.confirmation();

            modalInstance.result.then(function (selectedItem) {
                Simulation.delete({}, {"id": id}, function () {
                    $scope.simulations = Simulation.query({});
                });
            });
        };

        $scope.confirmation = function() {

            $scope.confirmed = false;

            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/confirmation.html',
                controller: 'ConfirmationModalCtrl',
                size: 'sm'
            });

            return modalInstance;
        };

        $scope.editSimulation = function (id) {

            $location.path('/simulation/' + id);

        };

        $scope.shareSimulation = function (id) {



            $modal.open({
                templateUrl: 'templates/modals/shareSimulation.html',
                controller: 'ShareSimulationModalCtrl',
                size: 'sm',
                resolve: {
                    id: function () {
                        return id;
                    },
                    message: function(){
                        return  $location.absUrl() + 'simulation/' + id;
                    }
                }
            });

        };

        $scope.showSimulation = function (id) {

            $location.path('/show/' + id);
        };

        $scope.setPassword = function (id) {

            Simulation.get({}, {'id': id}, function (result) {

                var path;

                if (result.passwordProtected) {              // It really does find it

                    path = 'templates/modals/changePassword.html';

                } else {

                    path = 'templates/modals/newPassword.html';
                }

                $modal.open({
                    templateUrl: path,
                    controller: 'ChangePasswordCtrl',
                    size: 'sm',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
            });
        };
    });

    app.controller('SimulationNewCtrl', function ($scope, $location, $rootScope, $modal, SimResult, Simulation, menu_field_name, Timetable, menu_field_button) {

        $scope.updateTicks = function() {
            $scope.startTick = ($scope.startTime.getHours() * 60  * 60) + ($scope.startTime.getMinutes() * 60);
            $scope.ticks = ($scope.endTime.getHours() * 60 * 60) + ($scope.endTime.getMinutes() * 60) - $scope.startTick;
        };

        menu_field_name.readonly = false;

        //Default values
        $scope.startTime = new Date();
        $scope.startTime.setHours(6);
        $scope.startTime.setMinutes(0);

        $scope.endTime = new Date();
        $scope.endTime.setHours(8);
        $scope.endTime.setMinutes(0);

        $scope.breakpoints = 900; // Every 15 minutes

        $scope.updateTicks();

        //Function for ticks to seconds/minutes/hours
        function ticksToTime(ticks){
            if(ticks == 3600)   return "1 hour";
            if(ticks == 60)     return "1 minute";
            if(ticks == 1)      return "1 second";

            if(ticks > 3600)    return ticks/3600 + " hours";
            if(ticks > 60)      return ticks/60 + " minutes";
            if(ticks > 1)       return ticks + " seconds";
        }

        // Tooltip
        $scope.extraTooltip = function() {
            var timetable = Timetable.query({});

            return d3.behavior
                .tooltip()
                .text(function(d) {
                    if(d.type == "bus" || d.type == "train") {
                        return _.find(timetable, function(t) { return t.id == d.timetableId; }).name;
                    } else if(d.type == "passengerflow"){
                        return "Persons per arrival: " + d.personsPerArrival + "<br/>" +
                            " Time between arrivals: " + ticksToTime(d.timeBetweenArrivals);
                    } else if(d.type == "parking") {
                        return "Buses handled every " + ticksToTime(d.ticksToConsumeEntity);
                    } else if(d.type == "desktop" || d.type == "door" || d.type == "suitcase") {
                        var printForConsumer =  "Passengers handled every " + ticksToTime(d.ticksToConsumeEntity);
                        if(d.type.indexOf("consumerGroup") != -1) {
                            printForConsumer += "<br/>" + "Quantity: " + d.numberOfConsumers;
                        }
                        return printForConsumer;
                    } else {
                        return "Test";
                    }
                });
        };

        // For dropdown in add consumer/passengerflow
        $scope.options = [];

        menu_field_name.setValue("Untitled simulation");

        menu_field_button.value = "Submit";
        menu_field_button.icon = "fa-arrow-circle-right";
        menu_field_button.click = submit;
        $scope.submit = submit;
        function submit() {

            $scope.debug();
            $scope.updateTicks();

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'startTick':                        $scope.startTick,
                'nodes':                            $scope.dataset.nodes,
                'edges':                            $scope.dataset.edges,
                'breakpoints':                      $scope.breakpoints
            });

            SimResult.data = sim.$save();
            $location.path('/result');
            $location.replace();
        }

        $scope.dataset = { nodes: [], edges: [] };

        $scope.control = {};
        $scope.addData = addData;
        function addData(data, type) {
            var pos = $scope.control.getlastpos();
            $scope.control.addNode(type || "consumer", pos.x, pos.y, data);
        }

        $scope.debug = function() {
            console.log("dataset: ", $scope.dataset);
        };

        $scope.newProducer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newProducer.html',
                controller: 'NewProducerModalCtrl',
                size: 'sm',
                resolve: {
                    timetableIds: function () {
                        return $scope.timetableIds;
                    },
                    type: function () {
                        return title;
                    }
                }
            }).result.then(function(data) {
                addData(data, type)
            });
        };

        $scope.newConsumer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newConsumer.html',
                controller: 'NewConsumerModalCtrl',
                size: 'sm',
                resolve: {
                    type: function(){
                        return title;
                    }
                }
            }).result.then(function(data) {

                if(data.hasOwnProperty('numberOfConsumers')) {

                    type = 'consumerGroup-' + type;

                }

                addData(data, type)
            });
        };

        $scope.newPassengerflow = function(){
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowModalCtrl',
                size: 'sm'
            }).result.then(function(data) {
                addData(data, 'passengerflow');
            });
        };

        $scope.openConfigModal = function() {

            var configModal = $modal.open({
                templateUrl: 'templates/modals/configModal.html',
                controller: 'ConfigModalModalCtrl',
                size: 'sm',
                resolve: {
                    startTime: function() {
                        return $scope.startTime;
                    },
                    endTime: function() {
                        return $scope.endTime;
                    }
                }
            });

            configModal.result.then(function (time) {
                $scope.startTime = time.startTime;
                $scope.endTime = time.endTime;
                $scope.updateTicks();
            });
        };

    });

    app.controller('ChangePasswordCtrl', function( $scope, $modalInstance, $rootScope, $location, id, Simulation ) {


        $scope.passwordMismatch = false;

        $scope.submitPassword = function( password, repPassword ) {

            if(password == repPassword) {

                var sim = new Simulation({
                    'id':    id,
                    'input': password
                });

                Simulation.update({}, sim).$promise.then(function() {
                    $rootScope.$emit('updateSimulations');
                    $location.path('/#');
                });

                $modalInstance.close();

            } else {

                $scope.passwordMismatch = true;
            }

        };

        $scope.deletePassword = function () {

            $scope.submitPassword(null);
        };

        $scope.cancel = function(){
            $modalInstance.dismiss();
        };
    });

    app.controller('SimulationProgressCtrl', function($scope, $log, $interval) {

        $scope.steps = 1;
        $scope.progress = {};
        $scope.progress.position = 0;

        var intervalPromise;

        $scope.forward = function() {

            $interval.cancel(intervalPromise);
            $scope.changeTime(1);
        };

        $scope.backward = function() {

            $interval.cancel(intervalPromise);
            $scope.changeTime(-1);
        };

        $scope.pause = function() {

            $interval.cancel(intervalPromise);
        };

        $scope.changeTime = function(value) {

            intervalPromise = $interval(function () {

                if($scope.progress.position >= 0 && $scope.progress.position <= 100) $scope.progress.position += value;
                $log.info($scope.progress.position);

            }, 100); // Milliseconds, iterations
        }
    });

    app.controller('ShareSimulationModalCtrl', function($scope, $modalInstance, $location, $log, id, message){

        $scope.id = id;
        $scope.message = message;

        $scope.copySimulation = function(){

            $scope.complete = function(e) {
                $scope.copied = true
            };
            $scope.$watch('input', function(v) {
                $scope.copied = false
            });
            $scope.clipError = function(e) {
                console.log('Error: ' + e.name + ' - ' + e.message);
            };

            $modalInstance.close();
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('close');
        }
    });

    app.controller('NewConsumerModalCtrl', function($scope, $modalInstance, type){

        $scope.groupable = !!(type.toLowerCase() == 'new bagdrop' || type.toLowerCase() == 'new terminal');

        $scope.modalTitle = type;
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitConsumer = function(amountOfTime, timeSelectConsumer, numberOfConsumers){

            var ticksToConsumeEntities = amountOfTime; // Seconds by default

            switch(timeSelectConsumer.item.label) {

                case "Minutes":
                    ticksToConsumeEntities *= 60;
                    break;

                case "Hours":
                    ticksToConsumeEntities *= 60 * 60;
                    break;
            }

            if($scope.group) {

                $modalInstance.close({

                    'ticksToConsumeEntity': ticksToConsumeEntities,
                    'numberOfConsumers': numberOfConsumers
                });

            } else {

                $modalInstance.close({

                    'ticksToConsumeEntity': ticksToConsumeEntities
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('NewProducerModalCtrl', function($scope, $modalInstance, Timetable, timetableIds, type){
        $scope.timetableIds = timetableIds;
        $scope.modalTitle = type;
        $scope.timetables = Timetable.query({});

        $scope.submitProducer = function(selectedItem){
            $modalInstance.close({
                'timetableId': selectedItem
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller("NewPassengerflowModalCtrl", function($scope, $modal, $modalInstance){
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitPassengerflow =  function(totalNumberOfEntities, numberOfEntities, timeBetweenArrivals , timeSelect){
            if(timeSelect.item.label == "Minutes"){
                timeBetweenArrivals *= 60;
            }
            else if(timeSelect.item.label == "Hours"){
                timeBetweenArrivals *= 60 * 60;
            }

            $modalInstance.close({
                'timeBetweenArrivals': timeBetweenArrivals,
                'personsPerArrival': numberOfEntities
            });
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

    });

    app.controller('ConfigModalModalCtrl', function ($scope, $modalInstance, startTime, endTime) {

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

    app.controller('PasswordModalCtrl', function($scope, $rootScope, $modalInstance, id, func, Authentication) {

        $scope.id = id;

        $scope.wrongPassword = false;

        $scope.submitPassword = function(input){

            var auth = new Authentication({
                'id':    id,
                'input': input
            });

            auth.$save().then(function(result) {

                if(result.truefalse) {

                    func(id);
                    $modalInstance.close();
                    $rootScope.simulationAuth.push(id);

                } else {

                    $scope.wrongPassword = true;
                }
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ConfirmationModalCtrl', function($scope, $modalInstance) {

        $scope.confirm = function(){

            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss();
        }
    });

    app.controller('AuthPathCtrl', function($scope, $rootScope, $routeParams, $location, Authentication, menu_field_name, menu_field_button) {

        $scope.id = $routeParams.id;

        $scope.wrongPassword = false;

        $scope.submitPassword = function(input) {

            var auth = new Authentication({
                'id': $routeParams.id,
                'input': input
            });

            auth.$save().then(function (result) {

                if (result.truefalse) {

                    $rootScope.simulationAuth.push($routeParams.id);
                    $location.path('/simulation/' + $routeParams.id);

                } else {

                    $scope.wrongPassword = true;
                    $rootScope.simulationAuth.push($routeParams.id);
                }
            });
        };

        menu_field_name.setValue("");
        menu_field_name.disable();

        menu_field_button.reset();
    });

    app.controller('SaveAsModalCtrl', function($scope, $modalInstance, simulationName, menu_field_name){

        $scope.simulationName = simulationName;

        $scope.saveAs = function() {

            menu_field_name.setValue($scope.simulationName);
            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss();
        };
    });

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button) {
        this.simulationId = $routeParams.id;
        menu_field_button.reset();
    });
})();