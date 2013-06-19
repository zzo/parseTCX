[![build status](https://secure.travis-ci.org/zzo/parseTCX.png)](http://travis-ci.org/zzo/parseTCX)

parseTCX
========

parse a TCX file - returns a JS object with all interesting values including Foot Pod extension and footpod calibration.

    var tcxParser = require('parseTCX');
    tcxParser.parseFile(tcxFile.path, function(err, tcx) {
        if (!err) {
            var details = tcx.getFootpodDetails();
            console.log(JSON.stringify(details));
            console.log(JSON.stringify(tcx));
        }
    });

Foot pod calibration logic shamelessly stolen from:

http://fellrnr.com/wiki/Garmin_Foot_Pod_Calibration

All because I don't have a Windows box!

Used by 'footpod' a Web UI for Foot Pod calibration

