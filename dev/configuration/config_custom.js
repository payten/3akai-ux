/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
define(["config/config"], function(config) {

    // Custom CSS Files to load in
    // config.skinCSS = ["/dev/skins/default/skin.css"];

    /**
     * Kaltura Settings
     */
    config.kaltura = {
        enabled: false, // Enable/disable Kaltura player
        serverURL:  "http://www.kaltura.com", //INSERT_KALTURA_INSTALLATION_URL_HERE
        partnerId:  100, //INSERT_YOUR_PARTNER_ID_HERE
        playerId: 100 //INSERT_YOUR_PLAYER_ID_HERE
    };
    
    // Customise the user's default pub structure
    config.defaultpubstructure["structure0"]["wall"] = {
            "_title": "__MSG__USER_PUBLIC_DASHBOARD_TITLE__",
            "_altTitle": "__MSG__USER_PUBLIC_DASHBOARD_ALT_TITLE__",
            "_order": -1,
            "_view": "private",
            "_canEdit": true,
            "_reorderOnly": false,
            "_nonEditable": true,
            "_ref": "${refid}3",
            "main": {
                "_ref": "${refid}3",
                "_order": 0,
                "_title": "__MSG__USER_PUBLIC_DASHBOARD_TITLE__"
            }
    };
    config.defaultpubstructure["${refid}3"] = {
        "${refid}5": {
            'htmlblock': {
                'content': "<div class='fl-force-right dashboard-admin-actions' style='display:none;'><button type='button' class='s3d-button s3d-margin"+
                    "-top-5 s3d-header-button s3d-header-smaller-button dashboard_change_layout' dat"+
                    "a-tuid='${refid}4'>__MSG__EDIT_LAYOUT__</button><button type='button' class='s3d-button "+
                    "s3d-margin-top-5 s3d-header-button s3d-header-smaller-button dashboard_global_a"+
                    "dd_widget' data-tuid='${refid}4'>__MSG__ADD_WIDGET__</button></div><div class='s3d-conte"+
                    "ntpage-title'>__MSG__USER_PUBLIC_DASHBOARD_TITLE__</div><div id='widget_dashboard_${refid}4' class='widget_inline'></div>"
             }
        },
        'rows': {
            '__array__0__': {
                'id': "${refid}6",
                'columns': {
                    '__array__0__': {
                        'width': 1,
                        'elements': {
                            '__array__0__': {
                                'id': "${refid}5",
                                'type': 'htmlblock'
                            },
                            '__array__1__': {
                                'id': "${refid}4",
                                'type': "dashboard"                      
                            }
                        }
                    }
                }
            }
        }
    };
    config.defaultpubstructure["${refid}4"] = {
            "dashboard": {
                "layout": "threecolumn",
                "columns": {
                    "column1": [],
                    "column2": [],
                    "column3": []
                }
            }
    };    

    return config;
});
