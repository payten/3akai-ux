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
        var dropboxSubmissionPath = "/dropbox/submissions"
        var dropboxWidgetPath = "/dropbox/widget";
        
        
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
            var data = serializeFormToObject($("#dropbox_form", rootel));
            data = $.extend(widgetData, data);
            $.post(
                dropboxWidgetPath + "?widgetid=" + tuid,
                data,
                function() {
                    sakai.api.Widgets.Container.informFinish(tuid, "dropbox"); 
                },
                "json"
            );
            sakai.api.Widgets.saveWidgetData(tuid, data, function() {
                // not using at the moment...
            });
            return false;
        });
        
        $("#dropbox_upload_form_btnSubmit", rootel).die("click");
        $("#dropbox_upload_form_btnSubmit", rootel).live("click", function() {
            $("#dropbox_upload_form").attr("action", dropboxSubmissionPath  + "?widgetid=" + tuid);
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
                    if (widgetData.submissions) {
                       widgetData.submissions[sakai.data.me.user.userid] = extractedData.poolId;
                    }
                    displayExistingSubmittions();
                },
                error: function() {
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

        var displayExistingSubmittions = function() {
           if (widgetData.submissions.hasOwnProperty(sakai.data.me.user.userid)) {
               $("#dropbox_submissions ul", rootel).html("<li>"+widgetData.submissions[sakai.data.me.user.userid]+"</li>");
           }
        };
        
        /**
         * Serialise a form and it's input values into a JSON object
         * @param {element/selector} form - the form/element to serialise
         * @return {object} the form data as a JSON object
         */
        var serializeFormToObject = function(form) {
            var o = {};
            var a = $(form).serializeArray();
            $.each(a, function() {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
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
                $("#dropbox_form #title", rootel).val(widgetData.title);
                $("#dropbox_form #deadline", rootel).val(widgetData.deadline);                
            } else {
                // Fill in dropbox defaults
                $("#dropbox_form #title", rootel).val("My Assignment Submission Box");
                $("#dropbox_form #deadline", rootel).val(Date.now());                
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
                $.ajax({
                   url: dropboxWidgetPath, 
                   data: {
                     "widgetid": tuid  
                   },
                   type: "GET",
                   dataType: "json",                   
                   success: function(data, textStatus, jqXHR) {
                       widgetData = data;
                        if (widgetData.submissions == null) widgetData.submissions = {};
                        if (showSettings) {
                            showSettingsScreen(data, true);
                        } else {
        //                    if ($.trim(data.title) !== "") {
        //                        sakai.api.Widgets.changeWidgetTitle(tuid, data.title);
        //                    } else {
        //                        sakai.api.Widgets.changeWidgetTitle(tuid, sakai.widgets['dropbox'].name);
        //                    }
                            $(dropboxSettings, rootel).hide();
                            $(dropboxDisplay, rootel).show();
                            setupUploadNewContent();
                            displayExistingSubmittions();
                        }                       
                   },
                   error: function(jqXHR, textStatus, errorThrown) {
                       alert("OH BOY - ERROR: " + jqXHR.responseText);
                   }
                });                                
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
