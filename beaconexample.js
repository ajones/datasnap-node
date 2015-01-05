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
                    "event_type": "beacon_depart",
                    "organization_ids": [
                        "3HRhnUtmtXnT1UHQHClAcP"
                    ],
                    "project_ids": [
                        "3HRhnUtmtXnT1UHQHClAcP"
                    ],
                    "place": {
                        "id": "placeid",
                        "last_place": "placeid-3"
                    },
                    "user": {
                        "id": {
                            "mobile_device_ios_idfa": "1a847de9f24b18eee3fac634b833b7887b32dea3",
                            "global_distinct_id": "userid1234"
                        }
                    },
                    "beacon": {
                        "identifier": "SHDG-28AHD"
                    },
                    "datasnap": {
                        "created": "2014-08-22 14:48:02 +0000",
                        "device": {
                            "user_agent": "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
                            "ip_address": "127.1.1.1",
                            "platform": "ios",
                            "os_version": "7.0",
                            "model": "iPhone5",
                            "manufacturer": "Apple",
                            "name": "hashed device name",
                            "vendor_id": "63A7355F-5AF2-4E20-BE55-C3E80D0305B1",
                            "carrier_name": "Verizon",
                            "country_code": "1",
                            "network_code": "327"
                        }
                    }
                }
            ]
   datasnap.trackEvent(event);

