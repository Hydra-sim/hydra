(function() {

    'use strict';

    var app = angular.module('unit.controllers', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'ngFileUpload',
        'zeroclipboard',
        'angular-loading-bar',
        'ngAnimate',
        'TicksToTimeFilter'
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

})();