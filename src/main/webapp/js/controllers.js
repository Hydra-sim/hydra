(function() {

    'use strict';

    var app = angular.module('unit.controllers', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'ngFileUpload',
        'zeroclipboard',
        'angular-loading-bar',
        'ngAnimate'
    ]);

    app.controller('ApplicationCtrl', function($scope, $rootScope, menu_field_name, menu_field_button) {
        $scope.menu_field_button = menu_field_button;
        $scope.menu_field_name = menu_field_name;
        menu_field_name.disable();

        $rootScope.simulationAuth = [];

        $scope.closeWindow = function( $event ) {

            var $this = $event.target;

            var $ancestorWindow = findAncestor( $this, 'window' );
            if ( $ancestorWindow ) {
                addClass( $ancestorWindow, 'hidden' );
            }

            addClass( document.querySelector( '.js-overlay' ), 'hidden' );
        };

        $scope.openNextWindow = function( $event ){

            var $this = $event.target;

            var $ancestorWindow = findAncestor( $this, 'window' );
            if ( $ancestorWindow !== null ) {
                addClass( $ancestorWindow, 'hidden' );
            }

            var $ancestorBox = findAncestor( $this, 'box' );
            if ( $ancestorBox !== null ) {
                removeClass( $ancestorBox, 'active-section' );
            }

            var $next = $this.dataset.nextWindow ? document.querySelector( $this.dataset.nextWindow ) : null;
            if ( $next !== null ) {
                removeClass( $next, 'hidden' );
                addClass( findAncestor( $next, 'box' ), 'active-section' );
            }

            var $overlay = document.querySelector( '.js-overlay' );
            if ( $overlay !== null ) {
                if ( !$this.dataset.nextWindow ) {
                    addClass( $overlay, 'hidden' );
                } else {
                    removeClass( $overlay, 'hidden' );
                }
            }

            return false;
        };

        function hasClass( ele, cls ) {
            return !!ele.className.match( new RegExp( '(\\s|^)' + cls + '(\\s|$)' ) );
        }

        function addClass( ele, cls ) {
            if ( !hasClass( ele, cls ) ) ele.className += " " + cls;
        }

        function removeClass( ele, cls ) {
            if ( hasClass( ele, cls ) ) {
                var reg = new RegExp( '(\\s|^)' + cls + '(\\s|$)' );
                ele.className = ele.className.replace( reg, ' ' );
            }
        }

        function findAncestor( el, cls ) {
            while ( (el = el.parentElement) && !el.classList.contains( cls ) );
            return el;
        }
    });

    app.controller('HomeCtrl', function($scope, menu_field_button, menu_field_name, $modal){
        menu_field_button.reset();
        menu_field_name.disable();
    });

    app.controller("TabCtrl", function($scope, $rootScope, $location) {

        $scope.tabs = [
            {name: 'HOME', link: "/"},
            {name: "SIMULATIONS", link: "/simulation", nextWindow: '#timetables-window', description: 'View and manage all previous simulation or create a new one.'},
            {name: "TIMETABLES", link: "/timetable", nextWindow: '#locations-window', description: 'View and manage timetables or create a new one that suits your location.'},
            {name: "LOCATIONS", link: "/preset", nextWindow: "#help-window", description: 'See and manage all saved locations or create a new one that can easily be reused. '}
        ];

        $scope.select= function(item) {
            $location.path(item.link);
            $location.replace();
            var overlay = angular.element(document.getElementsByClassName("overlay"));
            overlay.addClass("hidden");
        };

        $scope.itemClass = function(item) {
            return item.link == $location.path() ? 'active' : '';
        };
    });

    app.controller("CollapseCtrl", function($scope, $window){

        $scope.isCollapsed = true;

        $scope.openFullDoc = function (){
            $window.open("#/documentation", "_blank");
        };

    });

    app.controller('FullDocumentationCtrl', function($scope, $location, $anchorScroll, menu_field_button){
        menu_field_button.reset();

        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };
    });

    app.controller('ColorTestCtrl', function($scope){
        $scope.testcolor = 2;

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

        $scope.colorFromValue = function(val){
            if(val > 100){
                val = 100;
            }
            var h = Math.floor((100 - val) * 120 / 100);
            var s = Math.abs(val - 50) / 50;

            return hsv2rgb(h, s, 1);
        }
    });
})();