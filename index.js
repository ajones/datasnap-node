/**
 * Datasnap nodejs wrapper for their REST tracking api
 * API reference : http://docs.datasnapio.apiary.io/
 * Creator : Aaron Jones <aaron@inburst.io>
 * Date : October 6, 2014
 */

// required for secure communication
var https = require('https');

var config = {
    events : {
        api : "https://api-events.datasnap.io/v1.0/events",
        host : "api-events.datasnap.io",
        base_path : "/v1.0/events"
    },
    analytics : {
        api : "https://api-analytics.datasnap.io/v1.0/events",
        host : "api-analytics.datasnap.io",
        base_path : "/v1.0/events"
    },

    debug : false,

    auth_header : null,
    organization_ids : null,
    project_ids: null
}

/**
 * This is where the bind magic happens.
 */
module.exports = function(options) {

    config.auth_header = options.auth_header;
    config.project_ids = options.project_ids;
    config.organization_ids = options.organization_ids;
    config.debug = options.debug || false;

    if (!options){
        console.log('Empty options object passed to Datasnap.');
    } else if (!config.organization_ids ||
               config.organization_ids.count < 1 ) {
        console.log('At leist one organization id is required.');
    }

    // scope the core so we only expose specific functions
    var datasnapCore = (function() {

        this.trackEvent = function(data){
            config.debug && console.log('Logging ['+(data.event_type||"some event")+'] to Datasnap.');
            // append project and org ids to the data
            data = massageData(data);
            // fire the call
            postToDatasnap(data)
        }

        this.retrieveAnalytics = function(endpoint, segmentationParameters, callback){
            config.debug && console.log('Retrieving analytics from  ['+(endpoint||"unknown endpoint")+'].');
            // fire the call
            retrieveDataFromDatasnap(endpoint,segmentationParameters,callback);
        }

        return this;
    })();

    return datasnapCore;
}

/**
 * Appends the necessary information to each event node
 * if the org or proj info is already set is does not
 * overwrite, allowing for forked batches
 */
function massageData(data) {
    // if
    if (!data) return;

    if( Object.prototype.toString.call( data ) === '[object Array]' ) {
        // data is an array
        // loop over all nodes and ensure the proper project and org ids are set.
        for (var ix in data){
            if (!data[ix]['organization_ids']){
                data[ix]['organization_ids'] = config.organization_ids;
            }
            if (!data[ix]['project_ids']){
                data[ix]['project_ids'] = config.project_ids;
            }
        }
    } else{
        if (!data['organization_ids']){
            data['organization_ids'] = config.organization_ids;
        }
        if (!data['project_ids']){
            data['project_ids'] = config.project_ids;
        }
        // api requires root obj to be an array
        data = [data];
    }
    for (var i in data){
        if((data[i].event_type === 'beacon_arrive' || data[i].event_type === 'beacon_sighting' || data[i].event_type === 'beacon_depart_vendor'
        		|| data[i].event_type ===  'beacon_depart' || data[i].event_type ===  'beacon_visit' || data.event_type === 'beacon_visit_vendor')
        	&& (!data[i].beacon)){
        		console.log('A beacon event must contain a beacon');
          	return;
          }

        else if((data[i].event_type === 'geofence_arrive' || data[i].event_type === 'geofence_sighting' || data[i].event_type === 'geofence_depart')
        	&& (!data[i].geofence)){
            	console.log('A geofence event must contain a geofence');
            	return;
            }

        else if((data[i].event_type === 'global_position_sighting') && (!data[i].global_position)){
            	console.log('A global position event must contain a global position');
            	return;
            }

        else if((data[i].event_type ==='communication_delivered' || data[i].event_type ==='campaign_request' || data[i].event_type ==='campaign_redemption')
        	&& (!data[i].communication)){
        	console.log('A communication event must contain a communication');
            	return;
            }

        }
    return data;
}

