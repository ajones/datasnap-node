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
                    "event_type": "communication_delivered",
                    "organization_ids": [
                        "3HRhnUtmtXnT1UHQHClAcP"
                    ],
                    "project_ids": [
                        "3HRhnUtmtXnT1UHQHClAcP"
                    ],
                    "user": {
                        "id": {
                            "mobile_device_bluetooth_identifier": "8c4e1f232810d11be96edf47674f5641296a76f5",
                            "mobile_device_ios_idfa": "1a847de9f24b18eee3fac634b833b7887b32dea3",
                            "global_distinct_id": "userid1234"
                        }
                    },
                    "communication": {
                        "description": "mydescription",
                        "id": "commid",
                        "communication_vendor_id": "airpush123",
                        "name": "10% offPushnotification",
                        "type": {
                            "id": "typeid",
                            "name": "PushNotificaion"
                        },
                        "content": {
                            "text": "get10%off!",
                            "description": "get10%offifyougotothe",
                            "image": "http: //appl.com/image.gif",
                            "html": "<p>Hithere!!get10%offnow!!</p>",
                            "url": "http: //www.apple.com"
                        }
                    },
                    "campaign": {
                        "id": "campaignid",
                        "name": "camapign10%offshoes",
                        "communication_ids": [
                            "commid1", "commid2"
                        ]
                    }
                }
             ]
   datasnap.trackEvent(event);

