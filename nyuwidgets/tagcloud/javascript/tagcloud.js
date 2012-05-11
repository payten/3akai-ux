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

require(["jquery", "sakai/sakai.api.core", "/nyuwidgets/tagcloud/lib/jquery.jqcloud.js"], function($, sakai) {

    sakai_global.tagcloud = function(tuid, showSettings) {

        var $rootel = $("#"+tuid),
            $tagcloud_main = $("#tagcloud_main", $rootel),
            $tagcloud_cloud = $(".tagcloud-cloud", $rootel),
            $tagcloud_list = $(".tagcloud-list", $rootel),
            $tagcloud_main_template = $("#tagcloud_list_template", $rootel),            
            $nottagsfound_msg = $("#tagcloud_notagsfound_message", $rootel),
            $notalltagsdisplayed_msg = $("#tagcloud_notalltagsdisplayed_message", $rootel),
            MAX_TAGS_IN_CLOUD = 20,
            groupId = "";

        var generateTagCloud = function(success, tagData){
            var tagArray = [];
            // Filter out directory tagcloud
            if ( tagData.facet_fields && tagData.facet_fields.length && tagData.facet_fields[ 0 ].tagname && tagData.facet_fields[ 0 ].tagname.length) {
                for (var i=0; i<tagData.facet_fields[0].tagname.length; i++) {
                    var tag =  sakai.api.Util.formatTags( $.map(tagData.facet_fields[0].tagname[i], function(v,k) {return k;})[ 0 ] )[ 0 ];
                    tag.count = tagData.facet_fields[0].tagname[i][tag["original"]];
                    tagArray.push( tag );
                };

                // Sort the tagcloud in order of magnitude/hits for the tag cloud
                tagArray.sort(function(a, b){
                    var countA = a.count;
                    var countB = b.count;
                    if (countA > countB) {
                        return -1;
                    }
                    if (countA < countB) {
                        return 1;
                    }
                    return 0;
                });

                var tagDataForCloud = [];
                for (var i=0; i<tagArray.length;i++) {
                    if (i === MAX_TAGS_IN_CLOUD) {
                        break;
                    }
                    tagDataForCloud.push({
                        text: tagArray[i].original,
                        title: tagArray[i].original+ " has "+tagArray[i].count+" matches",
                        weight: tagArray[i].count,
                        url: "/~"+groupId+"#l=library&lq="+tagArray[i].value
                    });
                }

                $tagcloud_cloud.jQCloud(tagDataForCloud, {
                    height: 240,
                    width: 710
                });

                if (tagArray.length > MAX_TAGS_IN_CLOUD) {
                    $tagcloud_cloud.append($notalltagsdisplayed_msg.html());
                }

                // Sort the tagcloud in alphabetical order for the tag list
                tagArray.sort(function(a, b){
                    var nameA = a.value.toLowerCase();
                    var nameB = b.value.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                // render the list
                $tagcloud_list.html(sakai.api.Util.TemplateRenderer($tagcloud_main_template, {data: tagArray, groupId: groupId}));

                // bind toolbar events
                $(".s3d-search-results-cloudview", $rootel).on("click", function() {
                    $(this).parents(".s3d-header-button:first").find("div").removeClass("selected");
                    $(this).addClass("selected").parent().addClass("selected");
                    $tagcloud_list.hide();
                    $tagcloud_cloud.show();
                });

                $(".s3d-search-results-listview", $rootel).on("click", function() {
                    $(this).parents(".s3d-header-button:first").find("div").removeClass("selected");
                    $(this).addClass("selected").parent().addClass("selected");
                    $tagcloud_cloud.hide();
                    $tagcloud_list.show();
                });                

                // show something
                $(".s3d-listview-options", $rootel).show();
                $tagcloud_cloud.show();
            } else {
                // no tags!
                $(".s3d-listview-options", $rootel).hide();
                $tagcloud_main.html($nottagsfound_msg.html())
            }
        };

        var loadData = function(callback){
            if (sakai_global.group && sakai_global.group.groupData && sakai_global.group.groupData["sakai:group-id"]) {
                groupId = sakai_global.group.groupData["sakai:group-id"];
                $.ajax({
                    url: "/var/search/public/tagcloud.json?group=" + groupId,
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
