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

// load the master sakai object to access all Sakai OAE API methods
require(["jquery", "sakai/sakai.api.core"], function($, sakai) {

    /**
     * @name sakai_global.participants
     *
     * @class participants
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.nyuparticipants = function (tuid, showSettings, widgetData) {

        var rootel = $("#" + tuid);

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////
        var NUM_PER_PAGE = 10,
            currentPage = 1,
            checkedParticipants = [],
            checkedParticipantsIDs = [],
            allParticipantsCache = [],
            prevAllParticipantsSearch = false,
            totalParticipants = 0,
            allPagesSelected = false;

        // Containers
        var $participantsListContainer = $("#participants_list_container", rootel);

        // Templates
        var participantsListTemplate = "participants_list_template";

        // Elements
        var $participantsSearchField = $("#participants_search_field", rootel);
        var participantsListParticipantRequestConnection = ".participants_list_participant_request_connection";
        var $participantsSelectAll = $("#participants_select_all", rootel);
        var participantsListParticipantCheckbox = ".participants_list_participant_checkbox input:checkbox";
        var $participantsSendSelectedMessage = $("#participants_send_selected_message", rootel);
        var participantsListParticipantName = ".participants_list_participant_name";
        var $participants_pager = $("#participants_pager", rootel);
        var $participants_sort_by = $("#participants_sort_by", rootel);
        var $participants_select_all = $("#participants_select_all", rootel);
        var $participants_select_all_container = $("#participants_select_all_container", rootel);
        var $participants_num_selected = $("#participants_num_selected", rootel);
        var $participants_select_all_pages = $("#participants_select_all_pages", rootel);
        var $participants_select_all_pages_button = $("#participants_select_all_pages button", rootel);
        var $participants_select_this_page = $("#participants_select_this_page", rootel);
        var $participants_select_this_page_button = $("#participants_select_this_page button", rootel);
        var $participants_total = $("#participants_total", rootel);


        ///////////////////////
        // Utility functions //
        ///////////////////////

        var enableDisableButtons = function(){
            if($(participantsListParticipantCheckbox + ":checked", rootel).length){
                $participantsSendSelectedMessage.removeAttr("disabled");
            } else {
                $participantsSendSelectedMessage.attr("disabled", "disabled");
                $participantsSelectAll.removeAttr("checked");
            }
        };

        /**
         * Set the attributes needed by the sendmessage widget to send a message to all selected users
         */
        var setSendSelectedMessageAttributes = function(){
            $participantsSendSelectedMessage.attr("sakai-entitytype", "user");
            $participantsSendSelectedMessage.attr("sakai-entityname", checkedParticipants);
            $participantsSendSelectedMessage.attr("sakai-entityid", checkedParticipantsIDs);
            enableDisableButtons();
        };

        var checkSingleParticipant = function(e) {
            var $this = $(e.target),
                thisID = $this.attr("id").split("_")[0],
                thisName = $this.parent().nextAll(participantsListParticipantName).text();
            if ($this.is(":checked")) {
                checkedParticipantsIDs.push(thisID);
                checkedParticipants.push(thisName);
            } else {
                $participants_select_all_container.hide();
                $participantsSelectAll.removeAttr("checked");
                checkedParticipantsIDs = _.without(checkedParticipantsIDs, thisID);
                checkedParticipants = _.without(checkedParticipants, thisName);
            }
            addAllSelectedOnPage();
        };

        /**
         * Check/Uncheck all items in the members list and enable/disable buttons
         */
        var checkAll = function(){
            if ($(this).is(":checked")) {
                $(participantsListParticipantCheckbox, rootel).attr("checked","checked");
                addAllSelectedOnPage();
            } else {
                selectNone();
            }
        };

        var selectNone = function() {
            allPagesSelected = false;
            $participants_select_all_container.hide();
            checkedParticipants = [];
            $(participantsListParticipantCheckbox, rootel).removeAttr("checked");
            enableDisableButtons();
        };

        var addAllSelectedOnPage = function() {
            allPagesSelected = false;
            checkedParticipants = [];
            checkedParticipantsIDs = [];
            $.each($(participantsListParticipantCheckbox + ":checked", rootel), function(index, item){
                checkedParticipantsIDs.push($(item).attr("id").split("_")[0]);
                checkedParticipants.push($(item).parent().nextAll(participantsListParticipantName).text());
            });
            setSendSelectedMessageAttributes();
            if (totalParticipants > NUM_PER_PAGE && $(participantsListParticipantCheckbox + ":checked", rootel).length === $(participantsListParticipantCheckbox, rootel).length) {
                toggleSelectAll(true);
            }
        };

        var toggleSelectAll = function(showSelectall) {
            $participants_select_all_container.show();
            if (showSelectall) {
                $participants_select_this_page.hide();
                $participants_num_selected.text($(participantsListParticipantCheckbox, rootel).length);
                $participants_select_all_pages.show();
            } else {
                $participants_select_all_pages.hide();
                $participants_select_this_page.show();
            }
        };

        var checkAllPages = function() {
            allPagesSelected = true;
            if (prevAllParticipantsSearch === $.trim($participantsSearchField.val())) {
                selectAllParticipants(allParticipantsCache);
            } else {
                $participants_select_all_pages.addClass("participants_searching");
                sakai.api.Groups.searchMembers(widgetData.participants.groupid, $.trim($participantsSearchField.val()), 1000000000, 0, "firstName", $participants_sort_by.val(), function(success, data) {
                    $participants_select_all_pages.removeClass("participants_searching");
                    prevAllParticipantsSearch = $.trim($participantsSearchField.val());
                    allParticipantsCache = data.results;
                    selectAllParticipants(data.results);
                });
            }
        };

        var selectAllParticipants = function(participants) {
            toggleSelectAll(false);
            $participants_total.text(participants.length);
            checkedParticipants = [];
            checkedParticipantsIDs = [];
            $.each(participants, function(i, auth) {
                var authID, authDisplayName;
                if (auth.userid) {
                    authID = auth.userid;
                    authDisplayName = sakai.api.User.getDisplayName(auth);
                } else if (auth.groupid) {
                    authID = auth.groupid;
                    authDisplayName = auth["sakai:group-title"];
                }
                checkedParticipantsIDs.push(authID);
                checkedParticipants.push(authDisplayName);
            });
            setSendSelectedMessageAttributes();
        };

        //////////////////////
        // Render functions //
        //////////////////////

        var renderParticipants = function (success, data){
            var extraFields = sakai.widgets.nyuparticipants.defaultConfiguration.extraFields;
            if (success) {
                if (data && data.results && data.results.length) {
                    sakai.api.User.getContacts(function() {
                        var participantsArr = [];
                        for (var i = 0; i < data.results.length; i++) {
                            var contentCount = 0;
                            var contactsCount = 0;
                            var membershipsCount = 0;
                            if (data.results[i].counts){
                                contentCount = data.results[i].counts.contentCount;
                                contactsCount = data.results[i].counts.contactsCount;
                                membershipsCount = data.results[i].counts.membershipsCount;
                            }
                            if (data.results[i]["sakai:group-id"]) {
                                participantsArr.push({
                                    "name": data.results[i]["sakai:group-title"],
                                    "id": data.results[i]["sakai:group-id"],
                                    "title": data.results[i].role.title,
                                    "type": "group",
                                    "connected": false,
                                    "content": contentCount,
                                    "contacts": contactsCount,
                                    "memberships": membershipsCount,
                                    "profilePicture": sakai.api.Groups.getProfilePicture(data.results[i]),
                                    "membersCount": data.results[i].counts.membersCount
                                });
                            } else {
                                // Check if this user is a friend of us already.
                                var connected = false, invited = false, pending = false, none = false;
                                var user = data.results[i];
                                if (sakai.data.me.mycontacts) {
                                    for (var ii = 0, jj = sakai.data.me.mycontacts.length; ii<jj; ii++) {
                                        var friend = sakai.data.me.mycontacts[ii];
                                        if (friend.target === user["rep:userId"]) {
                                            connected = true;
                                            // if invited state set invited to true
                                            if(friend.details["sakai:state"] === "INVITED"){
                                                invited = true;
                                            } else if(friend.details["sakai:state"] === "PENDING"){
                                                pending = true;
                                            } else if(friend.details["sakai:state"] === "NONE"){
                                                none = true;
                                            }
                                        }
                                    }
                                }
                                var userToPush = {
                                    "name": sakai.api.User.getDisplayName(user),
                                    "id": user["rep:userId"],
                                    "title": user.role.title,
                                    "type": "user",
                                    "content": contentCount,
                                    "contacts": contactsCount,
                                    "memberships": membershipsCount,
                                    "connected": connected,
                                    "invited": invited,
                                    "pending": pending,
                                    "none": none,
                                    "profilePicture": sakai.api.User.getProfilePicture(data.results[i])
                                };
                                // Get the extra info and push it on to the users
                                if (widgetData.participants.showExtraInfo) {
                                    var userExtraFields = [];
                                    $.each(extraFields, function(idx,field) {
                                        var val = sakai.api.User.getProfileBasicElementValue(user, field.key);
                                        var searchVal = val;
                                        // The select element type is special, and requires that we get the i18n key
                                        // from the basic profile config, since it only stores the key and not
                                        // the value in the basic profile
                                        if (sakai.config.Profile.configuration.defaultConfig.basic.elements[field.key] &&
                                            sakai.config.Profile.configuration.defaultConfig.basic.elements[field.key].type === "select") {

                                            val = sakai.config.Profile.configuration.defaultConfig.basic.elements[field.key].select_elements[val];
                                            val = sakai.api.i18n.General.process(val);
                                        }
                                        if (val) {
                                            userExtraFields.push({
                                                "title": sakai.api.i18n.General.getValueForKey(field.title),
                                                "value": field.key === "sakai:tags" ? val = sakai.api.Util.formatTags(val) : sakai.api.Util.applyThreeDots(val, 650, {max_rows: 2, whole_word: false}, "participants_list_extra_field"),
                                                "isTag": field.key === "sakai:tags",
                                                "searchable": field.searchable,
                                                "searchField": searchVal
                                            });
                                        }
                                    });
                                    if (userExtraFields.length) {
                                        userToPush.extraFields = userExtraFields;
                                    }
                                }
                                participantsArr.push(userToPush);
                            }
                        }
                        $participantsListContainer.html(sakai.api.Util.TemplateRenderer(participantsListTemplate, {
                            "participants": participantsArr,
                            "sakai": sakai
                        }));
                        selectNone();
                        totalParticipants = data.total;
                        if (data.total > NUM_PER_PAGE) {
                            $participants_pager.pager({ pagenumber: currentPage, pagecount: Math.ceil(data.total/NUM_PER_PAGE), buttonClickCallback: handlePageClick }).show();
                        } else {
                            $participants_pager.empty();
                        }
                    }, 1000);
                } else {
                    $participantsListContainer.html(sakai.api.Util.TemplateRenderer(participantsListTemplate, {
                        "participants": [],
                        "sakai": sakai
                    }));
                    $participants_pager.empty();
                }
            } else {
                debug.warn("Participants could not be loaded");
            }
        };

        var handlePageClick = function(pageNum) {
            if (pageNum !== currentPage) {
                currentPage = pageNum;
                loadParticipants();
            }
        };

        ////////////////////
        // Init functions //
        ////////////////////

        var loadParticipants = function(){
            // current search term
            var searchTerm = $.trim($participantsSearchField.val());
            // add busy spinner
            $participantsSearchField.addClass("participants_searching");
            // ensure current search is the one to render
            // otherwise ignore and presume other search is running
            var preRenderParticipants = function(success, data) {
                if (searchTerm === $.trim($participantsSearchField.val())) {
                    renderParticipants(success, data);
                    $participantsSearchField.removeClass("participants_searching");
                }
            };
            sakai.api.Groups.searchMembers(widgetData.participants.groupid, searchTerm, NUM_PER_PAGE, currentPage-1, "firstName", $participants_sort_by.val(), preRenderParticipants);
        };

        var searchTimeout = null;

        var addBinding = function(){
            $participantsSearchField.unbind("keyup").bind("keyup", function() {
                $(participantsListParticipantCheckbox, rootel).removeAttr("checked");
                $participantsSelectAll.removeAttr("checked");
                $participants_select_all_container.hide();

                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                searchTimeout = setTimeout(function() {
                    currentPage = 1;
                    loadParticipants();
                }, 400);
            });
            $participants_sort_by.unbind("change").bind("change", loadParticipants);
            $participantsSelectAll.unbind("click").bind("click", checkAll);
            $(participantsListParticipantCheckbox, rootel).live("click", checkSingleParticipant);

            $(".participants_accept_invitation").live("click", function(ev){
                var userid = $(this).attr("sakai-entityid");
                sakai.api.User.acceptContactInvite(userid, function(){
                    $('.participants_accept_invitation').each(function(index) {
                        if ($(this).attr("sakai-entityid") === userid){
                            $(this).hide();
                        }
                    });
                });
            });

            $(window).bind("sakai.addToContacts.requested", function(ev, userToAdd){
                $('.sakai_addtocontacts_overlay').each(function(index) {
                    if ($(this).attr("sakai-entityid") === userToAdd.uuid){
                        $(this).hide();
                    }
                });
            });
            $participants_select_all_pages_button.unbind("click").bind("click", checkAllPages);
            $participants_select_this_page_button.unbind("click").bind("click", addAllSelectedOnPage);
        };

        var init = function(){
            addBinding();
            loadParticipants();
        };

        $(window).bind("usersselected.addpeople.sakai", function(){
            var t = setTimeout(loadParticipants, 2000);
        });

        init();

    };

    // inform Sakai OAE that this widget has loaded and is ready to run
    sakai.api.Widgets.widgetLoader.informOnLoad("nyuparticipants");
});
