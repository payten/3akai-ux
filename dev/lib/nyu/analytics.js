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
require(["jquery","sakai/sakai.api.core"], function($, sakai) {

    var addBindings = function() {
        $(window).bind('showpage.contentauthoring.sakai', log);
    };

    var log = function() {
        data = {};

        if (sakai_global.group) {
            data.groupId = sakai_global.group.groupId;
            data.context = 'group';
        }

        if (sakai_global.profile) {
            data.userId = sakai_global.profile.main.data.userid;
        }

        if (sakai_global.lhnavigation && sakai_global.lhnavigation.getCurrentPage()) {
            data.page_title = sakai_global.lhnavigation.getCurrentPage().title;
        }

        if (sakai_global.content_profile &&
            sakai_global.content_profile.content_data &&
            sakai_global.content_profile.content_data.data) {
            data.path = sakai_global.content_profile.content_data.data['_path'];
            data.description = sakai_global.content_profile.content_data.data['sakai:description'];
            data.context = 'content';
        }

        var worth_sending = false;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key]) {
                    worth_sending = true;
                } else {
                    delete data[key];
                }
            }
        }

        if (worth_sending) {
                $.ajax({
                    url: '/system/analytics',
                    type: "POST",
                    cache: false,
                    data: {data: JSON.stringify(data)}
                });
        }
    };

    addBindings();   
});