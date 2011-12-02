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

/*global $, Config, Querystring, DOMParser */

require(
    [
        "jquery", "sakai/sakai.api.core",
        "/nyuwidgets/groupactivity/lib/jquery.tablesorter.js"
    ],
    function($, sakai) {
    /**
     * @name sakai.ebook
     *
     * @class ebook
     *
     * @description
     * Initialize the ebook widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.groupactivity = function(tuid, showSettings){

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var rootel = "#" + tuid;

        // All the data
        var pubdata = {};
        var items = [];
        var groupId = sakai.api.Util.extractEntity(window.location.pathname);
        
        // Main ids
        var groupActivityId = "#groupactivity";
        var groupActivityName = "groupactivity";
        var groupActivityClass = ".groupactivity";

        // Containers
        var mainDisplay = groupActivityId+"_display";

        // Textboxes / Inputs

        // Checkboxes

        // Templates

        // Paging

        // Buttons

        // Buttons (no dot)

        // Messages

        ////////////////////
        // Event Handlers //
        ////////////////////
        var addBinding = function(){

        };


        ////////////////////////
        // Utility  functions //
        ////////////////////////

        

        ////////////////////////
        // Settings functions //
        ////////////////////////

        /**
         * Loads the settings screen
         * @param {Object} exists
         */
        var loadSettings = function(exists){

        };

        /**
         * Return the settings object
         * with any default values where required
         * @return {object}
         */
        var getSettingsObject = function(){
           return {};
        };

        /**
         * Save settings
         * @param {object} settings - the widget data to save
         * @param {callback} function - method to execute upon success and only if displaying settings pane
         * @param {bolean} success - whether data had been previously saved (???)
         */
        var updateWidgetSettings = function(settings, callback) {
            sakai.api.Widgets.saveWidgetData(
                tuid,
                settings,
                function(success, data){
                    if ($(".sakai_dashboard_page").is(":visible")) {
                        showSettings = false;
                        showHideSettings(showSettings);
                    }
                    else {
                        //sakai.api.Widgets.Container.informFinish(tuid, "ebook");
                        //widgetData = data;
                        if (callback) {
                            callback();
                        }
                    }
                },
                true
            );
        };
                

        ////////////////////
        // Main functions //
        ////////////////////               

        var loadDocStructure = function(forceOpenPage){
            $.ajax({
                url: "/~" + groupId+ "/docstructure.infinity.json",
                async: false,
                cache: false,
                success: function(data){
                    pubdata = sakai.api.Server.cleanUpSakaiDocObject(data);                                        
                }
            });
        };
        
        var loadContentVisibleToGroup = function() {
             sakai.api.Server.loadJSON("/var/search/pool/manager-viewer.json",
                renderContentActivityReport, {
                    userid: groupId,
                    items: 100000000,
                    q: "*"
                }
            );
        }
        
        var renderContentActivityReport = function(success, data) {            
            items = data.results;       
            $(mainDisplay).html(sakai.api.Util.TemplateRenderer("groupactivity_report_template", {items: items}));
            $.tablesorter.addParser({
                id: "customDate",
                is: function(s) {
                    //return false;
                    //use the above line if you don't want table sorter to auto detected this parser
                    //else use the below line.
                    //attention: doesn't check for invalid stuff
                    //2009-77-77 77:77:77.0 would also be matched
                    //if that doesn't suit you alter the regex to be more restrictive
                    return /\d{1,4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/.test(s);
                },
                format: function(s) {
                    s = s.replace(/\-/g," ");
                    s = s.replace(/:/g," ");
                    s = s.replace(/\./g," ");
                    s = s.split(" ");
                    return $.tablesorter.formatFloat(new Date(s[0], s[1]-1, s[2], s[3], s[4], s[5]).getTime());
                },
                type: "numeric"
            });
            $("table.groupactivity-report", rootel).tablesorter(
                {
                    headers: {
                        2: {
                            sorter: "customDate"
                        },
                        4: {
                            sorter: "customDate"
                        }
                    },
                    sortForce: [[3,1]]
                }
            );
        }
               
        /////////////////////////////
        // Initialisation function //
        /////////////////////////////

        var renderMainDisplay = function(){
            //sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {                
                $(mainDisplay, rootel).show();
            //});
        };

        loadDocStructure();    
        loadContentVisibleToGroup();
        
        renderMainDisplay();
        
        addBinding();

    };

    sakai.api.Widgets.widgetLoader.informOnLoad("groupactivity");
});
