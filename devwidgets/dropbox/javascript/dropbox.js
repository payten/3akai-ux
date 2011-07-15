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

/*
 * Dependencies
 *
 * TODO
 */

/*global $, Config, Querystring, SWFID, swfobject */


require(["jquery", "sakai/sakai.api.core"], function($, sakai) {

    /**
     * @name sakai_global.dropbox
     *
     * @class dropbox
     *
     * @description
     * Initialize the dropbox widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.dropbox = function(tuid, showSettings) {

        

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var rootel = $("#" + tuid);  // Get the main div used by the widget
        var widgetData = {};


        // Main-ids
        var dropboxID = "#dropbox";
        var dropboxName = "dropbox";

        // Paths
        var uploadPath = "/system/pool/createfile";
        
        // Containers
        var dropboxSettings = dropboxID + "_settings";
        var dropboxDisplay = dropboxID + "_display";
        
        // Textboxes
        
        // Radiobuttons
        
        // Checkboxes
        
        // Template
        
        // Files
        
        // Buttons
        $("#dropbox_btnInsertWidget", rootel).die("click");
        $("#dropbox_btnInsertWidget", rootel).live("click", function() {
            sakai.api.Widgets.saveWidgetData(tuid, {}, function() {
                sakai.api.Widgets.Container.informFinish(tuid, "dropbox"); 
            });
            return false;
        });
        
        $("#dropbox_upload_form_btnSubmit", rootel).die("click");
        $("#dropbox_upload_form_btnSubmit", rootel).live("click", function() {
            $("#dropbox_upload_form").attr("action", uploadPath);
            $("#dropbox_upload_form").ajaxForm({
                dataType: "json",
                success: function(data){
                    var extractedData = [];
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {                            
                            var obj = {};
                            obj.filename = i;
                            obj.hashpath = data[i];
                            extractedData.push(obj);
                        }
                    }
                    console.log(extractedData);
                    if (widgetData.submissions)
                },
                error: function(){
                    alert("ERROR UPLOADING FILE");
                }
            });
            $("#dropbox_upload_form").submit();        
        })

        ///////////////////////
        // Utility functions //
        ///////////////////////

        var setupUploadNewContent = function(){            
          
        };

        ////////////////////////
        // Settings functions //
        ////////////////////////

        /**
         * Shows the settings screen
         * @param {String} response
         * @param {Boolean} exists
         */
        var showSettingsScreen = function(response, exists) {
            if (exists) {
                // Fill in dropbox info
                
            } else {
                // Fill in dropbox defaults
                
            }
            $(dropboxDisplay, rootel).hide();
            $(dropboxSettings, rootel).show();
        };


        ////////////////////
        // Main functions //
        ////////////////////
    

        ////////////////////
        // Event Handlers //
        ////////////////////
       

        /////////////////////////////
        // Initialisation function //
        /////////////////////////////

        /**
         * Switch between main and settings page
         * @param {Boolean} showSettings Show the settings of the widget or not
         */
        sakai.api.Widgets.loadWidgetData(tuid, function (success, data) {
            if (success) {    
                widgetData = data;
                if (showSettings) {
                    showSettingsScreen(data, true);
                } else {
                    if ($.trim(data.title) !== "") {
                        sakai.api.Widgets.changeWidgetTitle(tuid, data.title);
                    } else {
                        sakai.api.Widgets.changeWidgetTitle(tuid, sakai.widgets['dropbox'].name);
                    }
                    $(dropboxSettings, rootel).hide();
                    $(dropboxDisplay, rootel).show();
                    setupUploadNewContent();
                }
            } else {
                // no dropbox set
                if (showSettings) {
                    showSettingsScreen(data.status, false);
                } else {
                    $(dropboxSettings, rootel).hide();
                    $(dropboxDisplay, rootel).show();                    
                    setupUploadNewContent();
                }
            }

        });

    };
    sakai.api.Widgets.widgetLoader.informOnLoad("dropbox");
});
