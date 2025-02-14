sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ztestp.controller.View1", {
            onInit: function () {

            },

            onFetch: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_60_TEST")

                oModel.read("/ZMM_60_TEST", {
                    urlParameters: {
                        "$top": "10000"
                    },
                    success: function (oresponse) {
                        var a = oresponse.results
                    }
                })
            }
        });
    });
