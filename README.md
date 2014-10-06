Datasnap Nodejs Driver
=========

A small wrapper of the Datasnap REST api to make logging events easier.

## Installation

    npm install datasnap --save

## Usage

    var options = {
        auth_header : 'base64_encoded_auth_header',
        organization_ids: [
            "org1"
        ],
        project_ids: [
            "proj1"
        ]
    }
    var datasnap = require('datasnap')(options);
    datasnap.trackEvent({event_type:'some_event_type'});

## Release History

* 0.1.0 Initial release
