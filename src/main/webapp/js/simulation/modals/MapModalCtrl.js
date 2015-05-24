(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('MapModalCtrl', function($scope, $modalInstance, $timeout) {
        var ctrl = this;

        this.zoom = 1;

        this.cancel = $modalInstance.dismiss;
        this.submitMap = function() {

            // Read the file and initialize a tmp Image to get the width and height of the image
            var fileReader = new FileReader();
            fileReader.readAsDataURL(ctrl.file[0]);
            fileReader.onload = function(e) {
                $timeout(function () {
                    // Create the tmp image
                    var img = new Image();
                    img.onload = function(){
                        // Close the modal with the width and height as data
                        close(img.width, img.height);
                    };
                    img.src = e.target.result;
                });
            };

            function close(width, height) {
                $modalInstance.close({
                    file: ctrl.file[0],
                    zoom: ctrl.zoom,
                    width: width,
                    height: height
                });
            }
        };

        // When the number changes, update the transform string
        $scope.$watch(
            function() { return ctrl.zoom; },
            function(value) { ctrl.scale = (value / 50) + 1;}
        );

    });

})();