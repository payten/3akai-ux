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
    config.widgets.defaults.parcitipants = {"widgetid": "nyuparticipants", "path": "/nyuwidgets/nyuparticipants"};
    config.worldTemplates[0].templates[0].title = "Group";

    // Use our custom participants widget
    config.worldTemplates[0].templates[0].docs["${pid}1"]["${refid}2"].page = "<img id='widget_nyuparticipants_${refid}3' class='widget_inline' style='display: block; padding: 10px; margin: 4px;' src='/dev/images/person_icon.png' data-mce-src='/dev/images/person_icon.png' data-mce-style='display: block; padding: 10px; margin: 4px;' border='1'/>";
    config.worldTemplates[0].templates[0].docs["${pid}1"]["${refid}3"].participants.showExtraInfo = false;

    // Add in the About this Group page
    config.worldTemplates[0].templates[0].docs["${pid}2"] = {
        structure0: {
            "about":{
                "_ref":"${refid}4",
                "_order":0,
                "_nonEditable": true,
                "_title": "About this Group",
                "main":{
                    "_ref":"${refid}4",
                    "_order":0,
                    "_nonEditable": true,
                    "_title":"About this Group"
                }
            }
        },
        "${refid}4": {
            page: "<img id='widget_groupbasicinfo' class='widget_inline' style='display: block; padding: 10px; margin: 4px;' src='/nyuwidgets/groupbasicinfo/images/icon.png' data-mce-src='/nyuwidgets/groupbasicinfo/images/icon.png' data-mce-style='display: block; padding: 10px; margin: 4px;' border='1'><br></p>"
        }
    };
    config.worldTemplates[0].templates[0].structure.library._order = 1;
    config.worldTemplates[0].templates[0].structure.participants._order = 2;
    config.worldTemplates[0].templates[0].structure.about = {
        "_title": "About this Group",
        "_order": 0,
        "_docref": "${pid}2",
        "_nonEditable": true,
        "_view": ["everyone", "anonymous", "-member"],
        "_edit": ["-manager"]
    };

    // Only admin can add courses
    config.worldTemplates[1].adminOnly = true;
    config.worldTemplates[1].templates[0].editSettings = false;

    // Math Course - add About this Group page
    config.worldTemplates[1].templates[0].docs["${pid}6"] = {
        structure0: {
            "about":{
                "_ref":"${refid}16",
                "_order":0,
                "_nonEditable": true,
                "_title": "About this Group",
                "main":{
                    "_ref":"${refid}16",
                    "_order":0,
                    "_nonEditable": true,
                    "_title":"About this Group"
                }
            }
        },
        "${refid}16": {
            page: "<img id='widget_groupbasicinfo' class='widget_inline' style='display: block; padding: 10px; margin: 4px;' src='/nyuwidgets/groupbasicinfo/images/icon.png' data-mce-src='/nyuwidgets/groupbasicinfo/images/icon.png' data-mce-style='display: block; padding: 10px; margin: 4px;' border='1'><br></p>"
        }
    };
    config.worldTemplates[1].templates[0].structure.syllabus._order = 1;
    config.worldTemplates[1].templates[0].structure.lectures._order = 2;
    config.worldTemplates[1].templates[0].structure.problemsets._order = 3;
    config.worldTemplates[1].templates[0].structure.coursewebsite._order = 4;
    config.worldTemplates[1].templates[0].structure.organizationnotes._order = 5;
    config.worldTemplates[1].templates[0].structure.lecturetemplate._order = 6;
    config.worldTemplates[1].templates[0].structure.about = {
        "_title": "About this Group",
        "_order": 0,
        "_docref": "${pid}6",
        "_nonEditable": true,
        "_view": ["everyone", "-student", "-ta"],
        "_edit": ["-lecturer"]
    };

    // Basic course - Use the nyu participants widget
    config.worldTemplates[1].templates[1].docs["${pid}1"]["${refid}2"].page = "<img id='widget_nyuparticipants_${refid}3' class='widget_inline' style='display: block; padding: 10px; margin: 4px;' src='/dev/images/person_icon.png' data-mce-src='/dev/images/person_icon.png' data-mce-style='display: block; padding: 10px; margin: 4px;' border='1'/>";
    config.worldTemplates[1].templates[1].docs["${pid}1"]["${refid}3"].participants.showExtraInfo = false;

    config.worldTemplates[1].templates[1].editSettings = false;

    // Basic course - add About this Group page
    config.worldTemplates[1].templates[1].docs["${pid}2"] = {
        structure0: {
            "about":{
                "_ref":"${refid}4",
                "_order":0,
                "_nonEditable": true,
                "_title": "About this Group",
                "main":{
                    "_ref":"${refid}4",
                    "_order":0,
                    "_nonEditable": true,
                    "_title":"About this Group"
                }
            }
        },
        "${refid}4": {
            page: "<img id='widget_groupbasicinfo' class='widget_inline' style='display: block; padding: 10px; margin: 4px;' src='/nyuwidgets/groupbasicinfo/images/icon.png' data-mce-src='/nyuwidgets/groupbasicinfo/images/icon.png' data-mce-style='display: block; padding: 10px; margin: 4px;' border='1'><br></p>"
        }
    };
    config.worldTemplates[1].templates[1].structure.library._order = 1;
    config.worldTemplates[1].templates[1].structure.participants._order = 2;
    config.worldTemplates[1].templates[1].structure.about = {
        "_title": "About this Group",
        "_order": 0,
        "_docref": "${pid}2",
        "_nonEditable": true,
        "_view": ["everyone", "anonymous", "-student"],
        "_edit": ["-ta", "-lecturer"]
    };

    // Remove research groups
    config.worldTemplates = config.worldTemplates.splice(0,2);

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
            "type": "textarea",
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
      * Permissions
      */

    config.Permissions.Groups.defaultaccess = "members-only";
    config.Permissions.Groups.defaultjoin = "no";
    config.Permissions.Groups.courses = {
        defaultaccess: "members-only",
        defaultjoin: "no"
    };


    /**
     * Authentication
     */
    config.Authentication.internal = true;
    config.Authentication.allowInternalAccountCreation = false;
    config.allowPasswordChange = false;

    // map of SSO enabled hosts to their
    // respective SSO service URL
    var ssoEnabledHosts = {
        "devatlasapp1.home.nyu.edu": {url: "https://devsso.home.nyu.edu/sso/saml2/jsp/idpSSOInit.jsp?metaAlias=/idp&spEntityID=http://devatlasapp1.home.nyu.edu:8080/system/sling/samlauth/login", followLogoutRedirects: true},
        "devatlas.home.nyu.edu": {url: "https://devsso.home.nyu.edu/sso/saml2/jsp/idpSSOInit.jsp?metaAlias=/idp&spEntityID=http://devatlasapp1.home.nyu.edu:8080/system/sling/samlauth/login", followLogoutRedirects: true},
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
     * Kaltura Settings
     */
    config.kaltura = {        
        serverURL:  "http://www.kaltura.com", // Kaltura Server URL
        partnerId:  656132, // INSERT YOUR PARTNER ID HERE
        playerId: 5111822 // INSERT YOUR PLAYER ID (UICONF_ID - from Kaltura Studio tab)
    };
    
    /**
     * Add Kaltura mime-type
     */    
    config.MimeTypes['kaltura/video'] = {
        cssClass: "icon-video-sprite",
        URL: "/dev/images/mimetypes/video.png",
        description: "KALTURA_VIDEO_FILE"
    };

    return config;
});