/**
 * Physically fires off the request to the datasnap API.
 */
function postToDatasnap(dataBlob,callback) {
    // dont do anything if the datablob is empty
    if (!dataBlob) return;

    // pre fill pipe values
    var host = config.events.host;
    var path = config.events.base_path
    var headers = {
        'Authorization': 'Basic '+config.auth_header,
        'Content-Type': 'application/json'
    };

    // build the options blob for the https controller
    var options = {
        host: host,
        path: path,
        method: 'POST',
        headers: headers,
        agent: null
    };
    // stringify the data blob being sure to remove new lines.
    var blobString = dataBlob && JSON.stringify(dataBlob,null,4);
    config.debug && console.log(blobString)

    // create the connection agent
    options.agent = new https.Agent(options);

    // build a request from the agent
    var outbound = https.request(options,
                function (response) {
                    var body = null;
                    // spool the data as it comes in
                    response.on('data', function(chunk) {
                        if (!body){ body = chunk; }
                        else { body += chunk; }
                    });
                    // when we receive the
                    response.on('end', function() {
                        // if we dont get a 201 then the post was unsuccessful
                        // be sure to log that it did not work.
                        if (config.debug || response.statusCode != 201){
                            console.log("Datasnap response:");
                            console.log("Status Code:"+response.statusCode)
                            console.log("Response Body:"+(body && body.toString('utf8', 0, body.len)))
                        }
                    });
                }).on('error',function(e){
                    // log any errors to the console
                    console.log("Datasnap error:");
                    console.log("Host: "+host);
                    console.log("Error: "+e.message);
                });

    try{
        outbound.write(blobString);
    } catch(err){
        console.log('Unable to write data payload ['+blobString+'] to Datasnap!');
    }
    // finialize the request
    outbound.end();
}


/**
 * Physically fires off the request to the datasnap API.
 */
function retrieveDataFromDatasnap(endpoint,segmentationParams,callback) {
    // dont do anything if the datablob is empty
    if (!endpoint){ console.log('Missing endpoint!'); return callback && callback()};

    // pre fill pipe values

    var headers = {
        'Authorization': 'Basic '+config.auth_header,
        'Content-Type': 'application/json'
    };

    // convert the segmentation parameters to a query string
    var queryString = null;
    if (segmentationParams) {
        queryString = "?";
        for (var key in segmentationParams){
            queryString += key+'='+segmentationParams[key]+'&';
        }
    }
    config.debug && console.log('Segmentation Paramaters : ',queryString)

    var host = config.analytics.host;
    var path = config.analytics.base_path + endpoint
    if (queryString){
        path += queryString;
    }
    // build the options blob for the https controller
    var options = {
        host: host,
        path: path,
        method: 'GET',
        headers: headers,
        agent: null
    };

    // create the connection agent
    options.agent = new https.Agent(options);

    // build a request from the agent
    var outbound = https.request(options,
                function (response) {
                    var body = null;
                    // spool the data as it comes in
                    response.on('data', function(chunk) {
                        if (!body){ body = chunk; }
                        else { body += chunk; }
                    });
                    // when we receive the
                    response.on('end', function() {
                        // if we dont get a 201 then the post was unsuccessful
                        // be sure to log that it did not work.
                        if (config.debug || response.statusCode != 200){
                            console.log("Datasnap response:");
                            console.log("Status Code:"+response.statusCode)
                            console.log("Response Body:"+(body && body.toString('utf8', 0, body.len)))
                        }
                        var bodyJSON = null;
                        try{
                            bodyJSON = JSON.parse(body)
                        } catch(err){
                            console.log('Unable to parse Datasnap result!');
                        }
                        return callback && callback(bodyJSON);
                    });
                }).on('error',function(e){
                    // log any errors to the console
                    console.log("Datasnap error:");
                    console.log("Host: "+host);
                    console.log("Error: "+e.message);
                });
    // finialize the request
    outbound.end();
}
