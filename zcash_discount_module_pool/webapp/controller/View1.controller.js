sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent) {
        "use strict";

        return Controller.extend("zcashdiscountmodulepool.controller.View1", {
            onInit: function () {

            },
            OnExecute:function(){
                
                UIComponent.getRouterFor(this).navTo("View2");
            }
        });
    });
