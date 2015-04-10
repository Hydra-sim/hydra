(function() {

    'use strict';

    var app = angular.module('simulation', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);

    app.controller("RadialMenuController", function () {

        var circularMenu = document.querySelector('.circular-menu');
        var openBtn = document.querySelector('.menu-button');
        var outerCircle = document.querySelector('.outer-circle');
        var items = document.querySelectorAll('.outer-circle .circle');


        for (var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
        }

        document.querySelector('.graph').oncontextmenu = function (e) {
            e.preventDefault();

            outerCircle.classList.add('open');
            var xPosition = e.clientX - (circularMenu.clientWidth / 2);
            var yPosition = e.clientY - (circularMenu.clientHeight / 2);

            circularMenu.style.left = xPosition + "px";
            circularMenu.style.top = yPosition + "px";
            circularMenu.style.visibility = "visible";
            openBtn.style.display = "block";
        }

        openBtn.onclick = function (e) {
            e.preventDefault();
            document.querySelector('.outer-circle').classList.remove('open');
            openBtn.style.display = "none";
            circularMenu.style.visibility = "hidden";
        }

        document.querySelector('.graph').onclick = function (e) {
            e.preventDefault();
            document.querySelector('.outer-circle').classList.remove('open');
            openBtn.style.display = "none";
            circularMenu.style.visibility = "hidden";
        }

    });

})();