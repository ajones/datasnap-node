/**
 * Datasnap nodejs wrapper for their REST tracking api
 * API reference : http://docs.datasnapio.apiary.io/
 * Creator : Aaron Jones <aaron@inburst.io>
 * Date : October 6, 2014
 */

// required for secure communication
var https = require('https');

var config = {
    api : "https://api-events.datasnap.io/v1.0/events",
    host : "api-events.datasnap.io",
    base_path : "/v1.0/events",
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
            makeCallToDatasnap(data)
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
    return data;
}

/**
 * Physically fires off the request to the datasnap API.
 */
function makeCallToDatasnap(dataBlob,callback) {
    // dont do anything if the datablob is empty
    if (!dataBlob) return;

    // pre fill pipe values
    var host = config.host;
    var path = config.base_path
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
