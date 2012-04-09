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
define(["config/config"], function(config) {

    // Custom CSS Files to load in
    config.skinCSS = ["/dev/skins/nyu/nyu.skin.css"];

    // Don't display errors
    config.displayDebugInfo = false;

    /**
     * Disable anonymous access
     */
    config.anonAllowed = false;
    config.anonAllowable = ["/", "/dev", "/index", "/acknowledgements"];
    config.anonAllowedToSearch = false;
    config.anonAllowedToBrowse = false;
        
    /**
     * Navigation
     */
    config.Navigation[0].label = "ME";

    /**
     * World Templates
     */
    config.adminOnlyTemplates = ["course", "portfolio"];

    /**
     * Footer Links
     */

    // leftLinks[1] is the Help link
    config.Footer.leftLinks[1].href = "http://www.nyu.edu/its/pilot/atlas/";
    // rightLinks[0] is the Browse link
    config.Footer.rightLinks[0].href = "/search";

    // Languages - only allow English
    config.Languages = [config.Languages[3]];

    /**
     * Categories
     */
    config.enableCategories = false;
    config.Navigation[2].subnav.splice(0,2);
    config.Navigation[3].subnav.splice(0,2);

    /**
     * User Profile
     */

    // Don't show categories
    delete config.Profile.configuration.defaultConfig.locations;
    config.Profile.configuration.defaultConfig.publications.order = 2;

    // Make first and last name read-only
    config.Profile.configuration.defaultConfig.basic.elements.firstName.editable = false;
    config.Profile.configuration.defaultConfig.basic.elements.lastName.editable = false;

    // Hide Email
    config.Profile.configuration.defaultConfig.basic.elements.email.display = false;

    config.Profile.configuration.defaultConfig.basic.elements.role.select_elements = {
        "academic_administrator_staff": "__MSG__PROFILE_BASIC_ROLE_ACADEMIC_ADMINISTRATOR_STAFF_LABEL__",
        "faculty": "__MSG__FACULTY_LABEL__",
        "graduate_student": "__MSG__PROFILE_BASIC_ROLE_GRADUATE_STUDENT_LABEL__",
        "undergraduate_student": "__MSG__PROFILE_BASIC_ROLE_UNDERGRADUATE_STUDENT_LABEL__",
        "non_academic_staff": "__MSG__PROFILE_BASIC_ROLE_NON_ACADEMIC_ADMINISTRATOR_STAFF_LABEL__",
        "postgraduate_student": "__MSG__PROFILE_BASIC_ROLE_POSTGRADUATE_STUDENT_LABEL__",
        "research_staff": "__MSG__PROFILE_BASIC_ROLE_RESEARCH_STAFF_LABEL__",
        "other": "__MSG__PROFILE_BASIC_ROLE_OTHER_LABEL__"
    };

    config.Profile.configuration.defaultConfig.basic.elements = {
        "firstName": {
            "label": "__MSG__PROFILE_BASIC_FIRSTNAME_LABEL__",
            "required": true,
            "display": true,
            "editable": false,
            "limitDisplayLength": 50
        },
        "lastName": {
            "label": "__MSG__PROFILE_BASIC_LASTNAME_LABEL__",
            "required": true,
            "display": true,
            "editable": false,
            "limitDisplayLength": 50
        },
        "picture": {
            "label": "__MSG__PROFILE_BASIC_PICTURE_LABEL__",
            "required": false,
            "display": false
        },
        "preferredName": {
            "label": "__MSG__PROFILE_BASIC_PREFERREDNAME_LABEL__",
            "required": false,
            "display": true
        },
        "email": {
            "label": "__MSG__PROFILE_BASIC_EMAIL_LABEL__",
            "required": false,
            "display": false,
            "type": "email"
        },
        "status": {
            "label": "__MSG__PROFILE_BASIC_STATUS_LABEL__",
            "required": false,
            "display": false
        },
        "role": {
            "label": "__MSG__PROFILE_BASIC_ROLE_LABEL__",
            "required": false,
            "display": true,
            "type": "select",
            "select_elements": {
                "academic_administrator_staff": "__MSG__PROFILE_BASIC_ROLE_ACADEMIC_ADMINISTRATOR_STAFF_LABEL__",
                "faculty": "__MSG__FACULTY_LABEL__",
                "graduate_student": "__MSG__PROFILE_BASIC_ROLE_GRADUATE_STUDENT_LABEL__",
                "undergraduate_student": "__MSG__PROFILE_BASIC_ROLE_UNDERGRADUATE_STUDENT_LABEL__",
                "non_academic_staff": "__MSG__PROFILE_BASIC_ROLE_NON_ACADEMIC_ADMINISTRATOR_STAFF_LABEL__",
                "postgraduate_student": "__MSG__PROFILE_BASIC_ROLE_POSTGRADUATE_STUDENT_LABEL__",
                "research_staff": "__MSG__PROFILE_BASIC_ROLE_RESEARCH_STAFF_LABEL__",
                "other": "__MSG__PROFILE_BASIC_ROLE_OTHER_LABEL__"
            }
        },
        "college": {
            "label": "__MSG__PROFILE_BASIC_SCHOOL_COLLEGE_LABEL__",
            "required": false,
            "display": true,
            "type": "select",
            "select_elements": {
                "arts_science_college_of_a_s": "Arts & Science: College of Arts and Science",
                "arts_science_liberal_studies": "Arts & Science: Liberal Studies",
                "arts_science_graduate": "Arts & Science: Graduate School of Arts and Science",
                "dentistry":"College of Dentistry",
                "nursing": "College of Nursing",
                "courant": "Courant Institute of Mathematical Sciences",
                "gallatin": "Gallatin School of Individualized Study",
                "fine_arts": "Institute of Fine Arts",
                "ancient_world": "Institute for the Study of the Ancient World",
                "stern": "Leonard N. Stern School of Business",
                "abu_dhabi": "NYU Abu Dhabi",
                "polytechnic": "Polytechnic Institute",
                "wagner": "Robert F. Wagner Graduate School of Public Service",
                "professional_studies": "School of Continuing and Professional Studies",
                "law": "School of Law",
                "medicine": "School of Medicine",
                "silver": "Silver School of Social Work",
                "steinhardt": "Steinhardt School of Culture, Education, and Human Development",
                "tisch": "Tisch School of the Arts"
            }
        },
        "department": {
            "label": "__MSG__PROFILE_BASIC_DEPARTMENT_LABEL__",
            "required": false,
            "display": true
        },
        "academicinterests": {
            "label": "__MSG__PROFILE_ABOUTME_ACADEMICINTERESTS_LABEL__",
            "required": false,
            "display": true,
            "type": "textarea"
        },
        "tags": {
            "label": "__MSG__TAGS__",
            "required": false,
            "display": true,
            "type": "tags",
            "tagField": true
        }
    };

    // About Me
    delete config.Profile.configuration.defaultConfig.aboutme.elements.academicinterests;
    config.Profile.configuration.defaultConfig.aboutme.permission = "contacts";

    // publications
    config.Profile.configuration.defaultConfig.publications.permission = "everyone";
    config.Profile.configuration.defaultConfig.publications.elements.placeofpublication.required = false;
    config.Profile.configuration.defaultConfig.publications.elements.maintitle.label += "*";
    config.Profile.configuration.defaultConfig.publications.elements.mainauthor.label += "*";
    config.Profile.configuration.defaultConfig.publications.elements.publisher.label = "__MSG__PUBLISHER_JOURNAL_TITLE__*";
    config.Profile.configuration.defaultConfig.publications.elements.year.label += "*";

    // Content
    config.Permissions.Content.defaultaccess = "private";
    config.Permissions.Documents.defaultaccess = "private";
    config.Permissions.Links.defaultaccess = "private";

    config.Permissions.Copyright.types.unspecified = {
        "title": "COPYRIGHT_NOT_SPECIFIED"
    };
    config.Permissions.Copyright.defaults["content"] = "unspecified";
    config.Permissions.Copyright.defaults["sakaidocs"] = "unspecified";
    config.Permissions.Copyright.defaults["links"] = "unspecified";

    /**
     * Contact relationships
     */
    config.Relationships.contacts = [{
         "name": "Classmate",
         "definition": "is my classmate",
         "selected": false
     }, {
         "name": "Lecturer",
         "inverse": "Student",
         "definition": "is my instructor",
         "selected": false
     }, {
         "name": "Student",
         "inverse": "Lecturer",
         "definition": "is my student",
         "selected": false
     }, {
         "name": "Advisor",
         "inverse": "Advisee",
         "definition": "is my advisor",
         "selected": false
     }, {
         "name": "Advisee",
         "inverse": "Advisor",
         "definition": "is my advisee",
         "selected": false
     }, {
         "name": "Colleague",
         "definition": "is my colleague",
         "selected": false
     }, {
         "name": "College Mate",
         "definition": "is a fellow student",
         "selected": false
     }, {
         "name": "Shares Interests",
         "definition": "shares an interest with me",
         "selected": false
     }, {
         "name": "Other",
         "definition": "other",
         "selected": false
     }];


    /**
     * Add our custom user areas
     */
    config.defaultpubstructure["structure0"]["wall"] = {
        "_title": "__MSG__USER_PUBLIC_DASHBOARD_TITLE__",
        "_altTitle": "__MSG__USER_PUBLIC_DASHBOARD_ALT_TITLE__",
        "_order": -1,
        "_view": "anonymous",
        "_canEdit": true,
        "_reorderOnly": true,
        "_nonEditable": true,
        "_ref": "${refid}3",
        "main": {
            "_ref": "${refid}3",
            "_order": 0,
            "_title": "__MSG__USER_PUBLIC_DASHBOARD_TITLE__"
        }
    };
    config.defaultpubstructure["${refid}3"] = {
        "page": "<div class='fl-force-right dashboard-admin-actions' style='display:none;'><button type='button' class='s3d-button s3d-margin"+
                "-top-5 s3d-header-button s3d-header-smaller-button dashboard_change_layout' dat"+
                "a-tuid='${refid}4'>__MSG__EDIT_LAYOUT__</button><button type='button' class='s3d-button "+
                "s3d-margin-top-5 s3d-header-button s3d-header-smaller-button dashboard_global_a"+
                "dd_widget' data-tuid='${refid}4'>__MSG__ADD_WIDGET__</button></div><div class='s3d-conte"+
                "ntpage-title'>__MSG__USER_PUBLIC_DASHBOARD_TITLE__</div><div id='widget_dashboard_${refid}4' class='widget_inline'></div>"    
    };
    config.defaultpubstructure["${refid}4"] = {
        "dashboard": {
            "layout": "threecolumn",
            "columns": {
                "column1": [],
                "column2": [],
                "column3": []
            }
        }
    }

    /**
     * Authentication
     */
    config.Authentication.internal = true;
    config.Authentication.allowInternalAccountCreation = false;
    config.allowPasswordChange = false;

    // map of SSO enabled hosts to their
    // respective SSO service URL
    var ssoEnabledHosts = {
        // "devatlasapp1.home.nyu.edu": {url: "https://devsso.home.nyu.edu/sso/saml2/jsp/idpSSOInit.jsp?metaAlias=/idp&spEntityID=http://devatlasapp1.home.nyu.edu:8080/system/sling/samlauth/login", followLogoutRedirects: true},
        // "devatlas.home.nyu.edu": {url: "https://devsso.home.nyu.edu/sso/saml2/jsp/idpSSOInit.jsp?metaAlias=/idp&spEntityID=http://devatlasapp1.home.nyu.edu:8080/system/sling/samlauth/login", followLogoutRedirects: true},
        "stageatlas.home.nyu.edu": {url:"https://aqa.home.nyu.edu/sso/saml2/jsp/idpSSOInit.jsp?metaAlias=/idp2&spEntityID=https://stageatlas.home.nyu.edu:443/system/sling/samlauth/login", followLogoutRedirects: true},
        "atlas.nyu.edu": {url: "https://login.nyu.edu/sso/saml2/jsp/idpSSOInit.jsp?metaAlias=/idp1&spEntityID=https://atlas.nyu.edu:443/system/sling/samlauth/login", followLogoutRedirects: true}
    };
    // setup SSO if current host is SSO enabled
    if (ssoEnabledHosts.hasOwnProperty(document.location.hostname)) {
        config.followLogoutRedirects = ssoEnabledHosts[document.location.hostname]['followLogoutRedirects'] === true;
        config.Authentication.internal = false;
        config.Authentication.external = [{
            label: "NYU Single Sign On",
            url: "/system/sling/samlauth/login?resource=",
            appendCurrentLocation: true
        }];
        config.Authentication.SSO = {
            enabled: true,
            cookieName: "iPlanetDirectoryPro",
            redirectUrl: ssoEnabledHosts[document.location.hostname]['url'] +"&RelayState=",
            appendCurrentLocation: true
        };
    }

    /**
     * Error page links
     */
    config.ErrorPage = {
     /*
      * These links are displayed in the 403 and 404 error pages.
      */
        Links: {
            whatToDo: [{
                "title": "EXPLORE_THE_INSTITUTION",
                "url": "/index"
            }, {
                "title": "VIEW_THE_INSTITUTION_WEBSITE",
                "url": "http://www.nyu.edu/"
            }, {
                "title": "VISIT_THE_SUPPORT_FORUM",
                "url": "http://www.nyu.edu/its/pilot/atlas/"
            }],
            getInTouch: [{
                "title": "SEND_US_YOUR_FEEDBACK",
                "url": "http://www.nyu.edu/its/pilot/atlas/"
            }, {
                "title": "CONTACT_SUPPORT",
                "url": "http://www.nyu.edu/its/pilot/atlas/"
            }]
        }
    };

    /**
     * Add extra navigation items
     */
    config.Navigation[0]["subnav"].push({
        "url": "https://admin.portal.nyu.edu/psp/paprod/EMPLOYEE/EMPL/h/?tab",
        "id": "subnavigation_gradecenter_link",
        "label": "MY_GRADECENTER",
        "pseudogroup": "g-gradecenter",
        "opennewwindow": "true"
    });
    config.Navigation[0]["subnav"].push({
        "id": "subnavigation_hr",
        "pseudogroup": "g-gradecenter"
    });
    config.Navigation[0]["subnav"].splice(3,0, {
        "url": "/me#l=wall",
        "id": "subnavigation_mywall_link",
        "label": "USER_PUBLIC_DASHBOARD_TITLE"
    });

    /**
    * Kaltura Settings
    */
    config.MimeTypes["kaltura/video"].description = "KALTURA_VIDEO_FILE";
    config.MimeTypes["kaltura/audio"].description = "KALTURA_AUDIO_FILE";
    config.kaltura = {
        enabled: true,
        serverURL:  "http://kvapi.home.nyu.edu",
        partnerId:  141,
        playerId: 4422411
    };
    
    /**
     * Tag list for autocomplete
     */
    config.NYUTagList = [
        {value: "Area Studies"},
        {value: "Art History"},
        {value: "Arts and Social Change"},
        {value: "Business"},
        {value: "Communications"},
        {value: "Community Studies"},
        {value: "Cultural Studies"},
        {value: "Creative Writing"},
        {value: "Dance"},
        {value: "Economics"},
        {value: "Education"},
        {value: "Environmental Studies"},
        {value: "Film"},
        {value: "Fine Arts"},
        {value: "Foreign Language"},
        {value: "Gender Studies"},
        {value: "Globalization"},
        {value: "History"},
        {value: "Humanities"},
        {value: "Journalism"},
        {value: "Literature"},
        {value: "Marketing"},
        {value: "Media"},
        {value: "Museum Studies"},
        {value: "Music"},
        {value: "Music Business"},
        {value: "Philosophy"},
        {value: "Politics"},
        {value: "Public Health"},
        {value: "Religion"},
        {value: "Social Entrepreneurship"},
        {value: "Studio Arts"},
        {value: "Television"},
        {value: "Theater Arts"},
        {value: "Theology"},
        {value: "Theory"}
    ];

    return config;
});
