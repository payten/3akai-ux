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

/*global $ */

require(["jquery", "sakai/sakai.api.core"], function($, sakai) {

    sakai_global.tagcloud = function(tuid, showSettings) {

        var $rootel = $("#"+tuid),
            $tagcloud_main = $("#tagcloud_main", $rootel),
            $tagcloud_main_template = $("#tagcloud_main_template", $rootel);

        var generateTagCloud = function(success, tagData){
            var newtags = [];
            // Filter out directory tagcloud
            if (tagData.results.length && tagData.results[0].tags) {
                for (var i = 0; i < tagData.results[0].tags.length; i++) {
                    if (tagData.results[0].tags[i].name.substring(0, 10) !== "directory/") {
                        newtags.push(tagData.results[0].tags[i]);
                    }
                }
                tagData.results[0].tags = newtags;
                // Sort the tagcloud in alphabetical order so we can generate a tag cloud
                tagData.results[0].tags.sort(function(a, b){
                    var nameA = a.name.toLowerCase();
                    var nameB = b.name.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
            }
            $tagcloud_main.html(sakai.api.Util.TemplateRenderer($tagcloud_main_template, {data: tagData})).show();
        };

        var loadData = function(callback){
            if (sakai_global.group && sakai_global.group.groupData && sakai_global.group.groupData["sakai:group-id"]) {
                $.ajax({
                    url: "/var/search/public/tagcloud.json?group=" + sakai_global.group.groupData["sakai:group-id"],
                    cache: false,
                    success: function(data){
                        callback(true, data);
                    }
                });
            }
        };

        var doInit = function(){
            if (showSettings) {
                sakai.api.Widgets.Container.informFinish(tuid, "tagcloud");
            }
            loadData(generateTagCloud);
        };

        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("tagcloud");
});
