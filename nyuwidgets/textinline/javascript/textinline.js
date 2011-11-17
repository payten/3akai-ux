require(["jquery", "sakai/sakai.api.core", "jquery-plugins/jquery.jeditable"], function($, sakai) {

    sakai_global.textinline = function(tuid, showSettings, widgetData) {

        var $rootel = $("#"+tuid),
            $textinline_main_container = $("#textinline_main_container", $rootel),
            $textinline_main = $("#textinline_main", $rootel),
            $textinline_main_template = $("#textinline_main_template", $rootel),
            $textinline_settings = $("#textinline_settings", $rootel),
            $textinline_settings_template = $("#textinline_settings_template", $rootel),
            $textinline_save = $("#textinline_save", $rootel),
            $textinline_cancel = $("#textinline_cancel", $rootel);

        widgetData = widgetData || {textinline:{title:"", text:"", allowTitleEdit: true}};

        var saveEdits = function(value, settings) {
            // The 'pre' is the textarea, otherwise it's the header (title)
            if ($(this).is("pre")) {
                widgetData.textinline.text = value;
            } else {
                widgetData.textinline.title = value;
            }
            sakai.api.Widgets.saveWidgetData(tuid, widgetData.textinline);
            return value;
        };

        var doInit = function(){
            sakai.api.Util.TemplateRenderer($textinline_main_template, {data:widgetData.textinline}, $textinline_main);
            $textinline_main_container.show();
            // Use a local widget data here for checking if the user can edit the container
            // if widgetData has no data property, it is our local widget data
            var localwd = false;
            if (widgetData.data) {
                localwd = widgetData;
            }
            if (sakai.api.Widgets.canEditContainer(localwd, tuid)) {
                var opts = {onblur: "ignore",submit: "<button class='s3d-button s3d-overlay-button'>Save</button>", cancel: "<button class='s3d-link-button'>Cancel</button>"};
                if (widgetData.textinline.allowTitleEdit) {
                    var h1opts = $.extend(true, {tooltip: "Click to edit title", placeholder: "Click to edit title"}, opts);
                    $("h1.editable", $rootel).editable(saveEdits, h1opts);
                } else {
                    $("h1.editable").removeClass("editable");
                }
                var preOpts = $.extend(true, {type: "textarea", rows: 5, tooltip: "Click to edit text", placeholder: "Click to edit text"}, opts);
                $("pre.editable", $rootel).editable(saveEdits, preOpts);
            } else {
                $(".editable").removeClass("editable");
            }
        };
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("textinline");
});
