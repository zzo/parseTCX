var fs = require('fs')
    , util = require('util')
    , xml2js = require('xml2js')
    , stdev = require('stdev')
;

module.exports = (function() {
    var ret = {
        GetRating: function(stddev)
        {
            var rating;
            if (stddev < 0.02)
                rating = "very good";
            else if (stddev < 0.05)
                rating = "good";
            else if (stddev < 0.075)
                rating = "okay";
            else if (stddev < 0.1)
                rating = "poor";
            else if (stddev < 0.2)
                rating = "very poor";
            else
                rating = "appalling";
            return rating;
        }
        , parseFile: function(fname, cb) {
            var me = this;
            fs.readFile(fname, function(err, data) {
                if (err) { 
                    cb(err);
                } else {
                    me.parseString(data, cb);
                }
            });
        }
        , getActivities: function() {
            return this.result.TrainingCenterDatabase.Activities;
        }
        , getActivityType: function(type) {
            var acts = this.getActivities();
            return acts.map(function(activity) {
                var act = activity.Activity[0];
                if (act.$.Sport.toLowerCase() === type.toLowerCase()) {
                    return act;
                }
            });
        }
        , parseString: function(data, cb) {
            var me = this;
            xml2js.parseString(data, function(err, result) {
                if (err) {
                    cb(err);
                } else {
                    if (!result.TrainingCenterDatabase || !result.TrainingCenterDatabase.Activities) {
                        return cb('Invalid TCX file');
                    }
                    me.result = result;
                    cb(null, me);
                }
            });
        }
        , getFootpodDetails: function() {
            var me = this
                , sumscale = 0
                , numpoints = 0
                , perlap_sumscale = 0
                , perlap_numpoints = 0
                , totalDistance = 0
                , lapscale = []
                , lapdistance = []
                , lapdata = { footpoddistance: [], gpsdistance: [], scale: [], time: [], gps: [], lapindex: [ 0 ] }
            ;
            this.getActivityType('running').forEach(function(activity) {
                activity.Lap.forEach(function(lap) {
//                    console.log('Lap start time: ' + lap.$.StartTime);
                    var valid = false
                        , lasttime
                        , lastdistance
                        , currenttime
                        , currentdistance
                        , lapsumscale = 0
                        , lapnumpoints = 0
                    ;
                    lap.Track[0].Trackpoint.forEach(function(point) {
                        //console.log(util.inspect(point, false, null))
                        if (point.Extensions &&
                            point.Extensions.length &&
                            point.Extensions[0] &&
                            point.Extensions[0].TPX &&
                            point.Extensions[0].TPX.length &&
                            point.Extensions[0].TPX[0].Speed &&
                            point.Extensions[0].TPX[0].RunCadence)
                        {
                            if (valid) {
                                currenttime = new Date(point.Time[0]).getTime();
                                var seconds = (currenttime - lasttime) / 1000.0;
                                currentdistance = point.DistanceMeters[0];
                                var distance = currentdistance - lastdistance;
                                if (seconds > 0  && distance > 0) {
                                    var gpsSpeed = distance / seconds;
                                    var footpodspeedMPS = point.Extensions[0].TPX[0].Speed; //Meters per second!
                                    if (footpodspeedMPS > 0) {
                                        var footpoddistance = footpodspeedMPS * seconds
                                            , scale = distance / footpoddistance
                                        ;
                                        sumscale += scale;
                                        numpoints++;
                                        lapsumscale += scale;
                                        lapnumpoints++;
                                        lapdata.gpsdistance.push(distance);
                                        lapdata.footpoddistance.push(footpoddistance);
                                        lapdata.scale.push(scale);
                                        lapdata.time.push(currenttime);
                                        var pos = point.Position[0];
                                        lapdata.gps.push([pos.LatitudeDegrees[0], pos.LongitudeDegrees[0]]);
                                    }
                                }
                            }
                            lasttime = currenttime;
                            lastdistance = currentdistance;
                            valid = true;
                        }
                    });

                    if (lapnumpoints > 0)
                    {
                        lapscale.push(lapsumscale / lapnumpoints);
                        lapdistance.push(lap.DistanceMeters[0] * 0.000621371); // convert to miles
                        totalDistance += lapdistance[lapdistance.length - 1];
                        perlap_sumscale += (lapsumscale / lapnumpoints);
                        perlap_numpoints++;
                        lapdata.lapindex.push(lapdata.gps.length);
                    }
                });
            });
            var stddev = stdev(lapdata.scale)
                , rating = me.GetRating(stddev)
                , retObj = {
                    adjustment: (sumscale / numpoints)
                    , consistency: rating
                    , stdev: stddev
                    , lapscale: lapscale
                    , totalDistance: totalDistance
                    , scaleLap: perlap_sumscale / perlap_numpoints
                    , lapDistance: lapdistance
                    , lapdata: lapdata
                };
            return retObj;
            /*
            if (summary) {
                if (numpoints == 0) {
                    console.log("No usable data was found in " + shortname);
                } else {
                    console.log(shortname 
                        + " calibration factor adjustment " 
                        + (sumscale / numpoints)
                        + ", Consistency is " 
                        + rating 
                        + " (stddev " 
                        + stddev
                        + ")"
                    );
                }
            }
            */
        }
    };

    var parseTSX = function() { };
    parseTSX.prototype = ret;
    return new parseTSX();
})();
