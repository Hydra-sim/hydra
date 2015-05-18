(function() {

    'use strict';

    var app = angular.module('TicksToTimeFilter', []);

    app.filter('TicksToTime', function(TicksToTimeService) {
        return TicksToTimeService.ticksToTime;
    });

    app.filter('StandardTicksToTime', function(TicksToTimeService) {
        return TicksToTimeService.standardTicksToTime;
    });

    app.factory('TicksToTimeService', function() {
        function standardTicksToTime(ticks){
            var hh = Math.floor( ticks / 3600);
            var mm = Math.floor( (ticks % 3600) / 60);
            var ss = (ticks % 3600) % 60;

            var time = '';

            if(hh > 0) time = hh + " hour" + (hh>1? "s" :"");
            if(mm > 0) time += " " + mm + " minute" + (mm>1? "s" :"");
            if(ss > 0) time += " " + ss + " second" + (ss>1? "s" :"");

            return time;
        }

        function ticksToTime(ticks, formating) {
            var hh = Math.floor( ticks / 3600);
            var mm = Math.floor( (ticks % 3600) / 60);
            var ss = (ticks % 3600) % 60;

            var res = formating || 'HH:MM';

            res = res.replace('hh', hh);
            res = res.replace('mm', mm);
            res = res.replace('ss', ss);
            res = res.replace('HH', ("0" + hh).slice (-2));
            res = res.replace('MM', ("0" + mm).slice (-2));
            res = res.replace('SS', ("0" + ss).slice (-2));

            return res;
        }

        return {
            'standardTicksToTime': standardTicksToTime,
            'ticksToTime': ticksToTime
        };
    })

})();