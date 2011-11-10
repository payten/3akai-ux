require(["jquery", "sakai/sakai.api.core", "/nyuwidgets/listsinline/data/listsconfig.js"], function($, sakai, listconfig) {

    sakai_global.listsinline = function(tuid, showSettings, widgetData) {

        // Dom identifiers
        var $rootel = $("#" + tuid);

        var thisList = false;

        var getCategories = function() {
            var categories = [];
            $.each(thisList, function(i, cat) {
                categories.push(cat.title);
            });
            return categories;
        };

        var showViewInterface = function(init) {
            if (init) {
                // grab the current widgetData.category and set the widget title to it
                // but only do it the first time
            }

            // show the edit button if the user can edit the page

            // grab the widget data
            // for every entry in widgetData.choices
            // render (that iteration can be done in the template)
        };

        var showEditInterface = function() {
            // grab the current widgetData.category and render all the choices
        };

        var showSettingsInterface = function() {
            var categories = categories();
            debug.log(categories);
            // render choices in a dropdown
        };


        var saveChoices = function() {
            // serialize the form
            // save it in widgetData.choices
            // show the view interface again
            showViewInterface(false);
        };

        var saveSettings = function() {
            // get the value from the dropdown and save it
            // inform finish of widget settings
        };

        var addBindings = function() {
            // bind to the save button in the settings form
            // bind to the edit button in the view interface
        };

        var doInit = function(){
            thisList = $.extend(true, {}, listconfig);
            // if (showSettings) {
                showSettingsInterface();
            // } else {
            //     showViewInterface(true);
            // }
        };
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("listsinline");
});
