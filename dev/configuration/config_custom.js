define(["config/config"], function(config) {

    // Custom CSS Files to load in
    config.skinCSS = ["/dev/skins/nyu/nyu.skin.css"];

    // Don't display errors
    config.displayDebugInfo = false;

    /**
     * Navigation
     */
    config.Navigation[0].label = "ME";

    /**
     * World Templates
     */
    config.worldTemplates[0].title = "BASIC_GROUPS";
    config.worldTemplates[0].titleSing = "BASIC_GROUP";
    config.worldTemplates[0].templates[0].title = "Basic Group";

    // Only admin can add courses
    config.worldTemplates[1].adminOnly = true;

    config.worldTemplates[2].title = "RESEARCH_GROUPS";
    config.worldTemplates[2].titleSing = "RESEARCH_GROUP";


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
    config.Profile.configuration.defaultConfig.aboutme.permission = "everyone";

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

    config.Permissions.Copyright.creativecommons["default"] = false;
    config.Permissions.Copyright.unspecified = {
        "title": "COPYRIGHT_NOT_SPECIFIED",
        "default": true
    };


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

    config.Permissions.Groups.defaultaccess = "logged-in-only";
    config.Permissions.Groups.defaultjoin = "no";
    config.Permissions.Groups.courses = {
        defaultaccess: "members-only",
        defaultjoin: "no"
    };

    return config;
});
