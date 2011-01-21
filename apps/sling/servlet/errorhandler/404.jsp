<%
  response.setStatus(404);
%><!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!-- Sakai 3 R&amp;D - Page not found -->
        <title></title>

        <!-- Sakai Core CSS -->
        <link rel="stylesheet" type="text/css" href="/dev/css/FSS/fss-base.css" />
        <link rel="stylesheet" type="text/css" href="/dev/css/sakai/sakai.base.css" />

        <!-- Sakai Error CSS -->
        <link rel="stylesheet" type="text/css" href="/dev/css/sakai/sakai.error.css" />

        <!-- Sakai Page CSS -->
        <link rel="stylesheet" type="text/css" href="/dev/css/sakai/sakai.index.css" />

        <!-- 3rd party CSS -->

        <!-- Sakai Config JS -->
        <script type="text/javascript" src="/dev/configuration/widgets.js"></script>
        <script type="text/javascript" src="/var/widgets.json?callback=sakai.storeWidgets"></script>
        <script type="text/javascript" src="/dev/configuration/config.js"></script>
        <script type="text/javascript" src="/dev/configuration/config_custom.js"></script>

        <!-- Core 3rd-party JS -->
        <script type="text/javascript" src="/dev/lib/jquery/jquery.js"></script>
        <script type="text/javascript" src="/dev/lib/jquery/jquery-ui.full.js"></script>
        <script type="text/javascript" src="/dev/lib/fluid/3akai_Infusion.js"></script>
        <script type="text/javascript" src="/dev/lib/misc/l10n/globalization.js"></script>
        <script type="text/javascript" src="/dev/lib/jquery/plugins/jquery.json.js"></script>
        <script type="text/javascript" src="/dev/lib/misc/google/html-sanitizer-minified.js"></script>

        <!-- Sakai Core JS -->
        <script type="text/javascript" src="/dev/lib/sakai/sakai.api.core.js"></script>
        <script type="text/javascript" src="/dev/lib/sakai/sakai.api.util.js"></script>
        <script type="text/javascript" src="/dev/lib/sakai/sakai.api.i18n.js"></script>
        <script type="text/javascript" src="/dev/lib/sakai/sakai.api.l10n.js"></script>
        <script type="text/javascript" src="/dev/lib/sakai/sakai.api.user.js"></script>
        <script type="text/javascript" src="/dev/lib/sakai/sakai.api.widgets.js"></script>

        <!-- 3rd party JS -->
        <script type="text/javascript" src="/dev/lib/misc/trimpath.template.js"></script>
        <script type="text/javascript" src="/dev/lib/misc/querystring.js"></script>
        <script type="text/javascript" src="/dev/lib/jquery/plugins/jqmodal.sakai-edited.js"></script>
        <script type="text/javascript" src="/dev/lib/jquery/plugins/jquery.cookie.js"></script>
        <script type="text/javascript" src="/dev/lib/jquery/plugins/jquery.pager.js"></script>

        <!-- 404 JS -->
        <script type="text/javascript" src="/dev/javascript/sakai.404.js"></script>

    </head>

    <body class="fl-centered index i18nable">

        <!-- TOP BANNER -->
        <div id="top_banner"><!-- --></div>

        <div id="widget_topnavigation" class="widget_inline"></div>

        <div class="index-container fl-centered page_not_found_error"><span style="display:none;"><br /></span>
            <div id="page_not_found_error_logged_out_template" style="display:none;"><!--

                <div class="index-container fl-centered">

                <div id="widget_login" class="widget_inline"></div>


                <div class="login-box fl-container">
                    <div class="login-box-top">
                    </div>
                    <div class="login-box-content">
                        <div class="preview-box fl-left">

                            <div class="header-title">
                                <p class="sakai_logo_index"></p>
                            </div>

                            <div class="header-byline">
                                __MSG__HEADER_BYLINE__
                            </div>


                            <div id="page_not_found_error">
                                <div class="preview-box">
                                    <span id="error_title">__MSG__THE_PAGE_YOU_REQUESTED_WAS_NOT_FOUND__</span>
                                    <p>
                                        __MSG__YOU_MAY_HAVE_CLICKED_A_BROKEN_LINK_OR_MISTYPED_THE_URL__
                                    </p>
                                    __MSG__YOU_CAN__
                                    <ul>
                                        <li>
                                            __MSG__VERIFY_THE_LINK_IN_THE_ADDRESS_BAR__
                                        </li>
                                        <li>
                                            __MSG__GO_BACK_TO_PREVIOUS_PAGE_CLICKING_BACK_BUTTON_IN_BROWSER__
                                        </li>
                                        <li>
                                          __MSG__TRY_TO_CONTACT_PAGE_ADMIN_REQUEST_ACCESS__
                                        </li>
                                    </ul>
                                    <p>
                                        __MSG__IF_YOU_CONTINUE_TO_RECEIVE_ERROR_PAGE_MAY_HAVE_BEEN_MOVED_OR_NO_LONDER_EXISTS__
                                    </p>
                                </div>
                                <div class="login-container">
                                    <div id="widget_login" class="widget_inline"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="login-box-bottom">
                    </div>
                </div>
                <div id="widget_footer" class="widget_inline footercontainer"></div>

            --></div>
            <div id="page_not_found_error_logged_in_template" style="display:none;"><!--
                <div class="fl-container-flex header s3d-header">
                    <div class="fl-fix fl-centered fixed-container s3d-fixed-container">
                        <div class="s3d-decor">
                        </div>
                        <div id="page_not_found_error">
                            <div class="preview-box">
                                <span id="error_title">__MSG__THE_PAGE_YOU_REQUESTED_WAS_NOT_FOUND__</span>
                                <p>
                                    __MSG__YOU_MAY_HAVE_CLICKED_A_BROKEN_LINK_OR_MISTYPED_THE_URL__
                                </p>
                                __MSG__YOU_CAN__
                                <ul>
                                    <li>
                                        __MSG__VERIFY_THE_LINK_IN_THE_ADDRESS_BAR__
                                    </li>
                                    <li>
                                        __MSG__GO_BACK_TO_PREVIOUS_PAGE_CLICKING_BACK_BUTTON_IN_BROWSER__
                                    </li>
                                    <li>
                                	    __MSG__TRY_TO_CONTACT_PAGE_ADMIN_REQUEST_ACCESS__
                                    </li>
                                </ul>
                                <p>
                                    __MSG__IF_YOU_CONTINUE_TO_RECEIVE_ERROR_PAGE_MAY_HAVE_BEEN_MOVED_OR_NO_LONDER_EXISTS__
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="widget_footer" class="widget_inline footercontainer"></div>

                <div id="widget_chat" class="widget_inline"></div>
            --></div>
        </div>
    </body>
</html>
