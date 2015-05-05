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

    app.directive('menuFieldButton', function() {
        return{
            restrict: 'E',
            template:   "<div class='pull-right menu-field-button' ng-click='click()'><span class='hidden-xs'>{{value}} </span><span class='fa {{icon}}'></span> </div>",
            scope: {
                click: "&",
                icon: "=",
                value: "="
            }
        };
    });

    app.directive('menuFieldName', function(){
        return{
            restrict: 'E',
            template: "<input type='textbox' ng-model='value' ng-class='{disabled: enabled == false}' select-on-click/>",
            scope: {
                value: "=",
                enabled: "="
            },

            link: function(scope, element, attrs) {
                var inputfield = element[0].firstChild;

                attrs.$observe('readonly', function(test) {
                    inputfield.disabled = (test == "true");
                });
            }
        };
    });

    //Directive for autofocus on modals every time it opens
    // From: fakerun - http://stackoverflow.com/questions/28348342/how-to-set-focus-on-textarea-within-a-angular-ui-modal-every-time-open-the-modal
    app.directive('focusMe', function($timeout) {
        return {
            scope: { trigger: '@focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if(value === "true") {
                        $timeout(function() {
                            element[0].focus();
                        });
                    } else{
                        $timeout(function() {
                            element[0].blur();
                        });
                    }
                });
            }
        };
    });

    app.directive('ngEnter', function($document) {
        return {
            scope: {
                ngEnter: "&"
            },
            link: function(scope, element, attrs) {
                var enterWatcher = function(event) {
                    if (event.which === 13) {
                        scope.ngEnter();
                        scope.$apply();
                        event.preventDefault();
                        $document.unbind("keydown keypress", enterWatcher);
                    }
                };
                $document.bind("keydown keypress", enterWatcher);
            }
        }
    });
})();