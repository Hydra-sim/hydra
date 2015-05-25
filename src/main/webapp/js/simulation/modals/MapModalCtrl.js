(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('MapModalCtrl', function($scope, $modalInstance, $timeout) {
        var ctrl = this,
            imageCanvasWidth = 550;

        ctrl.zoom = 50;
        ctrl.size = {};

        ctrl.cancel = $modalInstance.dismiss;
        ctrl.submitMap = function() {
            $modalInstance.close({
                file: ctrl.file[0],
                zoom: ctrl.zoom,
                width: ctrl.size.width,
                height: ctrl.size.height
            });
        };

        $scope.$watch(
            function() { return ctrl.file; },
            function() {
                if(typeof ctrl.file != 'undefined' && typeof ctrl.file[0] != 'undefined') {
                    // Read the file and initialize a tmp Image to get the width and height of the image
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(ctrl.file[0]);
                    fileReader.onload = function(e) {
                        $timeout(function () {
                            // Create the tmp image
                            var img = new Image();
                            img.onload = function(){
                                ctrl.size.width = img.width;
                                ctrl.size.height = img.height;
                                updateScale();
                            };
                            img.src = e.target.result;
                        });
                    };
                }
            }
        );

        // When the number changes, update the transform string
        $scope.$watch(
            function() { return ctrl.zoom; },
            updateScale
        );

        function updateScale() {
            ctrl.scale = ctrl.size.width / imageCanvasWidth + ctrl.zoom / 50 - 0.5;
        }

    });

})();