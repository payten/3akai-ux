require(["jquery", "sakai/sakai.api.core", "/nyuwidgets/listsinline/data/listsconfig.js"], function($, sakai, listconfig) {

    sakai_global.listsinline = function(tuid, showSettings, widgetData) {

        // Dom identifiers
        var $rootel = $("#" + tuid),
            $listsinline_display_lists = $("#listsinline_display_lists", $rootel),
            $listsinline_display_lists_template = $("#listsinline_display_lists_template", $rootel),
            $listsinline_edit_button = $("#listsinline_edit_button", $rootel),
            $listsinline_choose_values = $("#listsinline_choose_values", $rootel),
            $listsinline_choose_values_template = $("#listsinline_choose_values_template", $rootel),
            $listsinline_settings = $("#listsinline_settings", $rootel),
            $listsinline_settings_template = $("#listsinline_settings_template", $rootel),
            $listsinline_settings_form = $("#listsinline_settings form");

        var thisList = false,
            canEdit = false;

        var getCategories = function() {
            var categories = [];
            $.each(thisList, function(i, cat) {
                categories.push({title: cat.title, id: i});
            });
            return categories;
        };

        var showViewInterface = function() {
            $listsinline_choose_values.hide();
            // show the edit button if the user can edit the page
            if (sakai.api.Widgets.canEditContainer(widgetData, tuid)) {
                $listsinline_edit_button.show();
            }
            // Render the widget data choices
            if (widgetData.choices) {
                sakai.api.Util.TemplateRenderer($listsinline_display_lists_template, {choices: widgetData.choices}, $listsinline_display_lists);
                $listsinline_display_lists.show();
            } else {
                // maybe show an error message or something
            }
        };

        var showEditInterface = function() {
            $listsinline_display_lists.hide();
            // grab the current widgetData.category and render all the choices
            var data = {list: thisList[widgetData.category]};
            sakai.api.Util.TemplateRenderer($listsinline_choose_values_template, data, $listsinline_choose_values);
            $listsinline_choose_values.show();
        };

        var showSettingsInterface = function() {
            var categories = getCategories();
            // render choices in a dropdown
            sakai.api.Util.TemplateRenderer($listsinline_settings_template, categories, $listsinline_settings);
            $listsinline_settings.show();
        };


        var saveChoices = function(e) {
            // serialize the form
            // save it in widgetData.choices
            // show the view interface again
            showViewInterface();
            e.preventDefault();
        };

        var saveSettings = function(e) {
            // get the value from the dropdown and save it
            // inform finish of widget settings
            e.preventDefault();
        };

        var addBindings = function() {
            // bind to the save button in the settings form
            $listsinline_settings_form.live("submit", saveSettings);
            // bind to the edit button in the view interface
            $listsinline_edit_button.live("click", showEditInterface);
        };

        var doInit = function(){
            thisList = $.extend(true, {}, listconfig);
            // if (showSettings) {
                showSettingsInterface();
            // } else {
            //     showViewInterface();
            // }
        };
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("listsinline");
});
