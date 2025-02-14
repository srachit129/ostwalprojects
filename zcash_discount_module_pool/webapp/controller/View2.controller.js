sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent) {
        "use strict";

        return Controller.extend("zcashdiscountmodulepool.controller.View2", {
            onInit: function () {

            },
            BackButton:function(){
                UIComponent.getRouterFor(this).navTo("RouteView1");
            }

        });
    });
