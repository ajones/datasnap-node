    var options = {
        auth_header : 'E9NZuB6A91e2J03PKA2g7wx0629czel8',
        organization_ids: [
            "3HRhnUtmtXnT1UHQHClAcP"
        ],
        project_ids: [
            "3HRhnUtmtXnT1UHQHClAcP"
        ]
    }
   var datasnap = require('datasnap')(options);
   var event = [
                {
                    "event_type": "geofence_depart",
                    "organization_ids": [
                        "3HRhnUtmtXnT1UHQHClAcP"
                    ],
                    "project_ids": [
                        "3HRhnUtmtXnT1UHQHClAcP"
                    ],
                    "place": {
                        "id": "placeid",
                        "last_place": "placeid-3",
                        "geofences": [
                            {
                                "geofenceid": "geofenceid2"
                            },
                            {
                                "geofenceid": "geofenceid2"
                            }
                        ]
                    },
                    "geofence": {
                        "id": "geofence2",
                        "name": "SF Gelen Park",
                        "geofence_circle": {
                            "radius": 100,
                            "location": {
                                "latitude": 32.89494374592149,
                                "longitude": -117.19603832579497
                            }
                        }

                    },
                    "user": {
                        "tags": [
                            "womens",
                            "golf",
                            "shoes"
                        ],
                        "id": {
                            "mobile_device_ios_idfa": "1a847de9f24b18eee3fac634b833b7887b32dea3",
                            "global_distinct_id": "userid1234"
                        }
                    }
                }
            ]
   datasnap.trackEvent(event);

