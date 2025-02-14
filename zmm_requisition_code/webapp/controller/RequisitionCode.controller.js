sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zmmrequisitioncode.controller.RequisitionCode", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
                this.CallTableBackEndData();
            },
            CallTableBackEndData: function (){
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Loading"
                });
                oBusyDialog.open();
                var OMODEL = new  sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMREQUISITIONCODE");
                // var OMODEL = this.getView().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableData = oTableModel.getProperty("/aTableItem");
                OMODEL.read("/ZMMREQUISITIONCODE_cds",{
                    success: function (orres){
                        orres.results.map(function(items){
                            var obj = {
                                "Usercode": items.Usercode,
                                "Username": items.Username,

                            }
                            aTableData.push(obj);
                        })
                        this.getView().getModel('oTableItemModel').setProperty("/aTableItem", aTableData);
                        oBusyDialog.close();
                    }.bind(this),
                })

            },

        });
    });
