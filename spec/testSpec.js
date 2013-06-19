var parseTCX = require('../index.js')
    , tcxFile1 = 'spec/2013-06-06-124635.TCX'
    , tcxFile2 = 'spec/2013-06-01-075000.TCX'
    , tcxFile3 = 'spec/2013-05-25-055929.TCX'
    , tcxFile4 = 'spec/2013-05-31-081334.TCX'
;

function matchProp(canned, got) {
    var prop;
    for (prop in canned) {
        expect(canned.prop).toEqual(got.prop);
    }
}

describe("basic tcs parse", function() {

    it("should get activity type", function(done) {
        parseTCX.parseFile(tcxFile1, function(err, result) {
            var activities = result.getActivityType('running');
            expect(activities.length).toEqual(1);
            done();
        });
    });

    it("should get footpod adjustment", function(done) {
        parseTCX.parseFile(tcxFile1, function(err, result) {
            var res = parseTCX.getFootpodDetails('foo')
                , expected = { 
                    adjustment: 1.0090352683890527,
                    consistency: 'very poor',
                    stdev: 0.15914444241721842,
                    lapscale:
                    [ 
                        1.023130802714519,
                        1.0069707265643084,
                        1.0083375658654006,
                        1.0020800471748472,
                        1.0028044849956765 
                    ],
                    scaleLap: 1.0086647254629504 
                }
            ;
//            expect(res).toEqual(expected);
            matchProp(expected, res);
            done();
        });
    });

    it("should get footpod adjustment again", function(done) {
        parseTCX.parseFile(tcxFile2, function(err, result) {
            var res = parseTCX.getFootpodDetails('foo');
                expected = { 
                    adjustment: 1.0032384112152906,
                    consistency: 'okay',
                    stdev: 0.06492201818690986,
                    lapscale: [ 
                        1.0027099389916856,
                        1.0096131884606159,
                        0.9942297831741369,
                        1.004016070216369,
                        1.0077475648350962 
                    ],
                    scaleLap: 1.0036633091355807 
                }
            ;
            //expect(res).toEqual(expected);
            matchProp(expected, res);
            done();
        });
    });

    it("should get footpod adjustment even more", function(done) {
        parseTCX.parseFile(tcxFile3, function(err, result) {
            var res = parseTCX.getFootpodDetails('foo')
                , expected = { 
                    adjustment: 1.0022498876345212,
                    consistency: 'okay',
                    stdev: 0.05660121766640207,
                    lapscale: [ 
                        1.0035790837318854,
                        0.9992339720184327,
                        1.0016181669658877,
                        1.0039939025181783,
                        0.9998527027593294,
                        1.0059016645751813,
                        1.000633015510964,
                        0.9967295353094844,
                        0.9984764320165174,
                        1.0090308658405804,
                        1.005423897400283,
                        1.0003975716662898,
                        1.0062569743477603 
                    ],
                    scaleLap: 1.0023944449739055 
                }
            ;
            //expect(res).toEqual(expected);
            matchProp(expected, res);
            done();
        });
    });

    it("should get footpod adjustment even more and more", function(done) {
        parseTCX.parseFile(tcxFile4, function(err, result) {
            var res = parseTCX.getFootpodDetails('foo')
                , expected = { 
                    adjustment: 0.9980427627942284,
                    consistency: 'okay',
                    stdev: 0.07293592998371791,
                    lapscale: [ 
                        1.0010955394982082,
                        1.0028631536336197,
                        0.9972655589746611,
                        0.9952862108435929,
                        0.9960286630123543,
                        0.98457069992383 
                    ],
                    scaleLap: 0.9961849709810443 
                }
            ;
            
            //expect(res).toEqual(expected);
            matchProp(expected, res);
            done();
        });
    });
});
