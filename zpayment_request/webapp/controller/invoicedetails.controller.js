sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, FilterOperator, UIComponent, MessageToast, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zpaymentrequest.controller.invoicedetails", {
            onInit: function () {

            },

            invoiceDetails: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oSupplierModel").getObject();
                var supplier = oContext.Supplier

                var oFilter = new sap.ui.model.Filter("Supplier", "EQ", supplier)

                oModel.read("/Z_VENDOR_CDS", {
                    filters: [oFilter],
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "Supplier": items.Supplier
                            }
                            SupplierData.push(obj)
                        })
                        SupplierDataModel.setProperty("/aSupplierData", SupplierData)
                        UIComponent.getRouterFor(this).navTo("supplierdetails");
                    }.bind(this)
                })
            }
        });
    });
