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
     * @name sakai_global.openbadges
     *
     * @class openbadges
     *
     * @description
     * Initialize the openbadges widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.openbadges = function(tuid){

        var widgetData = {};

        ///////////////////
        // CSS Selectors //
        ///////////////////

        var $rootel = $("#" + tuid);
        var $display = $("#openbadges_display", $rootel);
        var $groupSelectorContainer = $(".groupselector-container", $display);
        var $badgesContainer = $(".badges-container", $display);
        
        ////////////////////
        // Event Handlers //
        ////////////////////
        var addBinding = function() {
            $("#groupselector", $rootel).live("change", function() {                
                if ($(this).val() === "") {
                    $badgesContainer.empty();
                } else {
                    $.getJSON("/openbadges/badges?userid="+widgetData.userId+"&groupid="+$(this).val(), function(data) {
                        $badgesContainer.html(sakai.api.Util.TemplateRenderer("openbadges_badges_template", data));
                    });
                }
            })
        }
        
        ///////////////
        //   Methods //
        ///////////////
        function renderGroupSelector() {
            $.getJSON("/openbadges/groups?userid="+widgetData.userId, function(data) {
                if (data.groups.length === 0) {
                    $groupSelectorContainer.html("No public groups currently being shared");
                } else {
                    $groupSelectorContainer.html(sakai.api.Util.TemplateRenderer("openbadges_groupselector_template", data));
                }
            })
        }
        
        function renderBadges(badges) {
            $badgesContainer.append(sakai.api.Util.TemplateRenderer("openbadges_badges_template", badges));
        }
        
        function checkForOpenBadgesId() {
            sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {
                if (success) {
                    widgetData = data;
                    renderGroupSelector();
                } else {
                    // attempt to get an open badges id for this user
                    $.ajax({
                        url: "/openbadges/id",
                        data: {
                            userid: sakai_global.profile.main.data.userid
                        },
                        type: "GET",
                        dataType: "json",
                        success: function(data) {
                            sakai.api.Widgets.saveWidgetData(tuid, data, function() {
                                widgetData = data;
                                renderGroupSelector();
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            debugger;
                        }
                    });
                }
            });
        }


        ////////////////////
        // Initialization //
        ////////////////////

        var doInit = function() {
            checkForOpenBadgesId();
            addBinding();
        };
        
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("openbadges");
});
