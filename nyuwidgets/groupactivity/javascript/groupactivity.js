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

        /////////////////////////////
        // Initialisation function //
        /////////////////////////////

        var renderMainDisplay = function(){
            //sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {                
                $(mainDisplay, rootel).show();
            //});
        };

        renderMainDisplay();
        addBinding();

    };

    sakai.api.Widgets.widgetLoader.informOnLoad("groupactivity");
});
