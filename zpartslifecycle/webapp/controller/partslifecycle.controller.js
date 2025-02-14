sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/BusyDialog",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BusyDialog, UIComponent, MessageBox, MessageToast, Fragment, Sorter, syncStyleClass, JSONModel, Filter, FilterOperator) {
        "use strict";

        var filterBar = 1;
        return Controller.extend("zpartslifecycle.controller.partslifecycle", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                // this.getView().getModel('oTableDataModel').setProperty("/aTableData", []);
                UIComponent.getRouterFor(this).getRoute('Routepartslifecycle').attachPatternMatched(this.Filter_Bar_Visible_Function, this);
                UIComponent.getRouterFor(this).getRoute('Routepartslifecycle').attachPatternMatched(this.CallBackend_Data, this);

            },
            Filter_Bar_Visible_Function: function () {
                if (filterBar === 0) {
                    var obj = {
                        "Visible": true,
                        "Filter_Name": "Show Filter Bar",
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "oFilterBarVisible");
                    this.getView().getModel('oFilterBarVisible').setProperty("/Visible", false);
                    this.getView().getModel('oFilterBarVisible').setProperty("/Filter_Name", "Show Filter Bar");
                    filterBar++;
                }
                else {
                    var obj = {
                        "Visible": true,
                        "Filter_Name": "Hide Filter Bar",
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "oFilterBarVisible");
                    this.getView().getModel('oFilterBarVisible').setProperty("/Visible", true);
                    this.getView().getModel('oFilterBarVisible').setProperty("/Filter_Name", "Hide Filter Bar");
                    filterBar--;
                }
            },
            CallBackend_Data: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    // customIcon: '/css/preloader1.gif',
                    text: "Fetching"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                // var TableModel = this.getView().getModel("oTableDataModel");
                // var aTableArr = TableModel.getProperty("/aTableData")
                var aNewArr = [];
                oModel.read("/PARTS_life_Cycle_report", {
                    // filters: [OrderNoFilter, OrderTypeFilter, CompanyCodeFilter, PostingDateFilter, PlantFilter],
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var obj = {
                                    "maintenanceorder": items.maintenanceorder,
                                    "maintenanceordertype": items.maintenanceordertype,
                                    "maintenanceorderdesc": items.maintenanceorderdesc,
                                    "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                    "mainworkcenter": items.mainworkcenter,
                                    "mainworkcenterplant": items.mainworkcenterplant,
                                    "maintenanceplanningplant": items.maintenanceplanningplant,
                                    "companycode": items.companycode,
                                    "costcenter": items.costcenter,
                                    "equipment": items.equipment,
                                    "equipmentname": items.equipmentname,
                                    "functionallocation": items.functionallocation,
                                    "maintenanceactivitytype": items.maintenanceactivitytype,
                                    "responsiblecostcenter": items.responsiblecostcenter,
                                    "plantsection": items.plantsection,
                                    "material": items.material,
                                    "plant": items.plant,
                                    "storagelocation": items.storagelocation,
                                    "reservation": items.reservation,
                                    "reservationitem": items.reservationitem,
                                    "goodsrecipientname": items.goodsrecipientname,
                                    "postingdate": items.postingdate,
                                    "materialdocumentitemtext": items.materialdocumentitemtext,
                                    "quantityinentryunit": items.quantityinentryunit,
                                    "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                    "life_cycle": items.life_cycle,
                                }
                                aNewArr.push(obj);
                            })
                            this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                        }
                        oBusyDialog.close();
                    }.bind(this),
                })

            },
            Get_TableData: function () {

                var oBusyDialog = new sap.m.BusyDialog({
                    // customIcon: '/css/preloader1.gif',
                    text: "Fetching"
                });
                oBusyDialog.open();
                var OrderNo = this.getView().byId("OrderNo").getValue();
                var OrderType = this.getView().byId("MaintenanceOrderType").getValue();
                var CompanyCode = this.getView().byId("CompanyCode").getValue();
                var PostingDate = this.getView().byId("PostingDate").getValue();
                var Plant = this.getView().byId("Plant").getValue();

                var OrderNoFilter = new sap.ui.model.Filter("maintenanceorder", "EQ", OrderNo)
                var OrderTypeFilter = new sap.ui.model.Filter("maintenanceordertype", "EQ", OrderType)
                var CompanyCodeFilter = new sap.ui.model.Filter("companycode", "EQ", CompanyCode)
                var PostingDateFilter = new sap.ui.model.Filter("postingdate", "EQ", PostingDate)
                var PlantFilter = new sap.ui.model.Filter("plant", "EQ", Plant)

                if (OrderNo == "" && OrderType == "" && CompanyCode == "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        // filters: [OrderNoFilter, OrderTypeFilter, CompanyCodeFilter, PostingDateFilter, PlantFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {
                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType == "" && CompanyCode == "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType != "" && CompanyCode == "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        urlParameters: {
                            "$top": "5000"
                        },
                        filters: [OrderNoFilter, OrderTypeFilter],

                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType == "" && CompanyCode != "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        urlParameters: {
                            "$top": "5000"
                        },
                        filters: [OrderNoFilter, CompanyCodeFilter],

                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType == "" && CompanyCode == "" && PostingDate != "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter, PostingDateFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType != "" && CompanyCode == "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderTypeFilter],

                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType != "" && CompanyCode != "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderTypeFilter, CompanyCodeFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType != "" && CompanyCode == "" && PostingDate != "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    // var oModel = this.getView().getModel();
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderTypeFilter, PostingDateFilter],

                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType != "" && CompanyCode == "" && PostingDate == "" && Plant != "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderTypeFilter, PlantFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType == "" && CompanyCode != "" && PostingDate != "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [CompanyCodeFilter, PostingDateFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType == "" && CompanyCode != "" && PostingDate == "" && Plant != "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [CompanyCodeFilter, PlantFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType == "" && CompanyCode != "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [CompanyCodeFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType == "" && CompanyCode == "" && PostingDate != "" && Plant != "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [PostingDateFilter, PlantFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo == "" && OrderType == "" && CompanyCode == "" && PostingDate == "" && Plant != "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [PlantFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType != "" && CompanyCode != "" && PostingDate == "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter, OrderTypeFilter, CompanyCodeFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType != "" && CompanyCode == "" && PostingDate != "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter, OrderTypeFilter, PostingDateFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType != "" && CompanyCode == "" && PostingDate == "" && Plant != "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter, OrderTypeFilter, PlantFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType != "" && CompanyCode != "" && PostingDate != "" && Plant == "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter, OrderTypeFilter, CompanyCodeFilter, PostingDateFilter],
                        urlParameters: {
                            "$top": "5000"
                        },
                        
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType != "" && CompanyCode != "" && PostingDate == "" && Plant != "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter, OrderTypeFilter, CompanyCodeFilter, PlantFilter],

                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }
                else if (OrderNo != "" && OrderType != "" && CompanyCode != "" && PostingDate != "" && Plant != "") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPARTS_LIFE_CYCLE_BINDING");
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aNewArr = [];
                    oModel.read("/life_cycle", {
                        filters: [OrderNoFilter, OrderTypeFilter, CompanyCodeFilter, PostingDateFilter, PlantFilter],

                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {

                                    var obj = {
                                        "maintenanceorder": items.maintenanceorder,
                                        "maintenanceordertype": items.maintenanceordertype,
                                        "maintenanceorderdesc": items.maintenanceorderdesc,
                                        "scheduledbasicstartdate": items.scheduledbasicstartdate,
                                        "mainworkcenter": items.mainworkcenter,
                                        "mainworkcenterplant": items.mainworkcenterplant,
                                        "maintenanceplanningplant": items.maintenanceplanningplant,
                                        "companycode": items.companycode,
                                        "costcenter": items.costcenter,
                                        "equipment": items.equipment,
                                        "equipmentname": items.equipmentname,
                                        "functionallocation": items.functionallocation,
                                        "maintenanceactivitytype": items.maintenanceactivitytype,
                                        "responsiblecostcenter": items.responsiblecostcenter,
                                        "plantsection": items.plantsection,
                                        "material": items.material,
                                        "plant": items.plant,
                                        "storagelocation": items.storagelocation,
                                        "reservation": items.reservation,
                                        "reservationitem": items.reservationitem,
                                        "goodsrecipientname": items.goodsrecipientname,
                                        "postingdate": items.postingdate,
                                        "materialdocumentitemtext": items.materialdocumentitemtext,
                                        "quantityinentryunit": items.quantityinentryunit,
                                        "totalgoodsmvtamtincccrcy": items.totalgoodsmvtamtincccrcy,
                                        "life_cycle": items.life_cycle,
                                    }
                                    aNewArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr)
                            }
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }


            },







            handleValueHelp: function (oEvent) {

                var oView = this.getView();
                var Value_HelpId = (oEvent.getSource().getId()).slice(66, ((oEvent.getSource().getId()).length));
                console.log(Value_HelpId)

                this._sInputId = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zpartslifecycle.fragment.Dialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    if(Value_HelpId == "OrderNo"){

                        var oTemplate = new sap.m.StandardListItem({
                            title: "{maintenanceorder}",
                            description: "{maintenanceordertype}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: '/life_cycle',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Order No");
                        oValueHelpDialog.setResizable(true);
                        oValueHelpDialog.open();
                    }
                    else if(Value_HelpId == "MaintenanceOrderType"){

                        var oTemplate = new sap.m.StandardListItem({
                            title: "{maintenanceordertype}",
                            description: "{maintenanceorder}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: '/life_cycle',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Order Type");
                        oValueHelpDialog.setResizable(true);
                        oValueHelpDialog.open();
                    }
                    else if(Value_HelpId == "CompanyCode"){

                        var oTemplate = new sap.m.StandardListItem({
                            title: "{companycode}",
                            description: "{companycode}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: '/life_cycle',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Company Code");
                        oValueHelpDialog.setResizable(true);
                        oValueHelpDialog.open();
                    }
                    else if(Value_HelpId == "PostingDate"){

                        var oTemplate = new sap.m.StandardListItem({
                            title: "{postingdate}",
                            description: "{postingdate}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: '/life_cycle',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Posting Date");
                        oValueHelpDialog.setResizable(true);
                        oValueHelpDialog.open();
                    }
                    else if(Value_HelpId == "Plant"){

                        var oTemplate = new sap.m.StandardListItem({
                            title: "{plant}",
                            description: "{plant}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: '/life_cycle',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Plant");
                        oValueHelpDialog.setResizable(true);
                        oValueHelpDialog.open();
                    }
                });
            },
            SingleField_ValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var productInput = this.byId(this._sInputId);
                    productInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },
            onSearch_for_SingleField_ValueHelp: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("maintenanceorder", FilterOperator.Contains, sValue),
                    new Filter("maintenanceordertype", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
        });
    });
