sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zmaintenanceplan.controller.First_Screen", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.CallBackendData();
            },
            CallBackendData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    // customIcon: '/css/preloader1.gif',
                    text: "Fetching"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMAINTENANCEPLAN");
                // var TableModel = this.getView().getModel("oTableDataModel");
                // var aTableArr = TableModel.getProperty("/aTableData")
                var aNewArr = [];
                oModel.read("/ZMAIN_PLAN", {
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var obj = {
                                    "maintenanceplan": items.maintenanceplan,
                                    "maintenancecall": items.maintenancecall,
                                    "maintenanceorder": items.maintenanceorder,
                                    "completiondate": items.completiondate,
                                    "completiontime": items.completiontime,
                                    "Zlastcompletationdate": items.Zlastcompletationdate,
                                    "maintenancestrategy": items.maintenancestrategy,
                                    "maintenancecallnextplanneddate": items.maintenancecallnextplanneddate,
                                    "maintenancecalldate": items.maintenancecalldate,
                                    "maintenanceplanningplant": items.maintenanceplanningplant,
                                    "tasklisttype": items.tasklisttype,
                                    "tasklistgroup": items.tasklistgroup,
                                    "tasklistgroupcounter": items.tasklistgroupcounter,
                                    "equipment": items.equipment,
                                    "functionallocation": items.functionallocation,
                                    "maintprioritytype": items.maintprioritytype,
                                    "maintenanceactivitytype": items.maintenanceactivitytype,
                                }
                                aNewArr.push(obj);
                            })
                            this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                        }
                        oBusyDialog.close();
                    }.bind(this),
                })

            },

        });
    });
