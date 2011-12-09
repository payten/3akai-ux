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
        "/nyuwidgets/groupactivity/lib/jquery.tablesorter.js",
        "/nyuwidgets/groupactivity/lib/jquery.ui.tabs.js"
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
            $("#refreshLocalContent",rootel).click(function() {
               $("#localcontent .report",rootel).html("loading...");
               loadDocStructure(); 
            });
            
            $("#refreshLibraryContent",rootel).click(function() {
               $("#librarycontent .report",rootel).html("loading...");
               loadContentVisibleToGroup(); 
            });

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

        var loadDocStructure = function(){
            var pids = [];
            var batchRequests = [];
            var topLevelPages = {};
            pubdata = sakai_global.group.pubdata;
                
            for (var pub in pubdata.structure0) {
                if (pubdata.structure0.hasOwnProperty(pub) && typeof pubdata.structure0[pub] === "object") {
                    pids.push(pubdata.structure0[pub]._pid);
                    topLevelPages[pubdata.structure0[pub]._pid] = pubdata.structure0[pub];
                }
            }
                                
            for (var i = 0; i < pids.length; i++) {
                batchRequests.push({
                    "url": "/p/" + pids[i] + ".infinity.json",
                    "method": "GET"
                });
            }           
            sakai.api.Server.batch(batchRequests, function(success, data) {
                if (success) {
                    var pages = {
                        items: [],                    
                    };
                    for (var i = 0; i < pids.length; i++){
                        var result = data.results[i];
                        if (result.status === 404 || result.status === 403) {
                            // do nothing... 
                        } else {
                            var docInfo = sakai.api.Server.cleanUpSakaiDocObject($.parseJSON(result.body));                      
                            for (var page in docInfo.structure0) {
                                if (docInfo.structure0.hasOwnProperty(page) && docInfo.hasOwnProperty(docInfo.structure0[page]._ref)){
                                    try {                                         
                                         var cleanedUpDocInfo = {
                                            "title": docInfo.structure0[page]._title,
                                            "_lastModifiedBy": docInfo[docInfo.structure0[page]._ref]._lastModifiedBy,
                                            "_lastModified": docInfo[docInfo.structure0[page]._ref]._lastModified,
                                            "area": topLevelPages[pids[i]]._title
                                         }                                         
                                         pages.items.push(cleanedUpDocInfo);
                                    } catch(e) {
                                        // ignore for now... coz i iz dodgy
                                    }                                                                    
                                }
                            }
                        }
                    }
                    $("#localcontent .report",rootel).html(sakai.api.Util.TemplateRenderer("groupactivity_content_report_template", pages));            
                    $("#localcontent table.groupactivity-report", rootel).tablesorter(
                        {
                            headers: {
                                3: {
                                    sorter: "customDate"
                                }
                            },
                            sortList: [[1,0],[2,0]]
                        }
                    );
                }

            });                     
          
            
            $(window).bind("ready.sakaidocs.sakai", function(){
                debugger;
                                 
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
            $("#librarycontent .report",rootel).html(sakai.api.Util.TemplateRenderer("groupactivity_report_template", {items: items}));            
            $("#librarycontent table.groupactivity-report", rootel).tablesorter(
                {
                    headers: {
                        2: {
                            sorter: "customDate"
                        },
                        4: {
                            sorter: "customDate"
                        }
                    },
                    sortList: [[2,1]]
                }
            );
        }
               
        /////////////////////////////
        // Initialisation function //
        /////////////////////////////

        var renderMainDisplay = function(){
            //sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {                
                $(mainDisplay, rootel).show();
                $("#tabs",rootel).tabs();
            //});
        };

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

        loadDocStructure();    
        loadContentVisibleToGroup();
        
        renderMainDisplay();
        
        addBinding();

    };

    sakai.api.Widgets.widgetLoader.informOnLoad("groupactivity");
});
