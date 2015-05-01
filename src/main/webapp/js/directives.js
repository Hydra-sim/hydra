(function() {

    'use strict';

    var app = angular.module('unit.directives', []);

    //Directive for selecting all on :focus
    //From: Martin - http://stackoverflow.com/questions/14995884/select-text-on-input-focus
    app.directive('selectOnClick', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    this.select();
                });
            }
        };
    });

})();