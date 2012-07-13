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
 * /dev/lib/jquery/plugins/jqmodal.sakai-edited.js
 * /dev/lib/misc/trimpath.template.js (TrimpathTemplates)
 */
/*global $ */


require(["jquery", "sakai/sakai.api.core"], function($, sakai) {

    /**
     * @name sakai_global.groupbasicinfo
     *
     * @class groupbasicinfo
     *
     * @description
     * Initialize the groupbasicinfo widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.groupbasicinfo = function(tuid, showSettings, widgetData){

        ///////////////////
        // CSS Selectors //
        ///////////////////

        var $rootel = $("#" + tuid);
        var $groupbasicinfo_generalinfo = $("#groupbasicinfo_generalinfo", $rootel);
        var groupbasicinfo_buttons = "#groupbasicinfo_editing";
        var groupbasicinfo_dontupdate = "#groupbasicinfo_editing_button_dontupdate";
        var groupbasicinfo_update = "#groupbasicinfo_editing_button_update";

        // Fields that will contain the group data
        var groupBasicInfoGroup = "#groupbasicinfo_generalinfo_group";
        var groupBasicInfoGroupTitle = groupBasicInfoGroup + "_title";
        var groupBasicInfoGroupKind = groupBasicInfoGroup + "_kind";
        var groupBasicInfoGroupTags = groupBasicInfoGroup + "_tags";
        var groupBasicInfoGroupDesc = groupBasicInfoGroup + "_description";
        var groupBasicInfoGroupJoinable = groupBasicInfoGroup + "_joinable";
        var groupBasicInfoGroupVisible = groupBasicInfoGroup + "_visible";

        var directoryJSON = [];
        var json = {};

        var groupBasicInfoAddAnotherLocation = "#groupbasicinfo_add_another_location";
        var groupBasicInfoAddAnotherLocationtext = "#groupbasicinfo_add_another_location_text";
        var groupBasicInfoAddAnotherLocationLink = groupBasicInfoAddAnotherLocation + "_link";

        var groupBasicInfoSavedInfo = ".groupbasicinfo_saveddirectory";

        var groupId = sakai.api.Util.extractEntity(window.location.pathname);
        var groupData = {};


        //////////////////////
        // Render functions //
        //////////////////////

        /**
         * Render the template for group basic info
         */
        var renderTemplateBasicInfo = function(){
            var json = processTagsAndDirectory();
            json.sakai = sakai;
            $groupbasicinfo_generalinfo.html(sakai.api.Util.TemplateRenderer("#groupbasicinfo_default_template", json));
        };

        /**
         * Fetch group data
         */
        var getGroupData = function(callback){
            sakai.api.Groups.getGroupData(groupId, function(success, data) {
                if (success) {
                    groupData = data;
                    renderTemplateBasicInfo();
                }
                if ($.isFunction(callback)) {
                    callback(success);
                }
            });
        };

        //////////////////////////////
        // Update Group Information //
        //////////////////////////////

        var processTagsAndDirectory = function(){
            // Extract tags that start with "directory:"
            var directory = [];
            var tags = [];
            $(groupData.authprofile["sakai:tags"]).each(function(i){
                var splitDir = groupData.authprofile["sakai:tags"][i].split("/");
                if (splitDir[0] === "directory") {
                    var title = "";
                    var curLocation = [];
                    for (var j = 1; j < splitDir.length; j++) {
                        if (splitDir.hasOwnProperty(j)) {
                            title += sakai.api.Util.getValueForDirectoryKey(splitDir[j]);
                            curLocation.push(splitDir[j]);
                        }
                        if (j < splitDir.length - 1){
                            title += "<span class='groupbasicinfo_location_divider'>&raquo;</span>";
                        }
                    }
                    directoryJSON.push(curLocation);
                    directory.push({
                        "locationtitle": {
                            "value": groupData.authprofile["sakai:tags"][i],
                            "title": title
                        },
                        "id": {
                            "display": false,
                            "value": "" + Math.round(Math.random() * 1000000000)
                        }
                    });
                } else {
                    tags.push(groupData.authprofile["sakai:tags"][i]);
                }
            });
            groupData.authprofile.directory = directory;
            groupData.authprofile.saveddirectory = directoryJSON;
            // Get the group information out of the global group info object
            json = {
                "groupid" : groupId,
                "url" : document.location.protocol + "//" + document.location.host + "/~" + groupId,
                "data" : groupData.authprofile,
                "tags" : tags,
                "directory" : directory
            };
            return json;
        };

        ////////////////////
        // Initialization //
        ////////////////////

        var doInit = function() {
            getGroupData(function() {
                renderTemplateBasicInfo();
            });
        };
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("groupbasicinfo");
});
