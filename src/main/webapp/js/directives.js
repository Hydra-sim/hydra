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
            template:   "<div class='pull-right menu-field-button' ng-click='menu_field_button_click()'><span class='hidden-xs'>{{menu_field_button}} </span><span class='fa {{menu_field_button_icon}}'></span> </div>"
        };
    });

    app.directive('menuFieldName', function(){
       return{
           restrict: 'E',
           template: "<input type='textbox' ng-model='menu_field_name.value' ng-class='{disabled: menu_field_name.enabled == false}' select-on-click/>"
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

})();