sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/type/String",
    "sap/m/Token",
    "sap/ui/table/Column"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, ODataModel, Filter, FilterOperator, MessageBox, Fragment, TypeString, Token, UIColumn) {
        "use strict";

        return Controller.extend("zgateentry.controller.GateEntryDetails", {
            onInit: function () {
                this.getView().setModel(new JSONModel(), "oReturnTypeVisibleModel")
                this.getView().getModel("oReturnTypeVisibleModel").setProperty("/aVisible", false)
                var oModel = new JSONModel({
                    dDefaultDate: new Date()
                });
                this.getView().setModel(oModel, "view");

                UIComponent.getRouterFor(this).getRoute('GateEntryDetails').attachPatternMatched(this._onRouteMatch, this);

                this.getView().setModel(new JSONModel(), "oWeightModel")
                this.getView().setModel(new JSONModel(), "oTareWeightModel")
                this.getView().setModel(new JSONModel(), "VehicleInDuration")


                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Y1416_GATE")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "itemDataModel")
                oModel.read("/gate_item", {
                    urlParameters: {
                        "$top": "50000",
                    },
                    success: function (oresponse) {
                        this.getView().getModel("itemDataModel").setProperty("/aItemData", oresponse.results)
                    }.bind(this)
                })

            },
            _onRouteMatch: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;
                var sAction = oCommonModel.getProperty('/displayObject').Action;
                var id = sap.ushell.Container.getService("UserInfo").getId()
                this.getView().setModel(new JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

                // Line no 54 to 66 new Defign for me
                if (gateType == 4) {
                    var obj = {
                        "Name": "Vendor / Customer Name",
                        "Code": "Vendor / Customer Code",
                    }
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "oVendorCustomerLabelNameChangeModel");
                } else {
                    var obj = {
                        "Name": "Vendor Name",
                        "Code": "Vendor Code",
                    }
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "oVendorCustomerLabelNameChangeModel");
                }
                if (gateType == 5) {
                    var obj = {
                        "InvoiceDate_Requard": true,
                        "InvoiceNumber_Requard": true,
                        "OperatorName_Requard": true,
                    }
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "oInvoiceField_RequardModel");
                } else if (gateType == 3 || gateType == 4 || gateType == 6) {
                    var obj = {
                        "InvoiceDate_Requard": false,
                        "InvoiceNumber_Requard": false,
                        "OperatorName_Requard": true,
                    }
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "oInvoiceField_RequardModel");
                } else {
                    var obj = {
                        "InvoiceDate_Requard": false,
                        "InvoiceNumber_Requard": false,
                        "OperatorName_Requard": false,
                    }
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "oInvoiceField_RequardModel");
                }
                var getOutFlag = false;
                var getInFlag = false;

                var Grossvalue = this.getView().byId("idGross").getValue();
                var Tarevalue = this.getView().byId("idTare").getValue();

                var emptyValue = "";

                if (Grossvalue != "") {
                    this.getView().getModel("oWeightModel").setProperty("/GrossWt", emptyValue)
                }

                if (Tarevalue != "") {
                    this.getView().getModel("oTareWeightModel").setProperty("/TareWt", emptyValue)
                }

                //gate entry type
                // var type = "";
                // if (gateinout === "Out") {
                //     type = "RGPO"
                // } else if (gateinout === "In") {
                //     type = "RGPI"
                // } else if (gateType === '1') {
                //     type = "DEL"
                // } else if (gateType === '2') {
                //     type = "RDEL"
                // } else if (gateType === '4') {
                //     type = "NRGP"
                // } else if (gateType === '5') {
                //     type = "WPO"
                // } else if (gateType === '6') {
                //     type = "WPO"
                // }

                var oDelnum = this.getView().byId("idDel1").getValue();
                if (oDelnum.length > 0) {
                    this.getView().byId("idDel1").setValue("");
                }

                if ((gateinout === 'Out' && (sAction === "Create")) && (gateType === '3') || (gateinout === 'Out' && gateType === '3' && sAction === "Change") || (gateType === '4' && sAction === "Create") || (gateType === '6') || (gateType === '1' && sAction === "Gate Out") || (gateType === '5' && sAction === "Change")) {
                    getOutFlag = true;
                }

                if (sAction === "Display") {
                    getOutFlag = false;
                }

                if ((gateinout === 'In' && (sAction === "Create") && (gateType === '3')) || (sAction === "Create" && gateType === '6') || (gateinout === 'In' && gateType === '3' && sAction === "Change") || (sAction === 'Create' && (gateType !== '3'))) {
                    getInFlag = true;
                }

                if (gateType === '4' || gateType === '6' && sAction === "Create") {
                    getInFlag = false;
                }
                if (gateType === '3' || gateType === '4') {
                    this.getView().getModel("oReturnTypeVisibleModel").setProperty("/aVisible", true)
                } else {
                    this.getView().getModel("oReturnTypeVisibleModel").setProperty("/aVisible", false)
                }

                var oSettingObject = {
                    "editable": true,
                    "gateEntryNumEdit": true,
                    "deliveryNumVisible": true,
                    "SaveBtnVisible": true,
                    "RefGateVisible": gateType == '3' ? true : false,
                    "gateInEditable": true,
                    "visible": true,
                    "labelForType": "Delivery No",
                    "gateInFlag": getInFlag,                    
                    "gateOutFlag": getOutFlag,
                    "isRowItemEmpty": false,
                    "gateDoneEditable": false,
                    "gateQtyEditable": false,
                    "buttonVisible": true,
                    "cancelVisible": true,
                    "CheckBoxEditable": sAction === "Display" ? false : true,
                    "checkValue": false,
                    "validPO": true,
                    "weighslipvisible": true,
                    "invoiceDateEditable": false,
                    "gateoutvisible": true,
                    "gateinvisible": true,
                    "gateineditable": true,
                    "entrydateeditable": true,
                    "gateoutOutdatevisible": false,
                    "gateoutintimevisible": false,
                    "EntryTimeVisible": false,
                    "checkBoxVisible": false,
                    "gateindatevisible": false,
                    "SalesCheckBoxVisible": false,
                    "vehicleindurationvisible": false,

                };
                this.getView().setModel(new JSONModel(oSettingObject), "oGenericModel");

                if (gateinout === 'Out' && (sAction === 'Create')) {
                    this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                }
                if (gateType === '3' && gateinout === 'Out' && sAction === 'Create' || sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/gateDoneEditable", true);
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", false);
                }
                if (gateType === '3' && gateinout === 'Out' && sAction === 'Create') {
                    // this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    this.getView().byId("idGateInTime").setValue(null);
                    this.getView().byId("picker0").setValue(null);
                }
                if (gateType === '3' && gateinout === 'In' && sAction === 'Create') {
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                }
                if (gateType === '3' && gateinout === 'In' && sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                    this.getView().getModel("oGenericModel").setProperty("/gateDoneEditable", false);
                }
                if (gateType === '4' && sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                    this.getView().getModel("oReturnTypeVisibleModel").setProperty("/aVisible", true)
                    this.getView().getModel("oGenericModel").setProperty("/buttonVisible", false);

                }

                if (oCommonModel.getProperty('/displayObject').Action === "Change" && (gateType === '5' || gateType === '6')) {
                    this.getView().getModel("oGenericModel").setProperty("/vehicleindurationvisible", true);
                }


                if (oCommonModel.getProperty('/displayObject').Action === "Create") {
                    // this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gateType === '1' || gateType === '2') {
                        this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && (gateType === '1' || gateType === '2')) {
                        this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                    }
                    this.getView().getModel("oGenericModel").setProperty("/cancelVisible", false);
                    this.onReadNumberRange();

                    var outProperty = false;
                    var inProperty = false;
                    if ((gateType === '3' && sAction === "Create" && gateinout === "Out") || (gateType === '4' && sAction === "Create")) {
                        outProperty = true;
                    } else if (gateType === '3' && sAction === "Create" && gateinout === "In") {
                        inProperty = true
                    } else if (gateType === '5' && sAction === "Create") {
                        inProperty = true
                        outProperty = true
                    } else if (gateType === '2' && sAction === "Create") {
                        inProperty = true
                        outProperty = false
                    } else if (gateType === '1' && sAction === "Create") {
                        outProperty = true
                    }
                    else {
                        outProperty = true;
                        inProperty = false;
                    }

                    var oDate = new Date();


                    var oPayloadObject = {
                        "Gateno": "",
                        "Entrydate": oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate(),
                        "Entrytime": oDate.toLocaleTimeString().slice(0, 7),
                        "GateInDate": outProperty ? "" : (oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()),
                        "VehicalNo": "",
                        "Operator": "",
                        // "GateInDt": oDate.getDate() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getFullYear(),
                        "GateInTm": outProperty ? "" : oDate.toLocaleString('en-US', {
                            hour12: false,
                        }).slice(11),


                        "LrDate": oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate(),
                        "LrNo": "",
                        "Remark": "",
                        "RefGate": null,
                        "Plant": oCommonModel.getProperty('/plantObject'),
                        //"Approved": "",
                        "Puchgrp": "",
                        "Name1": "Road",
                        "Driver": "",
                        "DrLisc": "",
                        "GateOutDt": inProperty ? "" : (oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()),
                        "GateOutTm": inProperty ? "" : oDate.toLocaleString('en-US', {
                            hour12: false,
                        }).slice(11),
                        "Driverno": "",
                        "GrossWt": "",
                        "TareWt": "",
                        "NetWt": "",
                        "TrOper": "",
                        "Cancelled": "",
                        "Invoice": "",
                        "Invdt": oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate(),
                        "EntryType": oCommonModel.getProperty('/typeobject').Domain,
                        "Container": "",
                        "WtBrNo": "",
                        "Challan": "",
                        "Vehiclefitness": "",
                        "Vehiclercdate": "",
                        "Vehicleinsurance": "",
                        "Vehiclepuc": "",
                        "Driverlicense": "",
                        "Driveralcoholic": "",
                        "Flammablesubstance": "",
                        "Firesafety": "",
                        "Reversehorn": "",
                        "Typeofreturn": "",
                        "to_gateitem": {
                            results: []
                        }
                    };
                    this.getView().setModel(new JSONModel(oPayloadObject), "oGateEntryHeadModel");
                    this.getView().getModel("oGenericModel").setProperty("/editable", true);
                    this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", true);

                    var obj = {
                        "Entrytime":
                            oDate.toLocaleTimeString('en-US', {
                                hour12: false,
                            }).slice(0, 7),
                        // oDate.toLocaleString('en-US', {
                        //     hour12: false,
                        // }).slice(12),
                    }
                    this.getView().setModel(new JSONModel(obj), "oReportingTimeModel");
                }

                if (oCommonModel.getProperty('/displayObject').Action === "Display" && (gateType === '1' || gateType === '2')) {
                    this.onreadGateData();
                    this.getView().getModel("oGenericModel").setProperty("/entrydateeditable", false);
                    this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "Delivery No");
                    this.getView().getModel("oGenericModel").setProperty("/editable", false);
                    this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", false);
                } else if (oCommonModel.getProperty('/displayObject').Action === "Display" && (gateType === '3' || gateType === '4' || gateType === '5' || gateType === '6')) {

                    this.onreadGateData();
                    this.getView().getModel("oGenericModel").setProperty("/entrydateeditable", false);
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                    this.getView().getModel("oGenericModel").setProperty("/editable", false);
                    this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                } else if ((oCommonModel.getProperty('/displayObject').Action === "Create" || oCommonModel.getProperty('/displayObject').Action === "Change" || oCommonModel.getProperty('/displayObject').Action === "Display") && (gateType === '1' || gateType === '2')) {
                    if (gateType === '2') {
                        this.getView().getModel("oGenericModel").setProperty("/labelForType", "Invoice");
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '2') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);

                        this.getView().getModel("oGenericModel").setProperty("/gateinvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateindatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/checkBoxVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/SalesCheckBoxVisible", true);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Display" && gateType === '1') {
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '1') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);

                        this.getView().getModel("oGenericModel").setProperty("/gateinvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateindatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);

                        var oDate = new Date();
                        var currentdate = oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate();
                        var currenttime = oDate.toLocaleString('en-US', {
                            hour12: false,
                        }).slice(11);

                        var obj = {
                            "currentDate1": currentdate,
                            "currentTime1": currenttime,
                            "currentDate": currentdate,
                            "currentTime": this.getView().byId("idTimeOut1").getValue()
                        }
                        this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")


                        this.getView().getModel("oGenericModel").setProperty("/checkBoxVisible", true);

                        this.getView().getModel("oGenericModel").setProperty("/SalesCheckBoxVisible", true);
                        this.getView().byId("idCheckBox").setSelected(false)
                    }
                    else {
                        this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    }
                } else if (oCommonModel.getProperty('/displayObject').Action === "Create" && (gateType === '3' || gateType === '4' || gateType === '5' || gateType === '6' || gateType === '7')) {
                    // if (gateType === '1') {
                    //     this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                    // }
                    if (gateType === '3') {
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.onReadValueHelpData("VendorValueHelp");
                        this.onReadValueHelpData("Vendor_CustomerValueHelp");
                        this.onReadValueHelpData("MaterialValueHelp");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (gateType === '4') {
                        this.getView().getModel("oGenericModel").setProperty("/buttonVisible", false);
                        // this.getView().getModel("oGenericModel").setProperty("/editable", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.onReadValueHelpData("VendorValueHelp");
                        this.onReadValueHelpData("Vendor_CustomerValueHelp");
                        this.onReadValueHelpData("MaterialValueHelp");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }

                    if (gateType === '5') {
                        // this.getView().getModel("oGenericModel").setProperty("/visible", true);
                        this.getView().getModel("oGenericModel").setProperty("/checkBoxVisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        // this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);

                        this.getView().getModel("oGenericModel").setProperty("/editable", false);
                        this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                        // this.getView().byId("idOut").setValue(oDate.getDate() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getFullYear());
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }

                    if (gateType === '6') {
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }

                    if (gateType === '7') {
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                    }
                    this.getView().getModel("oGenericModel").setProperty("/editable", true);

                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                }
                else if (oCommonModel.getProperty('/displayObject').Action === "Change") {
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '6') {
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '1') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateinvisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateindatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                        this.getView().getModel("oGenericModel").setProperty("/SalesCheckBoxVisible", true);
                        this.getView().byId("idCheckBox").setSelected(false)
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '3') {
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '4') {
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '5') {
                        this.onreadGateData();
                        // this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                        // this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/checkBoxVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                        // this.getView().getModel("oGenericModel").setProperty("/gateInFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/entrydateeditable", true);
                        this.getView().getModel("oGenericModel").setProperty("/vehicleindurationvisible", true);

                        // this.getView().getModel("oGenericModel").setProperty("/gateinvisible", false);
                        // this.getView().getModel("oGenericModel").setProperty("/gateindatevisible", true);

                        if (id === "CB9980000128" || id === "CB9980000040" || id === "CB9980000108" || id === "CB9980000085" || id === "CB9980000089" || id === "CB9980000090" || id === "CB9980000080") {
                            this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                            this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                        }

                    }
                    else {
                        this.getView().getModel("oGenericModel").setProperty("/editable", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateEntryNumEdit", true);
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", true);
                        this.onreadGateData();
                        this.onReadValueHelpData("VendorValueHelp");
                        this.onReadValueHelpData("Vendor_CustomerValueHelp");
                        this.onReadValueHelpData("MaterialValueHelp");
                    }
                }
                else if ((oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '1') || (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '2') || (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '5') || (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '4') || (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '6')) {
                    this.onreadGateData();
                    if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '5') {
                        this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                        this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/entrydateeditable", false);
                        if (id === "CB9980000128" || id === "CB9980000040" || id === "CB9980000108" || id === "CB9980000085" || id === "CB9980000089" || id === "CB9980000090" || id === "CB9980000080") {
                            this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                            this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                        }
                    }
                    if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '1') {
                        this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                    }
                    if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '2') {
                        this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/EntryTimeVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                    }
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Create" && gateType === '3') {
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '1') {
                    this.getView().getModel("oGenericModel").setProperty("/editable", true);
                }
                else if (oCommonModel.getProperty('/displayObject').Action === "Gate Out" && gateType === '2') {
                    this.getView().getModel("oGenericModel").setProperty("/gateinvisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                }
            },

            onSelect: function () {
                var checkboxValue = this.byId("idCheckBox").getSelected();

                if (checkboxValue === true) {
                    this.getView().getModel("oGenericModel").setProperty("/gateInFlag", true);
                } else {
                    this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                }

            },

            SelectCheckBox: function () {
                var id = sap.ushell.Container.getService("UserInfo").getId()

                if (id === "CB9980000121") {
                    var oDate = new Date();
                    var currentdate = oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate();
                    var currenttime = oDate.toLocaleString('en-US', {
                        hour12: false,
                    }).slice(11);
                    var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                    var gateType = oCommonModel.getProperty('/displayObject').GateType;
                    var oTableModel = this.getView().getModel('oTableItemModel');
                    var oGenericModel = this.getView().getModel("oGenericModel");
                    var checkboxValue = this.byId("idCheckBox").getSelected();
                    if (checkboxValue === true) {
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", true);
                    } else {
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                    }


                    // if (checkboxValue === true) {
                    //     if (oCommonModel.getProperty("/displayObject").Action === "Change" && gateType === '1') {
                    //         var obj = {
                    //             "currentDate1": currentdate,
                    //             "currentTime1": currenttime,
                    //             "currentDate": currentdate,
                    //             "currentTime": this.getView().byId("idTimeOut1").getValue()
                    //         }
                    //         this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                    //     }
                    // } else {
                    //     if (oCommonModel.getProperty("/displayObject").Action === "Change" && gateType === '1') {
                    //         var obj = {
                    //             "currentDate1": "",
                    //             "currentTime1": "",
                    //             "currentDate": currentdate,
                    //             "currentTime": this.getView().byId("idTimeOut1").getValue()
                    //         }
                    //         this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                    //     }

                    // }
                }
            },

            GetClock: function () {

                var tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
                var tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                var d = new Date();
                var nday = d.getDay(),
                    nmonth = d.getMonth(),
                    ndate = d.getDate(),
                    nyear = d.getYear(),
                    nhour = d.getHours(),
                    nmin = d.getMinutes(),
                    nsec = d.getSeconds(),
                    ap;
                if (nhour === 0) {
                    ap = " AM";
                    nhour = 12;
                } else if (nhour < 12) {
                    ap = " AM";
                } else if (nhour == 12) {
                    ap = " PM";
                } else if (nhour > 12) {
                    ap = " PM";
                    nhour -= 12;
                }
                if (nyear < 1000) nyear += 1900;
                if (nmin <= 9) nmin = "0" + nmin;
                if (nsec <= 9) nsec = "0" + nsec;
                var result = "" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "";
                return result;
            },
            // Its Old Function
            onReadValueHelpData1: function (sTypeName) {
                var oModel = this.getOwnerComponent().getModel();
                var sPath = "";
                var oGenericModel = this.getView().getModel("oGenericModel");
                if (sTypeName === 'VendorValueHelp') {
                    sPath = "/SUPPLIER";
                } else if (sTypeName === 'MaterialValueHelp') {
                    sPath = "/MATERIAL";
                }
                oModel.read(sPath, {
                    async: true,
                    urlParameters: {
                        "$top": "5000000"
                    },
                    success: function (oresponse) {
                        oGenericModel.setProperty("/" + sTypeName, oresponse.results);
                    }.bind(this),
                    error: function () {

                    }.bind(this)
                });
            },
            onReadValueHelpData: function (sTypeName) {
                var oModel = this.getOwnerComponent().getModel();
                var oModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCUST_F4")

                var sPath = "";
                var oGenericModel = this.getView().getModel("oGenericModel");
                if (sTypeName === 'VendorValueHelp') {
                    sPath = "/SUPPLIER";
                    oModel.read(sPath, {
                        async: true,
                        urlParameters: {
                            "$top": "5000000"
                        },
                        success: function (oresponse) {
                            oGenericModel.setProperty("/" + sTypeName, oresponse.results);
                        }.bind(this),
                        error: function () {

                        }.bind(this)
                    });
                } else if (sTypeName === 'Vendor_CustomerValueHelp') {
                    var aVenderSupplier = []

                    oModel.read("/SUPPLIER", {
                        async: true,
                        urlParameters: {
                            "$top": "5000000"
                        },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var obj = {
                                    "Supplier": items.Supplier,
                                    "SupplierName": items.SupplierName,
                                    "Type": "Vendor",
                                }
                                aVenderSupplier.push(obj)
                            })
                            oGenericModel.setProperty("/" + sTypeName, aVenderSupplier);
                        }.bind(this)
                    });
                    oModel2.read("/ZCust_f4", {
                        urlParameters: {
                            "$top": "5000000"
                        },
                        success: function (ores) {
                            ores.results.map(function (item) {
                                var obj = {
                                    "Supplier": item.Customer,
                                    "SupplierName": item.CustomerName,
                                    "Type": "Customer",
                                }
                                aVenderSupplier.push(obj)
                            })
                            oGenericModel.setProperty("/" + sTypeName, aVenderSupplier);
                        }.bind(this)
                    })

                } else if (sTypeName === 'MaterialValueHelp') {
                    sPath = "/MATERIAL";
                    oModel.read(sPath, {
                        async: true,
                        urlParameters: {
                            "$top": "5000000"
                        },
                        success: function (oresponse) {
                            oGenericModel.setProperty("/" + sTypeName, oresponse.results);
                        }.bind(this),
                        error: function () {

                        }.bind(this)
                    });
                }

            },
            onCheckWeight: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var Gross = Number(this.getView().byId("idGross").getValue());
                var Tare = Number(this.getView().byId("idTare").getValue());
                var NetWt = null;
                if (oEvent.getSource().getCustomData()[0].getKey() === 'tareWeight') {

                    if (this.getView().byId("idGross").getVisible()) {
                        if (Tare >= Gross) {
                            MessageBox.show("Tare weight should not be greater than or equal to Gross weight");
                            this.getView().byId("idGross").setValueState("Error");
                            this.getView().byId("idTare").setValueState("Error");
                        } else {
                            NetWt = Gross - Tare;
                            oCommonModel.setProperty("/NetWeight", NetWt);
                            this.getView().byId("idGross").setValueState("None");
                            this.getView().byId("idTare").setValueState("None");
                        }
                    }
                }
                else {
                    if (Gross <= Tare) {
                        this.getView().byId("idGross").setValueState("Error");
                        this.getView().byId("idTare").setValueState("Error");
                        MessageBox.show("Tare weight should not be greater than or equal to Gross weight");
                    } else {
                        NetWt = Gross - Tare;
                        oCommonModel.setProperty("/NetWeight", NetWt);
                        this.getView().byId("idGross").setValueState("None");
                        this.getView().byId("idTare").setValueState("None");
                    }
                }



            },

            attachChange: function (oEvent) {
                var comboValue = oEvent.getSource().getSelectedKey();
                var valueEntered = this.getView().byId("idPurchG").getValue();

                if (valueEntered != comboValue) {
                    MessageBox.error("Select correct purchase group");
                }

            },

            onSubmit: function () {
                var oGateEntryHeadModel = this.getView().getModel('oGateEntryHeadModel');
                // var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var GrossWt = Number(this.getView().byId("idGross").getValue());
                var TareWt = Number(this.getView().byId("idTare").getValue());
                var NetWeight;

                if (GrossWt > TareWt) {
                    NetWeight = parseFloat(GrossWt - TareWt).toFixed(2);
                    oGateEntryHeadModel.setProperty("/NetWt", NetWeight);
                } else {
                    MessageBox.error("Tare weight cannot be greater than or equal to Gross weight");
                }
            },

            fnChange: function (oEvent) {
                var today = new Date();
                var gateInDate = oEvent.getSource().getDateValue();

                if (gateInDate > today) {
                    oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
                } else {
                    oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
                }
            },

            dtChange: function (oEvent) {
                var today = new Date();
                var time = today.toLocaleTimeString();
                var gateInTime = oEvent.getSource().getValue();

                if (gateInTime > time) {
                    oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
                } else {
                    oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
                }
            },

            readGateData: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oModel = this.getView().getModel();
                var oGenericModel = this.getView().getModel("oGenericModel");
                var gatenumber = this.getView().byId("refGate").getValue();
                // var gatenumber = oCommonModel.getProperty('/displayObject').GateNum;
                var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gatenumber);
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read("/zgat", {
                    filters: [oFilter],
                    urlParameters: {
                        "$expand": "to_gateitem"
                    },
                    success: function (oresponse) {
                        // if (oresponse.results[0].to_gateitem.results.length === 0) {
                        //     oGenericModel.setProperty("/isRowItemEmpty", true);
                        //     this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        // } else {
                        //     oGenericModel.setProperty("/isRowItemEmpty", false);
                        //     this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                        // }



                        this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");
                        // oCommonModel.setProperty('/plantObject', {
                        //     "Plant": oresponse.results[0].Plant,
                        //     "PlantName": oresponse.results[0].PlantName
                        // });
                        var Gatenum = this.getView().byId("idInput").getValue();
                        this.getView().byId("refGate").setValue(Gatenum);
                        if (oresponse.results.length > 0) {
                            oTableModel.setProperty("/aTableItem", oresponse.results[0].to_gateitem.results);
                            //this.getView().byId('table1').setVisibleRowCount(oresponse.results[0].to_gateitem.results.length);
                        }
                        oBusyDialog.close();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });
            },

            onreadGateData: function () {
                var oDate = new Date();
                var currentdate = oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate();
                var currenttime = oDate.toLocaleString('en-US', {
                    hour12: false,
                }).slice(10);
                var oGateEntryHeadModel = this.getView().getModel("oGateEntryHeadModel");
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oModel = this.getView().getModel();
                var oGenericModel = this.getView().getModel("oGenericModel");
                var gatenumber = oCommonModel.getProperty('/displayObject').GateNum;
                var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gatenumber);
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read("/zgat", {
                    filters: [oFilter],
                    urlParameters: {
                        "$expand": "to_gateitem"
                    },
                    success: function (oresponse) {
                        if (oresponse.results[0].to_gateitem.results.length === 0) {
                            oGenericModel.setProperty("/isRowItemEmpty", true);
                            // this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        } else {
                            oGenericModel.setProperty("/isRowItemEmpty", false);
                            // this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                        }

                        if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '5') {
                            var obj = {
                                "currentDate": currentdate,
                                "currentTime": currenttime
                            }
                            this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                        }

                        if (oCommonModel.getProperty("/displayObject").Action === "Change" && (gateType === '5')) {
                            if (oresponse.results[0].GateInDate != "" && oresponse.results[0].GateInTm != "") {
                                this.getView().getModel("oGenericModel").setProperty("/gateinvisible", true);
                                this.getView().getModel("oGenericModel").setProperty("/gateindatevisible", false);
                                this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", true);
                                this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", false);
                            } else {
                                this.getView().getModel("oGenericModel").setProperty("/gateinvisible", false);
                                this.getView().getModel("oGenericModel").setProperty("/gateindatevisible", true);
                                this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                                this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                                var obj = {
                                    "currentDate": currentdate,
                                    "currentTime": currenttime,
                                    "currentDate1": currentdate,
                                    "currentTime1": currenttime
                                }
                                this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                            }
                        }

                        if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '1') {
                            var obj = {
                                "currentDate": currentdate,
                                "currentTime": currenttime
                            }
                            this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                        }

                        if (oCommonModel.getProperty("/displayObject").Action === "Change" && gateType === '1') {
                            this.getView().getModel("oGenericModel").setProperty("/gateinvisible", false);
                            this.getView().getModel("oGenericModel").setProperty("/gateindatevisible", true);
                            this.getView().getModel("oGenericModel").setProperty("/gateoutvisible", false);
                            this.getView().getModel("oGenericModel").setProperty("/gateoutOutdatevisible", true);
                            // var obj = {
                            //     "currentDate": currentdate,
                            //     "currentTime": currenttime,
                            //     "currentDate1": currentdate,
                            //     "currentTime1": currenttime
                            // }
                            // this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                            // this.getView().byId("picker1").setValue();
                            // this.getView().byId("idGateInTime1").setValue();
                        }
                        if (oCommonModel.getProperty("/displayObject").Action === "Change" && gateType === '2') {
                            var obj = {
                                "currentDate": currentdate,
                                "currentTime": currenttime
                            }
                            this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                        }
                        if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '2') {
                            var obj = {
                                "currentDate": currentdate,
                                "currentTime": currenttime
                            }
                            this.getView().setModel(new JSONModel(obj), "oCurrentDateModel")
                        }
                        // this.getView().getModel("oWeightModel").setProperty("/GrossWt", oresponse.results.GrossWt)
                        this.getView().getModel("oWeightModel").setProperty("/GrossWt", oresponse.results[0].GrossWt)
                        this.getView().getModel("oTareWeightModel").setProperty("/TareWt", oresponse.results[0].TareWt)

                        this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");

                        if ((oCommonModel.getProperty("/displayObject").Action === "Change" && gateType === '5') || (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '5')) {
                            var timeD = oresponse.results[0].Entrytime.ms;
                            var seconds = Math.floor((timeD / 1000) % 60);
                            var minutes = Math.floor(((timeD / (1000 * 60)) % 60));
                            var hours = Math.floor(((timeD / (1000 * 60 * 60)) % 24));
                            const time = hours + ":" + minutes + ":" + seconds

                            this.getView().setModel(new sap.ui.model.json.JSONModel(), "oReportingTimeModel")
                            this.getView().getModel("oReportingTimeModel").setProperty("/Entrytime", time)

                        }
                        if ((oCommonModel.getProperty("/displayObject").Action === "Change" && gateType === '1') || (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '1') || (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '2') || (oCommonModel.getProperty("/displayObject").Action === "Change" && gateType === '2')) {
                            var timeD = oresponse.results[0].Entrytime.ms;
                            var seconds = Math.floor((timeD / 1000) % 60);
                            var minutes = Math.floor(((timeD / (1000 * 60)) % 60));
                            var hours = Math.floor(((timeD / (1000 * 60 * 60)) % 24));
                            const time = hours + ":" + minutes + ":" + seconds

                            this.getView().setModel(new sap.ui.model.json.JSONModel(), "oReportingTimeModel")
                            this.getView().getModel("oReportingTimeModel").setProperty("/Entrytime", time)

                        }
                        // oCommonModel.setProperty('/plantObject', {
                        //     "Plant": oresponse.results[0].Plant,
                        //     "PlantName": oresponse.results[0].PlantName
                        // });
                        if (oresponse.results.length > 0) {
                            oTableModel.setProperty("/aTableItem", oresponse.results[0].to_gateitem.results);
                            //this.getView().byId('table1').setVisibleRowCount(oresponse.results[0].to_gateitem.results.length);
                        }
                        oBusyDialog.close();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });

            },

            handleSaveGateEntryData: function () {
                var gateEntrytype = this.getOwnerComponent().getModel('oCommonModel').getProperty('/displayObject').GateType;
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Saving data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                var VehicleNumber = this.getView().byId("vehno").getValue();
                var OperatorName = this.getView().byId("idOpr").getValue();

                if (VehicleNumber == "") {
                    oBusyDialog.close();
                    MessageBox.error("Please Enter Vehicle Number")
                } else if (OperatorName == "" && (gateEntrytype == 3 || gateEntrytype == 4)) {
                    oBusyDialog.close();
                    MessageBox.error("Please Enter Operator Name")
                }
                else {

                    // var Lrdate = this.getView().byId("idLrDate").getValue();
                    // var Lrdate1 = Lrdate.split("-");
                    // if (Lrdate1[1].length != 2) {
                    //     var Lrdate2 = Lrdate1[0] + "-" + 0 + Lrdate1[1] + "-" + Lrdate1[2]
                    // } else {
                    //     Lrdate2 = Lrdate
                    // }
                    // oGateEntryHeadModel.getData().LrDate = Lrdate2

                    // var InvoiceDate = this.getView().byId("idInvoiceDate").getValue();
                    // var InvoiceDate1 = InvoiceDate.split("-");
                    // if (InvoiceDate1[1].length != 2) {
                    //     var InvoiceDate2 = InvoiceDate1[0] + "-" + 0 + InvoiceDate1[1] + "-" + InvoiceDate1[2]
                    // } else {
                    //     InvoiceDate2 = InvoiceDate
                    // }
                    // oGateEntryHeadModel.getData().Invdt = InvoiceDate2

                    // var EntryDate = this.getView().byId("idEntryDate").getValue();
                    // var EntryDate1 = EntryDate.split("-")
                    // if (EntryDate1[1].length != 2) {
                    //     var EntryDate2 = EntryDate1[0] + "-" + 0 + EntryDate1[1] + "-" + EntryDate1[2]
                    // } else {
                    //     EntryDate2 = EntryDate
                    // }
                    // oGateEntryHeadModel.getData().Entrydate = EntryDate2;

                    // if (gatetype === 1 || gatetype === 2 || (gatetype === 3 && oCommonModel.getProperty('/displayObject').gatInOutKey === 'In') || gatetype === 5 || gatetype === 6) {
                    //     var GateInDate = this.getView().byId("picker0").getValue();
                    //     var GateInDate1 = GateInDate.split("-")
                    //     if (GateInDate1[1].length != 2) {
                    //         var GateInDate2 = GateInDate1[0] + "-" + 0 + GateInDate1[1] + "-" + GateInDate1[2]
                    //     } else {
                    //         GateInDate2 = GateInDate
                    //     }
                    //     oGateEntryHeadModel.getData().GateInDate = GateInDate2;
                    // }

                    // if (gatetype === 2 || (gatetype === 3 && oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out') || gatetype === 4) {
                    //     var GateOutDate = this.getView().byId("idOut").getValue();
                    //     var GateOutDate1 = GateOutDate.split("-");
                    //     if (GateOutDate1[1].length != 2) {
                    //         var GateOutDate2 = GateOutDate1[0] + "-" + 0 + GateOutDate1[1] + "-" + GateOutDate1[2]
                    //     } else {
                    //         GateOutDate2 = GateOutDate
                    //     }
                    //     oGateEntryHeadModel.getData().GateOutDt = GateOutDate2;
                    // }

                    // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();
                    var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');

                    if (oCommonModel.getProperty('/displayObject').Action === "Create") {
                        // this.onReadNumberRange();
                        // setTimeout(function () {
                        var cancel = this.getView().byId("idCancel").getSelected().toString();
                        var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                        var gatetype = oCommonModel.getProperty('/displayObject').GateType;
                        var oModel = this.getView().getModel();
                        var aheaderObj = [];
                        var oTableModel = this.getView().getModel('oTableItemModel');
                        var oTableData = oTableModel.getProperty('/aTableItem');
                        var oGateEntryHeadModel = this.getView().getModel("oGateEntryHeadModel");
                        var sGateNum = oCommonModel.getProperty("/displayObject").GateNum;
                        var oGenericModel = this.getView().getModel("oGenericModel");
                        var oGrossWt = this.getView().byId("idGross").getValue();
                        var oTareWt = this.getView().byId("idTare").getValue();
                        var oNetWt = this.getView().byId("idNet").getValue();
                        var TypeOfReturn = this.getView().byId("TypeOfReturn").getValue();
                        var entryTime = this.getView().byId("idEntryTime").getValue();


                        var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                        var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;

                        oGateEntryHeadModel.getData().Gateno = oCommonModel.getProperty("/GateEntryGeneratedNum");
                        // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();

                        oTableModel.getProperty("/aTableItem").map(function (items) {
                            delete items.NetPriceAmount
                        })

                        oGateEntryHeadModel.getData().to_gateitem.results = oTableModel.getProperty("/aTableItem");
                        oGateEntryHeadModel.getData().NetWt = this.getView().byId("idNet").getValue();
                        // oGateEntryHeadModel.getData().Driveralcoholic = this.getView().byId("idAlcoholic").getSelectedButton().getText();
                        aheaderObj.push(oGateEntryHeadModel.getData());

                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && (gatetype === '3' || gatetype === '4' || gatetype === '5' || gatetype === '6')) {
                            var str = oGateEntryHeadModel.getData().Invdt
                            var ymd = str.split("-")
                            var year = ymd[0]
                            if (ymd[1].length < 2) {
                                var month = "0" + ymd[1]
                            } else {
                                month = ymd[1]
                            }

                            if (ymd[2].length < 2) {
                                var day = "0" + ymd[2]
                            } else {
                                day = ymd[2]
                            }
                            var date = year + "-" + month + "-" + day
                            oGateEntryHeadModel.getData().Invdt = date
                        }

                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '1') {

                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }


                        }
                        // if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '3') {
                        //     if (oGrossWt.length === 0 || oTareWt.length === 0) {
                        //         oGateEntryHeadModel.getData().GrossWt = "0.00";
                        //         oGateEntryHeadModel.getData().TareWt = "0.00";
                        //     }

                        // }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '2') {

                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }

                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '4') {

                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }

                        }
                        if ((oCommonModel.getProperty('/displayObject').Action === "Gate Out" && gatetype === '5') || (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '5')) {
                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = parseFloat(oGrossWt).toFixed(2);
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = parseFloat(oTareWt).toFixed(2);
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }

                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '5') {
                            oGateEntryHeadModel.getData().GateOutDt = null;
                            oGateEntryHeadModel.getData().GateOutTm = null;
                            oGateEntryHeadModel.getData().GateInDate = null;
                            oGateEntryHeadModel.getData().GateInTm = null;

                            var time = entryTime.split(":")
                            if (time[0].length < 2) {
                                var time1 = "0" + time[0]
                            } else {
                                var time1 = time[0]
                            }
                            if (time[1].length < 2) {
                                var time2 = "0" + time[1]
                            } else {
                                var time2 = time[1]
                            }
                            if (time[2].length < 2) {
                                var time3 = "0" + time[2]
                            } else {
                                var time3 = time[2]
                            }
                            var timestring = time1 + time2 + time3
                            var timestring1 = timestring.replace(/:/g, '');
                            var hours = timestring1.substring(0, 2)
                            var minutes = timestring1.substring(2, 4);
                            var seconds = timestring1.substring(4);

                            var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
                            oGateEntryHeadModel.getData().Entrytime = iso8601Duration
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '3' && gateinout === 'Out') {
                            oGateEntryHeadModel.getData().Entrytime = null
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '3' && gateinout === 'In') {
                            oGateEntryHeadModel.getData().Entrytime = null
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '4') {
                            oGateEntryHeadModel.getData().Entrytime = null
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '1') {
                            oGateEntryHeadModel.getData().GateOutDt = null;
                            oGateEntryHeadModel.getData().GateOutTm = null;
                            oGateEntryHeadModel.getData().GateInDate = null;
                            oGateEntryHeadModel.getData().GateInTm = null;

                            var time = entryTime.split(":")
                            if (time[0].length < 2) {
                                var time1 = "0" + time[0]
                            } else {
                                var time1 = time[0]
                            }
                            if (time[1].length < 2) {
                                var time2 = "0" + time[1]
                            } else {
                                var time2 = time[1]
                            }
                            if (time[2].length < 2) {
                                var time3 = "0" + time[2]
                            } else {
                                var time3 = time[2]
                            }
                            var timestring = time1 + time2 + time3
                            var timestring1 = timestring.replace(/:/g, '');
                            var hours = timestring1.substring(0, 2)
                            var minutes = timestring1.substring(2, 4);
                            var seconds = timestring1.substring(4);

                            var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
                            oGateEntryHeadModel.getData().Entrytime = iso8601Duration
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '2') {
                            oGateEntryHeadModel.getData().GateOutDt = null;
                            oGateEntryHeadModel.getData().GateOutTm = null;
                            oGateEntryHeadModel.getData().GateInDate = null;
                            oGateEntryHeadModel.getData().GateInTm = null;

                            var time = entryTime.split(":")
                            if (time[0].length < 2) {
                                var time1 = "0" + time[0]
                            } else {
                                var time1 = time[0]
                            }
                            if (time[1].length < 2) {
                                var time2 = "0" + time[1]
                            } else {
                                var time2 = time[1]
                            }
                            if (time[2].length < 2) {
                                var time3 = "0" + time[2]
                            } else {
                                var time3 = time[2]
                            }
                            var timestring = time1 + time2 + time3
                            var timestring1 = timestring.replace(/:/g, '');
                            var hours = timestring1.substring(0, 2)
                            var minutes = timestring1.substring(2, 4);
                            var seconds = timestring1.substring(4);

                            var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
                            oGateEntryHeadModel.getData().Entrytime = iso8601Duration
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '6') {

                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }
                            oGateEntryHeadModel.getData().Entrytime = null

                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '6') {

                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }

                        }
                        if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').GateType === '3') {
                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                        }
                        if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').GateType === '3') {
                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }
                        }
                        if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                            oGateEntryHeadModel.getData().GateOutDt = "0.00";
                            oGateEntryHeadModel.getData().GateOutTm = "0.00";
                        }
                        if (gatetype === '4' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                            oGateEntryHeadModel.getData().GateInDate = "0.00";
                            oGateEntryHeadModel.getData().GateInTm = "0.00";
                        }
                        if (gatetype === '3' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }
                        }
                        if (gatetype === '3' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                            if (oGrossWt.length === 0) {
                                oGateEntryHeadModel.getData().GrossWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                            }

                            if (oTareWt.length === 0) {
                                oGateEntryHeadModel.getData().TareWt = "0.00";
                            } else {
                                oGateEntryHeadModel.getData().TareWt = oTareWt;
                            }

                            if (oNetWt.length === 0) {
                                oGateEntryHeadModel.getData().NetWt = "0.00";
                            }
                        }

                        oModel.create("/zgat", oGateEntryHeadModel.getData(), {
                            method: "POST",
                            success: function (data) {
                                oBusyDialog.close();
                                MessageBox.success("Gate no." + oCommonModel.getProperty("/GateEntryGeneratedNum") + " generated successfully!", {
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            var oHistory = sap.ui.core.routing.History.getInstance();
                                            var sPreviousHash = oHistory.getPreviousHash();

                                            if (sPreviousHash !== undefined) {
                                                window.history.go(-1);
                                            } else {
                                                var oRouter = this.getOwnerComponent().getRouter();
                                                oRouter.navTo("Gate", {}, true);
                                            }
                                        }
                                    }.bind(this)
                                });
                            }.bind(this),
                            error: function (e) {
                                oBusyDialog.close();
                                // alert("error");
                            }
                        });
                        // }.bind(this), 3000);
                    } else if (oCommonModel.getProperty('/displayObject').Action === "Change" || oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
                        var cancel = this.getView().byId("idCancel").getSelected().toString();
                        var gatetype = oCommonModel.getProperty('/displayObject').GateType;
                        var oModel = this.getView().getModel();
                        var aheaderObj = [];
                        var oTableModel = this.getView().getModel('oTableItemModel');
                        var oTableData = oTableModel.getProperty('/aTableItem');
                        var oGateEntryHeadModel = this.getView().getModel("oGateEntryHeadModel");
                        var sGateNum = oCommonModel.getProperty("/displayObject").GateNum;
                        var oGenericModel = this.getView().getModel("oGenericModel");
                        var oGrossWt = this.getView().byId("idGross").getValue();
                        var oTareWt = this.getView().byId("idTare").getValue();
                        var oNetWt = this.getView().byId("idNet").getValue();
                        var TypeOfReturn = this.getView().byId("TypeOfReturn").getValue();
                        var entryTime = this.getView().byId("idEntryTime").getValue();
                        var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                        var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;
                        var gateoutdate = this.getView().byId("idOut").getValue();
                        var gateouttime = this.getView().byId("idTimeOut").getValue();
                        var gateindate = this.getView().byId("picker0").getValue();
                        var gateintime = this.getView().byId("idGateInTime").getValue();

                        if (gateoutdate != "") {
                            var gateOutDate = gateoutdate
                            var gateOutTime = gateouttime
                            var gateInDate = gateindate
                            var gateInTime = gateintime

                            var startdatetime = (gateInDate + " " + gateInTime).replace(/-/g, '/')
                            var startdatetime1 = new Date(startdatetime)
                            var enddatetime = (gateOutDate + " " + gateOutTime).replace(/-/g, '/')
                            var enddatetime1 = new Date(enddatetime)

                            var milliseconds = Math.abs(enddatetime1 - startdatetime1)
                            var seconds = Math.floor((milliseconds / 1000) % 60);
                            var minutes = Math.floor((milliseconds / 1000 / 60) % 60);
                            var hours = Math.floor(milliseconds / 3600000);
                            var formattedTime = [
                                hours.toString().padStart(2, "0"),
                                minutes.toString().padStart(2, "0"),
                                seconds.toString().padStart(2, "0")
                            ].join(":");
                            if (formattedTime === "NaN:NaN:NaN") {
                                var timeduration = "0.00"
                            } else {
                                timeduration = formattedTime
                                oGateEntryHeadModel.getData().Duration1 = timeduration
                                this.getView().byId("idVehicleDuration").setValue(timeduration)
                                // this.getView().getModel("VehicleInDuration").setProperty("/duration", timeduration)
                            }
                        }

                        oGateEntryHeadModel.getData().Duration1 = timeduration

                        oGateEntryHeadModel.getData().Gateno = oCommonModel.getProperty("/GateEntryGeneratedNum");
                        // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();
                        oTableModel.getProperty("/aTableItem").map(function (items) {
                            delete items.NetPriceAmount
                        })
                        oGateEntryHeadModel.getData().to_gateitem.results = oTableModel.getProperty("/aTableItem");
                        oGateEntryHeadModel.getData().NetWt = this.getView().byId("idNet").getValue();
                        // oGateEntryHeadModel.getData().Driveralcoholic = this.getView().byId("idAlcoholic").getSelectedButton().getText();
                        aheaderObj.push(oGateEntryHeadModel.getData());

                        oGateEntryHeadModel.getData().GrossWt = this.getView().byId("idGross").getValue();
                        oGateEntryHeadModel.getData().TareWt = this.getView().byId("idTare").getValue();
                        oGateEntryHeadModel.getData().NetWt = this.getView().byId("idNet").getValue();

                        delete oGateEntryHeadModel.getData().ZDAY
                        delete oGateEntryHeadModel.getData().ZMONTH
                        delete oGateEntryHeadModel.getData().ZYEAR
                        delete oGateEntryHeadModel.getData().DAYMONTH

                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && (gatetype === '3' || gatetype === '4' || gatetype === '5' || gatetype === '6')) {
                            var str = oGateEntryHeadModel.getData().Invdt
                            var ymd = str.split("-")
                            var year = ymd[0]
                            if (ymd[1].length < 2) {
                                var month = "0" + ymd[1]
                            } else {
                                month = ymd[1]
                            }

                            if (ymd[2].length < 2) {
                                var day = "0" + ymd[2]
                            } else {
                                day = ymd[2]
                            }
                            var date = year + "-" + month + "-" + day
                            oGateEntryHeadModel.getData().Invdt = date
                        }

                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
                            if (cancel === "false")
                                oGateEntryHeadModel.getData().Cancelled = "";

                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
                            if (cancel === "true")
                                oGateEntryHeadModel.getData().Cancelled = "X";

                        }

                        if (gatetype === '5' && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
                            oGateEntryHeadModel.getData().GateOutDt = this.getView().byId("idOut1").getValue();
                            oGateEntryHeadModel.getData().GateOutTm = this.getView().byId("idTimeOut1").getValue();
                        }
                        if ((gatetype === '5' || gatetype === '1') && oCommonModel.getProperty('/displayObject').Action === "Change") {
                            var checkbox = this.getView().byId("idCheckBox").getSelected();
                            if (checkbox === false) {
                                oGateEntryHeadModel.getData().GateInDate = null;
                                oGateEntryHeadModel.getData().GateInTm = null;
                            } else {
                                oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
                                oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
                            }
                        }
                        if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Change") {
                            var checkbox = this.getView().byId("idCheckBox").getSelected();
                            // if (checkbox === false) {
                            //     oGateEntryHeadModel.getData().GateInDate = null;
                            //     oGateEntryHeadModel.getData().GateInTm = null;
                            // } else {
                                oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
                                oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
                            // }
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
                            var time = entryTime.split(":")
                            if (time[0].length < 2) {
                                var time1 = "0" + time[0]
                            } else {
                                var time1 = time[0]
                            }
                            if (time[1].length < 2) {
                                var time2 = "0" + time[1]
                            } else {
                                var time2 = time[1]
                            }
                            if (time[2].length < 2) {
                                var time3 = "0" + time[2]
                            } else {
                                var time3 = time[2]
                            }

                            var timestring = time1 + time2 + time3

                            var timestring1 = entryTime.replace(/:/g, '');
                            var hours = timestring.substring(0, 2)
                            var minutes = timestring.substring(2, 4);
                            var seconds = timestring.substring(4);

                            var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
                            oGateEntryHeadModel.getData().Entrytime = iso8601Duration
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '3' && gateinout === 'Out') {
                            oGateEntryHeadModel.getData().Entrytime = null
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '3' && gateinout === 'In') {
                            oGateEntryHeadModel.getData().Entrytime = null
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '4') {
                            oGateEntryHeadModel.getData().Entrytime = null
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '6') {
                            oGateEntryHeadModel.getData().Entrytime = null
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '1') {
                            var time = entryTime.split(":")
                            if (time[0].length < 2) {
                                var time1 = "0" + time[0]
                            } else {
                                var time1 = time[0]
                            }
                            if (time[1].length < 2) {
                                var time2 = "0" + time[1]
                            } else {
                                var time2 = time[1]
                            }
                            if (time[2].length < 2) {
                                var time3 = "0" + time[2]
                            } else {
                                var time3 = time[2]
                            }

                            var timestring = time1 + time2 + time3

                            var timestring1 = entryTime.replace(/:/g, '');
                            var hours = timestring.substring(0, 2)
                            var minutes = timestring.substring(2, 4);
                            var seconds = timestring.substring(4);

                            var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
                            oGateEntryHeadModel.getData().Entrytime = iso8601Duration
                        }
                        if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '2') {
                            oGateEntryHeadModel.getData().GateOutDt = null;
                            oGateEntryHeadModel.getData().GateOutTm = null;
                            oGateEntryHeadModel.getData().GateInDate = null;
                            oGateEntryHeadModel.getData().GateInTm = null;

                            var time = entryTime.split(":")
                            if (time[0].length < 2) {
                                var time1 = "0" + time[0]
                            } else {
                                var time1 = time[0]
                            }
                            if (time[1].length < 2) {
                                var time2 = "0" + time[1]
                            } else {
                                var time2 = time[1]
                            }
                            if (time[2].length < 2) {
                                var time3 = "0" + time[2]
                            } else {
                                var time3 = time[2]
                            }
                            var timestring = time1 + time2 + time3
                            var timestring1 = timestring.replace(/:/g, '');
                            var hours = timestring1.substring(0, 2)
                            var minutes = timestring1.substring(2, 4);
                            var seconds = timestring1.substring(4);

                            var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
                            oGateEntryHeadModel.getData().Entrytime = iso8601Duration
                        }
                        if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
                            oGateEntryHeadModel.getData().GateOutDt = this.getView().byId("idOut1").getValue();
                            oGateEntryHeadModel.getData().GateOutTm = this.getView().byId("idTimeOut1").getValue();
                        }
                        if (gatetype === '2' && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
                            oGateEntryHeadModel.getData().GateOutDt = this.getView().byId("idOut1").getValue();
                            oGateEntryHeadModel.getData().GateOutTm = this.getView().byId("idTimeOut1").getValue();
                        }
                        // if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Change") {
                        //     oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
                        //     oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
                        // }
                        if (gatetype === '2' && oCommonModel.getProperty('/displayObject').Action === "Change") {
                            oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
                            oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
                        }

                        if (cancel === "false") {
                            oGateEntryHeadModel.getData().Cancelled = "";
                        } else {
                            oGateEntryHeadModel.getData().Cancelled = "X";
                        }

                        if (oGenericModel.getProperty("/isRowItemEmpty")) {
                            if (oTableData.length === 0) {
                                if (oGenericModel.getProperty("/isRowItemEmpty") && oCommonModel.getProperty('/displayObject').Action === "Change") {
                                    delete oGateEntryHeadModel.getData().__metadata;
                                    delete oGateEntryHeadModel.getData().to_gateitem;
                                    oModel.update("/zgat(Gateno='" + sGateNum + "')", oGateEntryHeadModel.getData(), {
                                        success: function (data) {
                                            oBusyDialog.close();
                                            MessageBox.success("Gate no. updated successfully!", {
                                                onClose: function (oAction) {
                                                    if (oAction === MessageBox.Action.OK) {
                                                        var oHistory = sap.ui.core.routing.History.getInstance();
                                                        var sPreviousHash = oHistory.getPreviousHash();

                                                        if (sPreviousHash !== undefined) {
                                                            window.history.go(-1);
                                                        } else {
                                                            var oRouter = this.getOwnerComponent().getRouter();
                                                            oRouter.navTo("Gate", {}, true);
                                                        }
                                                    }
                                                }.bind(this)
                                            });
                                            // alert("success");
                                        }.bind(this),
                                        error: function (e) {
                                            oBusyDialog.close();
                                            alert("error");
                                        }
                                    });

                                } else if (oGenericModel.getProperty("/isRowItemEmpty") && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
                                    delete oGateEntryHeadModel.getData().__metadata;
                                    delete oGateEntryHeadModel.getData().to_gateitem;
                                    oModel.update("/zgat(Gateno='" + sGateNum + "')", oGateEntryHeadModel.getData(), {
                                        success: function (data) {
                                            oBusyDialog.close();
                                            MessageBox.success("Gate no. updated successfully!", {
                                                onClose: function (oAction) {
                                                    if (oAction === MessageBox.Action.OK) {
                                                        var oHistory = sap.ui.core.routing.History.getInstance();
                                                        var sPreviousHash = oHistory.getPreviousHash();

                                                        if (sPreviousHash !== undefined) {
                                                            window.history.go(-1);
                                                        } else {
                                                            var oRouter = this.getOwnerComponent().getRouter();
                                                            oRouter.navTo("Gate", {}, true);
                                                        }
                                                    }
                                                }.bind(this)
                                            });
                                            // alert("success");
                                        }.bind(this),
                                        error: function (e) {
                                            oBusyDialog.close();
                                            alert("error");
                                        }
                                    });

                                } else {
                                    delete oGateEntryHeadModel.getData().__metadata;
                                    delete oGateEntryHeadModel.getData().to_gateitem;
                                    oModel.update("/zgat(Gateno='" + sGateNum + "')", oGateEntryHeadModel.getData(), {
                                        success: function (data) {
                                            oBusyDialog.close();
                                            MessageBox.success("Gate no. updated successfully!", {
                                                onClose: function (oAction) {
                                                    if (oAction === MessageBox.Action.OK) {
                                                        var oHistory = sap.ui.core.routing.History.getInstance();
                                                        var sPreviousHash = oHistory.getPreviousHash();

                                                        if (sPreviousHash !== undefined) {
                                                            window.history.go(-1);
                                                        } else {
                                                            var oRouter = this.getOwnerComponent().getRouter();
                                                            oRouter.navTo("Gate", {}, true);
                                                        }
                                                    }
                                                }.bind(this)
                                            });
                                            // alert("success");
                                        }.bind(this),
                                        error: function (e) {
                                            oBusyDialog.close();
                                            alert("error");
                                        }
                                    });
                                }
                            } else {
                                oGateEntryHeadModel.getData().to_gateitem.results.map(function (item, index, arr) {
                                    delete item.__metadata;
                                    delete item.to_gatehead;
                                    // if (index === 0) {
                                    item.Gateno = sGateNum;
                                    delete item.NetPriceAmount
                                    oModel.create("/zgateitem_ent", item, {
                                        success: function (data) {
                                            if (index === arr.length - 1) {
                                                delete aheaderObj[0].__metadata;
                                                delete aheaderObj[0].to_gateitem;
                                                oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
                                                    success: function (data) {
                                                        oBusyDialog.close();
                                                        MessageBox.success("Gate no. updated successfully!", {
                                                            onClose: function (oAction) {
                                                                if (oAction === MessageBox.Action.OK) {
                                                                    var oHistory = sap.ui.core.routing.History.getInstance();
                                                                    var sPreviousHash = oHistory.getPreviousHash();

                                                                    if (sPreviousHash !== undefined) {
                                                                        window.history.go(-1);
                                                                    } else {
                                                                        var oRouter = this.getOwnerComponent().getRouter();
                                                                        oRouter.navTo("Gate", {}, true);
                                                                    }
                                                                }
                                                            }.bind(this)
                                                        });
                                                        // alert("success");
                                                    }.bind(this),
                                                    error: function (e) {
                                                        oBusyDialog.close();
                                                        alert("error");
                                                    }
                                                });

                                            }
                                        },
                                        error: function (e) {
                                            oBusyDialog.close();
                                        }
                                    });
                                    // }

                                }.bind(this));
                            }
                        } else {
                            oGateEntryHeadModel.getData().to_gateitem.results.map(function (item, index, arr) {
                                if (item.hasOwnProperty("__metadata")) {
                                    delete item.__metadata;
                                    delete item.to_gatehead;
                                    item.Gateno = sGateNum;
                                    // if (index === 0) {
                                    oModel.update("/zgateitem_ent(Gateno='" + item.Gateno + "',GateItem='" + item.GateItem + "')", item, {
                                        success: function (data) {
                                            if (index === arr.length - 1) {
                                                delete aheaderObj[0].__metadata;
                                                delete aheaderObj[0].to_gateitem;
                                                oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
                                                    success: function (data) {
                                                        oBusyDialog.close();
                                                        MessageBox.success("Gate no. updated successfully!", {
                                                            onClose: function (oAction) {
                                                                if (oAction === MessageBox.Action.OK) {
                                                                    var oHistory = sap.ui.core.routing.History.getInstance();
                                                                    var sPreviousHash = oHistory.getPreviousHash();

                                                                    if (sPreviousHash !== undefined) {
                                                                        window.history.go(-1);
                                                                    } else {
                                                                        var oRouter = this.getOwnerComponent().getRouter();
                                                                        oRouter.navTo("Gate", {}, true);
                                                                    }
                                                                }
                                                            }.bind(this)
                                                        });
                                                        // alert("success");
                                                    }.bind(this),
                                                    error: function (e) {
                                                        oBusyDialog.close();
                                                        alert("error");
                                                    }
                                                });

                                            }
                                        },
                                        error: function (e) {
                                            oBusyDialog.close();
                                        }
                                    });
                                    // }
                                } else {
                                    item.Gateno = sGateNum;
                                    oModel.create("/zgateitem_ent", item, {
                                        success: function (data) {
                                            if (index === arr.length - 1) {
                                                delete aheaderObj[0].__metadata;
                                                delete aheaderObj[0].to_gateitem;
                                                oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
                                                    success: function (data) {
                                                        oBusyDialog.close();
                                                        MessageBox.success("Gate no. updated successfully!", {
                                                            onClose: function (oAction) {
                                                                if (oAction === MessageBox.Action.OK) {
                                                                    var oHistory = sap.ui.core.routing.History.getInstance();
                                                                    var sPreviousHash = oHistory.getPreviousHash();

                                                                    if (sPreviousHash !== undefined) {
                                                                        window.history.go(-1);
                                                                    } else {
                                                                        var oRouter = this.getOwnerComponent().getRouter();
                                                                        oRouter.navTo("Gate", {}, true);
                                                                    }
                                                                }
                                                            }.bind(this)
                                                        });
                                                        // alert("success");
                                                    }.bind(this),
                                                    error: function (e) {
                                                        oBusyDialog.close();
                                                        alert("error");
                                                    }
                                                });

                                            }
                                        },
                                        error: function (e) {
                                            oBusyDialog.close();
                                        }
                                    });
                                }


                            }.bind(this));
                        }



                    }

                }
            },

            handleSavePurchaseData: function () {
                var gateEntrytype = this.getOwnerComponent().getModel('oCommonModel').getProperty('/displayObject').GateType;
                var VehicleNumber = this.getView().byId("vehno").getValue();
                var InvoiceDate = this.getView().byId("idInvoiceDate").getValue();
                var InvoiceNumber = this.getView().byId("InvoiceNumber").getValue();
                var OperatorName = this.getView().byId("idOpr").getValue();
                // var PurchaseOrder = this.getView().byId("idDel1").getValue();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem")
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gatetype = oCommonModel.getProperty('/displayObject').GateType;
                var checkboxValue = this.byId("idCheckBox").getSelected();

                if (VehicleNumber == "") {
                    MessageBox.error("Please Enter Vehicle Number")
                } else if (OperatorName == "") {
                    MessageBox.error("Please Enter Opertor Name")
                } else if (InvoiceDate == "" && gateEntrytype == 5) {
                    MessageBox.error("Please Enter Invoice Date")
                } else if (InvoiceNumber == "" && gateEntrytype == 5) {
                    MessageBox.error("Please Enter Invoice Number")
                }
                // else if (gateEntrytype == 5 && oTableModel.getProperty("/aTableItem").length === 0 ){
                //     MessageBox.error("Please Enter Purchase Order")
                // }
                //    else if (oCommonModel.getProperty('/displayObject').Action === "Change" && (gatetype === '5' && oTableModel.getProperty("/aTableItem").length === 0 )){
                //          MessageBox.error("Please Enter Purchase Order")
                //  }
                else if (oCommonModel.getProperty('/displayObject').Action === "Change" && (gatetype === '5' && oTableModel.getProperty("/aTableItem").length === 0)) {
                    MessageBox.error("Enter Purchase Order")
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Change" && (gatetype === '5' && checkboxValue === false)) {
                    MessageBox.error("Gate In Time Mandatory")
                }

                else {
                    var oTableModel = this.getView().getModel("oTableItemModel");
                    var aTableArr = oTableModel.getProperty("/aTableItem")
                    var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                    var gatetype = oCommonModel.getProperty('/displayObject').GateType;
                    var GateQuantity_ErrorArr = [];
                    var billQty_ErrorArr = [];
                    var oTableModel_Data = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                    for (var D = 0; D < oTableModel_Data.length; D++) {
                        var GateQuantity = oTableModel_Data[D].GateQty;
                        var billQunatity = oTableModel_Data[D].billQty;
                        // var PurchaseOrder = oTableModel_Data[D].PurchaseOrder;
                        // var compare = oTableModel_Data[D].OrderQuantity;


                        if (GateQuantity === "" || GateQuantity === null) {
                            return MessageBox.error('Gate Quantity Mandatory');
                        }

                        if (billQunatity === "" || billQunatity === null) {
                            return MessageBox.error('Actual Quantity Mandatory');
                        }

                        // if (PurchaseOrder === "" || PurchaseOrder === null){
                        //     return MessageBox.error(' Mandatory');

                        // }

                        // if (billQunatity > compare) {
                        //     return MessageBox.error('okkkkkkkk Quantity Mandatory');
                        // }




                        // if (GateQuantity == "" || GateQuantity == null) {
                        //     GateQuantity_ErrorArr.push("GateQuantity Empty");
                        // }
                        // else {
                        //     GateQuantity_ErrorArr = []
                        //     break;
                        // }

                    }

                    if (GateQuantity_ErrorArr.length > 0) {
                        MessageBox.error("Put at least one Gate Quantity")
                    }
                    // else if (billQty_ErrorArr.length > 0) {
                    //     MessageBox.error("Put at least one Bill Quantity")
                    // }
                    else {
                        if (oTableModel.getProperty("/aTableItem").length > 0) {
                            oTableModel.getProperty("/aTableItem").map(function (items) {
                                if (items.OrderQty === items.OpenQty) {
                                    this.getView().getModel("oGenericModel").setProperty("/validPO", false);
                                } else {
                                    this.getView().getModel("oGenericModel").setProperty("/validPO", true);
                                }
                            }.bind(this))
                        } else {
                            this.getView().getModel("oGenericModel").setProperty("/validPO", true);
                        }

                        if (gatetype === "5") {
                            for (var i = 0; i < aTableArr.length; i++) {
                                if (aTableArr[i].GateQty === "" || aTableArr[i].GateQty === null) {
                                    aTableArr.splice(i, 1)
                                }
                            }
                        }
                        // oTableModel.setProperty("/aTableItem", aTableArr)


                        var oGrossWt = this.getView().byId("idGross").getValue();
                        var oTareWt = this.getView().byId("idTare").getValue();
                        // if (this.getView().getModel("oGenericModel").getProperty("/checkValue") === true) {
                        //     MessageBox.error("Gate Quantity cannot be greater than the difference of Order Quantity and Gate Done Quantity.");
                        // } else if (oGrossWt.length === 0) {
                        //     MessageBox.error("Please enter Gross Weight");
                        // }
                        if (this.getView().getModel("oGenericModel").getProperty("/validPO") === false) {
                            MessageBox.error("Invalid PO")
                        }
                        else {
                            this.handleSaveGateEntryData();
                        }
                    }

                }
            },


            checkValue: function (oEvent) {
                var oModel = this.getView().getModel();

                var oContext = oEvent.getSource().getBindingContext('oTableItemModel').getObject();
                var difference = Number(oContext.OrderQty) - Number(oContext.OpenQty);
                if (Number(oEvent.getSource().getValue()) + Number(oContext.OpenQty) > Number(oContext.RsplName)) {
                    this.getView().getModel("oGenericModel").setProperty("/checkValue", true);
                    oEvent.getSource().setValueState('Error');
                    oEvent.getSource().setValueStateText('Entered Value is greater than Tolerance Value.');
                } else {
                    this.getView().getModel("oGenericModel").setProperty("/checkValue", false);
                    oEvent.getSource().setValueState('None');
                    oEvent.getSource().setValueStateText(' ');
                }

                // if ((Number(oContext.OpenQty) > Number(oContext.RsplName)) || (Number(oEvent.getSource().getValue()) > difference)) {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", true);
                //     oEvent.getSource().setValueState('Error');
                //     oEvent.getSource().setValueStateText('Gate Quantity cannot be greater than the difference of Order Quantity and Gate Done Quantity.');
                // } else {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", false);
                //     oEvent.getSource().setValueState('None');
                //     oEvent.getSource().setValueStateText(' ');
                // }


                // var difference = Number(oContext.OrderQty) - Number(oContext.OpenQty);
                // if (Number(oEvent.getSource().getValue()) > difference) {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", true);
                //     oEvent.getSource().setValueState('Error');
                //     oEvent.getSource().setValueStateText('Gate Quantity cannot be greater than the difference of Order Quantity and Gate Done Quantity.');
                // } else {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", false);
                //     oEvent.getSource().setValueState('None');
                //     oEvent.getSource().setValueStateText(' ');
                // }

                // var oTableModel = this.getView().getModel('oTableItemModel').getProperty("/aTableItem");
                // var length = oTableModel.length;
                // for (var i = 0; i < length; i++) {
                //     if (oTableModel[i].Bnfpo > (oTableModel[i].OrderQty - oTableModel[i].Banfn)) {
                //         MessageBox.error("Gate Quantity cannot be greater than the difference of Order Quantity and Gate Done Quantity.");
                //     }
                // }
            },


            checkValue1: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var sAction = oCommonModel.getProperty('/displayObject').Action;
                var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;
                var oContext = oEvent.getSource().getBindingContext('oTableItemModel').getObject();
                var GateDoneQty = Number(oContext.OutQty);
                var GateQty = Number(oContext.GateQty);

                if (gateType === '3' && gateinout === 'In' && sAction === 'Create') {
                    if (Number(oEvent.getSource().getValue()) > GateDoneQty) {
                        oEvent.getSource().setValueState('Error');
                        oEvent.getSource().setValueStateText('Gate Quantity cannot be greater than Gate Done Quantity.');
                    } else {
                        oEvent.getSource().setValueState('None');
                        oEvent.getSource().setValueStateText(' ');
                    }
                }
            },

            onReadDeliveryData55: function () {
                var lineItemModel = this.getView().getModel("itemDataModel").getProperty("/aItemData")
                var sDeliveryNum = this.getView().byId("idDel1").getValue();
                var sPath = "/delieverydata";
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var Plant = oCommonModel.getProperty('/plantObject');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var sFieldName = "";
                if (gateType === '1') {
                    sFieldName = "DeliveryDocument";
                } else if (gateType === '2') {
                    sFieldName = "invoice";
                } else if (gateType === '3') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                } else if (gateType === '4') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }
                else if (gateType === '5') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                } else if (gateType === '6') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }

                var oFilter = new sap.ui.model.Filter(sFieldName, "EQ", sDeliveryNum);
                var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", Plant);
                var oFilter2 = new sap.ui.model.Filter("Delievery", "EQ", sDeliveryNum);
                var oModel = this.getOwnerComponent().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read(sPath, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oBusyDialog.close();
                            MessageBox.error("Data not available.")
                        } else {
                            // if (oresponse.results.length > 0) {

                            var gateItemNum = "";
                            var oNewResponseArr = [];
                            var aNewArr = [];
                            var isDataAlreadyExist = false;
                            var isPOadded = false;
                            var gateEntryCreated = false;
                            if (oTableModel.getProperty("/aTableItem").length > 0) {
                                oresponse.results.map(function (items) {
                                    var isMatched = false;
                                    var oData = items;
                                    oTableModel.getProperty("/aTableItem").map(function (item) {
                                        if (gateType === '1' || gateType === '2') {
                                            if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                                isMatched = true;
                                            }
                                        } else if (gateType === '3') {
                                            if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                                isMatched = true;
                                            }

                                        } else if (gateType === '5') {
                                            if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                                isMatched = true;
                                            }

                                        } else if (gateType === '6') {
                                            if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                                isMatched = true;
                                            }

                                        }
                                        if (item.Ebeln === oData.PurchaseOrder) {
                                            isPOadded = true;
                                        }


                                    });

                                    if (isMatched === false) {
                                        oNewResponseArr.push(oData);
                                    }


                                }.bind(this));
                                isDataAlreadyExist = true;
                                var igateNum = Math.max.apply(null, oTableModel.getProperty("/aTableItem").map(function (item) {
                                    return Number(item.GateItem)
                                }));
                                gateItemNum = igateNum + 10;
                                aNewArr = oTableModel.getProperty("/aTableItem");

                            } else {
                                oNewResponseArr = oresponse.results;
                                if (oresponse.results[0].OrderQuantity === oresponse.results[0].totalgatequantity) {
                                    gateEntryCreated = true;
                                } else {
                                    gateEntryCreated = false;
                                }
                            }

                            var arr = [];

                            if (gateType === '1' || gateType === '2') {
                                lineItemModel.map(function (items) {
                                    if (items.Delievery === sDeliveryNum) {
                                        arr.push(items.Delievery)
                                    }
                                })

                                if (sDeliveryNum != arr[0]) {
                                    oNewResponseArr.map(function (item) {

                                        if (item.delievered_quantity === "0.000") {
                                            var num = item.ActualDeliveryQuantity
                                        } else {
                                            num = item.delievered_quantity;
                                        }

                                        var oValue = num.indexOf(".");
                                        if (oValue != -1) {
                                            var num1 = num.slice(0, oValue);
                                            var qty = num.slice(oValue, oValue + 3);
                                            var num2 = num1 + qty;
                                        } else if (item.delievered_quantity === "0.000") {
                                            num2 = item.ActualDeliveryQuantity;
                                        } else {
                                            num2 = item.deliver;
                                        }

                                        var obj = {
                                            Sono: item.ReferenceSDDocument,
                                            Zinvoice: item.invoice,
                                            Delievery: item.DeliveryDocument,
                                            GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.DeliveryDocumentItem,
                                            Lifnr: item.SoldToParty,
                                            Name1: item.CustomerName,
                                            Matnr: item.Material,
                                            OrderQty: num2,
                                            Maktx: item.material_description,
                                            Uom: item.ItemWeightUnit,
                                            Remark: '',
                                            ZbagQty: item.zpackage.toString()
                                        };
                                        aNewArr.push(obj);
                                        gateItemNum = gateItemNum + 10;
                                    }.bind(this));
                                } else {
                                    MessageBox.error("Delivery number already used.")
                                }

                            } else if (gateType === '3') {

                                oNewResponseArr.map(function (item) {
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        Lpnum: item.ConsumptionTaxCtrlCode,
                                        OrderQty: item.OrderQuantity,
                                        OpenQty: null,
                                        GateQty: null,
                                        // Department: '',
                                        Remark: '',
                                        Uom: item.PurchaseOrderQuantityUnit === "TO" ? "MT" : item.PurchaseOrderQuantityUnit,
                                        Zinvoice: '',
                                        OutQty: item.totalqty1,
                                        Bnfpo: '',
                                        OutQty: null,
                                        InQty: null,
                                        OutValue: null
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));

                            } else if (gateType === '4') {

                                oNewResponseArr.map(function (item) {
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        Lpnum: item.ConsumptionTaxCtrlCode,
                                        OrderQty: item.OrderQuantity,
                                        OpenQty: null,
                                        GateQty: null,
                                        // Department: '',
                                        Remark: '',
                                        Uom: item.PurchaseOrderQuantityUnit,
                                        Zinvoice: '',
                                        OutQty: item.totalqty1,
                                        Bnfpo: '',
                                        OutQty: null,
                                        InQty: null,
                                        OutValue: null
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));

                            }
                            else if (gateType === '5') {
                                var correctPlant = []
                                for (var i = 0; i < oNewResponseArr.length; i++) {
                                    if (oNewResponseArr[0].Plant === Plant) {
                                        correctPlant.push("plant present")
                                    }
                                }
                                if (correctPlant.length > 0) {
                                    oNewResponseArr.map(function (item) {
                                        var value = item.PurchasingGroup;
                                        this.getView().byId("idPurchG").setValue(value);
                                        var num = item.OrderQuantity;
                                        var oValue = num.indexOf(".");
                                        if (oValue != -1) {
                                            var num1 = num.slice(0, oValue);
                                            var qty = num.slice(oValue, oValue + 3);
                                            var num2 = num1 + qty;
                                            console.log(qty);
                                        } else {
                                            num2 = item.OrderQuantity;
                                        }

                                        var outqty = item.totalqty1;
                                        var value = outqty.indexOf(".");
                                        if (value != -1) {
                                            var quantity = outqty.slice(0, value);
                                            var quantity1 = outqty.slice(value, value + 3);
                                            var quantity2 = quantity + quantity1;

                                        } else {
                                            quantity2 = item.totalqty1;
                                        }


                                        var obj = {
                                            Ebeln: item.PurchaseOrder,
                                            GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                            Ebelp: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                            Lifnr: item.suppliernumber,
                                            Name1: item.SupplierName,
                                            Matnr: item.Material,
                                            Maktx: item.ProductName,
                                            RsplName: item.tolerancequantity,
                                            OrderQty: num2,
                                            GateQty: null,
                                            OpenQty: item.totalgatequantity,
                                            Remark: '',
                                            Uom: item.PurchaseOrderQuantityUnit === "TO" ? "MT" : item.PurchaseOrderQuantityUnit,
                                            OutQty: quantity2,
                                            NetPriceAmount: item.NetPriceAmount
                                        };
                                        aNewArr.push(obj);
                                        gateItemNum = gateItemNum + 10;
                                    }.bind(this));
                                } else {
                                    MessageBox.error("Wrong plant selected")
                                }
                            } else if (gateType === '6') {

                                oNewResponseArr.map(function (item) {
                                    var value = item.PurchaseOrderType;
                                    // var idPurchG = this.getView().getid();
                                    // this.getView().byId("idPurchG").setValue(value);
                                    if (value == "ZRTN" || value == "ZRAR" || value == "ZPRR") {
                                        var obj = {
                                            Ebeln: item.PurchaseOrder,
                                            GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                            Lifnr: item.suppliernumber,
                                            Name1: item.suppliername,
                                            Maktx: item.Material,
                                            Matnr: item.ProductName,
                                            OrderQty: item.OrderQuantity,
                                            GateQty: null,
                                            Remark: '',
                                            Uom: item.PurchaseOrderQuantityUnit === "TO" ? "MT" : item.PurchaseOrderQuantityUnit
                                        };
                                        aNewArr.push(obj);
                                        gateItemNum = gateItemNum + 10;
                                    }
                                }.bind(this));

                            } else if (gateType === '7') {
                                oNewResponseArr.map(function (item) {
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        OrderQty: item.OrderQuantity,
                                        GateQty: null,
                                        Remark: '',
                                        Uom: ''
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));
                            }

                            oTableModel.setProperty("/aTableItem", aNewArr);
                            oBusyDialog.close();
                            // }
                            // else {
                            //     oBusyDialog.close();
                            //     MessageBox.error("Invalid document for the selected plant.");
                            // }
                        }
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });
            },

            onReadDeliveryData: function () {
                var lineItemModel = this.getView().getModel("itemDataModel").getProperty("/aItemData")
                var sDeliveryNum = this.getView().byId("idDel1").getValue();
                var sPath = "/delieverydata";
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var Plant = oCommonModel.getProperty('/plantObject');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var sFieldName = "";
                if (gateType === '1') {
                    sFieldName = "DeliveryDocument";
                } else if (gateType === '2') {
                    sFieldName = "invoice";
                } else if (gateType === '3') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                } else if (gateType === '4') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }
                else if (gateType === '5') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                } else if (gateType === '6') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }

                var oFilter = new sap.ui.model.Filter(sFieldName, "EQ", sDeliveryNum);
                var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", Plant);
                var oFilter2 = new sap.ui.model.Filter("Delievery", "EQ", sDeliveryNum);
                var oModel = this.getOwnerComponent().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read(sPath, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oBusyDialog.close();
                            MessageBox.error("Data not available.")
                        } else {
                            // if (oresponse.results.length > 0) {

                            var gateItemNum = "";
                            var oNewResponseArr = [];
                            var aNewArr = [];
                            var isDataAlreadyExist = false;
                            var isPOadded = false;
                            var gateEntryCreated = false;
                            if (oTableModel.getProperty("/aTableItem").length > 0) {
                                oresponse.results.map(function (items) {
                                    var isMatched = false;
                                    var oData = items;
                                    oTableModel.getProperty("/aTableItem").map(function (item) {
                                        if (gateType === '1' || gateType === '2') {
                                            if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                                isMatched = true;
                                            }
                                        } else if (gateType === '3') {
                                            if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                                isMatched = true;
                                            }

                                        } else if (gateType === '5') {
                                            if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                                isMatched = true;
                                            }

                                        } else if (gateType === '6') {
                                            if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                                isMatched = true;
                                            }

                                        }
                                        if (item.Ebeln === oData.PurchaseOrder) {
                                            isPOadded = true;
                                        }


                                    });

                                    if (isMatched === false) {
                                        oNewResponseArr.push(oData);
                                    }


                                }.bind(this));
                                isDataAlreadyExist = true;
                                var igateNum = Math.max.apply(null, oTableModel.getProperty("/aTableItem").map(function (item) {
                                    return Number(item.GateItem)
                                }));
                                gateItemNum = igateNum + 10;
                                aNewArr = oTableModel.getProperty("/aTableItem");

                            } else {
                                oNewResponseArr = oresponse.results;
                                if (oresponse.results[0].OrderQuantity === oresponse.results[0].totalgatequantity) {
                                    gateEntryCreated = true;
                                } else {
                                    gateEntryCreated = false;
                                }
                            }

                            var arr = [];

                            if (gateType === '1' || gateType === '2') {
                                lineItemModel.map(function (items) {
                                    if (items.Delievery === sDeliveryNum) {
                                        arr.push(items.Delievery)
                                    }
                                })

                                if (sDeliveryNum != arr[0]) {
                                    oNewResponseArr.map(function (item) {

                                        if (item.delievered_quantity === "0.000") {
                                            var num = item.ActualDeliveryQuantity
                                        } else {
                                            num = item.delievered_quantity;
                                        }

                                        var oValue = num.indexOf(".");
                                        if (oValue != -1) {
                                            var num1 = num.slice(0, oValue);
                                            var qty = num.slice(oValue, oValue + 3);
                                            var num2 = num1 + qty;
                                        } else if (item.delievered_quantity === "0.000") {
                                            num2 = item.ActualDeliveryQuantity;
                                        } else {
                                            num2 = item.deliver;
                                        }

                                        var obj = {
                                            Sono: item.ReferenceSDDocument,
                                            Zinvoice: item.invoice,
                                            Delievery: item.DeliveryDocument,
                                            GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.DeliveryDocumentItem,
                                            Lifnr: item.SoldToParty,
                                            Name1: item.CustomerName,
                                            Matnr: item.Material,
                                            OrderQty: num2,
                                            Maktx: item.material_description,
                                            Uom: item.ItemWeightUnit,
                                            Remark: '',
                                            ZbagQty: item.zpackage.toString()
                                        };
                                        aNewArr.push(obj);
                                        gateItemNum = gateItemNum + 10;
                                    }.bind(this));
                                } else {
                                    MessageBox.error("Delivery number already used.")
                                }

                            } else if (gateType === '3') {

                                oNewResponseArr.map(function (item) {
                                    var value = item.PurchasingGroup;
                                    this.getView().byId("idPurchG").setValue(value);
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.SupplierName,
                                        // Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        Lpnum: item.ConsumptionTaxCtrlCode,
                                        OrderQty: item.OrderQuantity,
                                        OpenQty: null,
                                        GateQty: null,
                                        // Department: '',
                                        Remark: '',
                                        Uom: item.PurchaseOrderQuantityUnit === "TO" ? "MT" : item.PurchaseOrderQuantityUnit,
                                        Zinvoice: '',
                                        // OutQty: item.totalqty1,
                                        OutQty: item.OrderQuantity,
                                        Bnfpo: '',
                                        // OutQty: null,
                                        InQty: null,
                                        OutValue: null
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));

                            } else if (gateType === '4') {

                                oNewResponseArr.map(function (item) {
                                    var value = item.PurchasingGroup;
                                    this.getView().byId("idPurchG").setValue(value);
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        // Name1: item.suppliername,
                                        Name1: item.SupplierName,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        Lpnum: item.ConsumptionTaxCtrlCode,
                                        OrderQty: item.OrderQuantity,
                                        OpenQty: null,
                                        GateQty: null,
                                        // Department: '',
                                        Remark: '',
                                        Uom: item.PurchaseOrderQuantityUnit,
                                        Zinvoice: '',
                                        OutQty: item.totalqty1,
                                        // OutQty: item.OrderQuantity,
                                        Bnfpo: '',
                                        OutQty: null,
                                        InQty: null,
                                        OutValue: null
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));

                            }
                            else if (gateType === '5') {
                                var correctPlant = []
                                // var checkValue = oNewResponseArr[0].IsCompletelyDelivered;

                                var purch_date = oresponse.results[0].PurchaseOrderDate;
                                var reporting_date = this.getView().byId("idEntryDate").getValue();
                                var domainvalue = oresponse.results[0].PurchasingDocumentStatus;

                                var Fromdate = purch_date;
                                var dt1 = Number(Fromdate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(Fromdate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var Fromdate1 = Fromdate.getFullYear() + '-' + MM1 + '-' + DT1;

                                if (domainvalue == "01" || domainvalue == "02" || domainvalue == "38") {
                                    oBusyDialog.close();
                                    return MessageBox.error("Purchase Order In-Approval");

                                }

                                if (Fromdate1 > reporting_date) {
                                    oBusyDialog.close();
                                    return MessageBox.error("Gate Entry Date is earlier than Purchase Order Date");
                                }
                                // else {

                                for (var i = 0; i < oNewResponseArr.length; i++) {
                                    if (oNewResponseArr[0].Plant === Plant) {
                                        correctPlant.push("plant present")
                                    }
                                }
                                if (correctPlant.length > 0) {
                                    oNewResponseArr.map(function (item) {
                                        if (item.IsCompletelyDelivered === false) {
                                            var value = item.PurchasingGroup;
                                            this.getView().byId("idPurchG").setValue(value);
                                            var num = item.OrderQuantity;
                                            var oValue = num.indexOf(".");
                                            if (oValue != -1) {
                                                var num1 = num.slice(0, oValue);
                                                var qty = num.slice(oValue, oValue + 3);
                                                var num2 = num1 + qty;
                                                console.log(qty);
                                            } else {
                                                num2 = item.OrderQuantity;
                                            }

                                            var outqty = item.totalqty1;
                                            var value = outqty.indexOf(".");
                                            if (value != -1) {
                                                var quantity = outqty.slice(0, value);
                                                var quantity1 = outqty.slice(value, value + 3);
                                                var quantity2 = quantity + quantity1;

                                            } else {
                                                quantity2 = item.totalqty1;
                                            }


                                            var obj = {
                                                Ebeln: item.PurchaseOrder,
                                                GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                                // Ebelp: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                                Ebelp: item.PurchaseOrderItem,
                                                // GateItem : item.PurchaseOrderItem,
                                                Lifnr: item.suppliernumber,
                                                Name1: item.SupplierName,
                                                Matnr: item.Material,
                                                Maktx: item.ProductName,
                                                RsplName: item.tolerancequantity,
                                                OrderQty: num2,
                                                GateQty: null,
                                                OpenQty: item.totalgatequantity,
                                                Remark: '',
                                                Uom: item.PurchaseOrderQuantityUnit === "TO" ? "MT" : item.PurchaseOrderQuantityUnit,
                                                OutQty: quantity2,
                                                NetPriceAmount: item.NetPriceAmount,
                                                billQty: null,
                                            };
                                            aNewArr.push(obj);
                                            gateItemNum = gateItemNum + 10;
                                        }
                                    }.bind(this));
                                } else {
                                    MessageBox.error("Wrong plant selected")
                                }


                                // }
                            } else if (gateType === '6') {


                                var domainvalue = oresponse.results[0].PurchasingDocumentStatus;
                                var purch_date = oresponse.results[0].PurchaseOrderDate;
                                var reporting_date = this.getView().byId("idEntryDate").getValue();

                                var Fromdate = purch_date;
                                var dt1 = Number(Fromdate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(Fromdate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var Fromdate1 = Fromdate.getFullYear() + '-' + MM1 + '-' + DT1;

                                if (domainvalue == "01" || domainvalue == "02" || domainvalue == "38") {
                                    oBusyDialog.close();
                                    return MessageBox.error("Purchase Order In-Approval");

                                }

                                if (Fromdate1 > reporting_date) {
                                    oBusyDialog.close();
                                    return MessageBox.error("Gate Entry Date is earlier than Purchase Order Date");
                                }

                                oNewResponseArr.map(function (item) {
                                    var value = item.PurchaseOrderType;
                                    // var idPurchG = this.getView().getid();
                                    // this.getView().byId("idPurchG").setValue(value);
                                    if (value == "ZRTN" || value == "ZRAR" || value == "ZPRR") {
                                        var obj = {
                                            Ebeln: item.PurchaseOrder,
                                            GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                            Lifnr: item.suppliernumber,
                                            Name1: item.suppliername,
                                            Maktx: item.Material,
                                            Matnr: item.ProductName,
                                            OrderQty: item.OrderQuantity,
                                            GateQty: null,
                                            Remark: '',
                                            Uom: item.PurchaseOrderQuantityUnit === "TO" ? "MT" : item.PurchaseOrderQuantityUnit
                                        };
                                        aNewArr.push(obj);
                                        gateItemNum = gateItemNum + 10;
                                    }
                                }.bind(this));

                            } else if (gateType === '7') {
                                oNewResponseArr.map(function (item) {
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        OrderQty: item.OrderQuantity,
                                        GateQty: null,
                                        Remark: '',
                                        Uom: ''
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));
                            }

                            oTableModel.setProperty("/aTableItem", aNewArr);
                            oBusyDialog.close();
                            // }
                            // else {
                            //     oBusyDialog.close();
                            //     MessageBox.error("Invalid document for the selected plant.");
                            // }
                        }
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });
            },

            onReadDeliveryData43: function () {
                var sDeliveryNum = this.getView().byId("idDel1").getValue();
                var sPath = "/delieverydata";
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var sFieldName = "";
                if (gateType === '1') {
                    sFieldName = "DeliveryDocument";
                } else if (gateType === '2') {
                    sFieldName = "invoice";
                } else if (gateType === '3') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                } else if (gateType === '4') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }
                else if (gateType === '5') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                } else if (gateType === '6') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }
                var oFilter = new sap.ui.model.Filter(sFieldName, "EQ", sDeliveryNum);
                var oModel = this.getOwnerComponent().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read(sPath, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        var gateItemNum = "";
                        var oNewResponseArr = [];
                        var aNewArr = [];
                        var isDataAlreadyExist = false;
                        var isPOadded = false;
                        var gateEntryCreated = false;
                        if (oTableModel.getProperty("/aTableItem").length > 0) {
                            oresponse.results.map(function (items) {
                                var isMatched = false;
                                var oData = items;
                                oTableModel.getProperty("/aTableItem").map(function (item) {
                                    if (gateType === '1' || gateType === '2') {
                                        if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                            isMatched = true;
                                        }
                                    } else if (gateType === '3') {
                                        if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                            isMatched = true;
                                        }

                                    } else if (gateType === '5') {
                                        if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                            isMatched = true;
                                        }

                                    } else if (gateType === '6') {
                                        if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                            isMatched = true;
                                        }

                                    }
                                    if (item.Ebeln === oData.PurchaseOrder) {
                                        isPOadded = true;
                                    }


                                });

                                if (isMatched === false) {
                                    oNewResponseArr.push(oData);
                                }


                            }.bind(this));
                            isDataAlreadyExist = true;
                            var igateNum = Math.max.apply(null, oTableModel.getProperty("/aTableItem").map(function (item) {
                                return Number(item.GateItem)
                            }));
                            gateItemNum = igateNum + 10;
                            aNewArr = oTableModel.getProperty("/aTableItem");

                        } else {
                            oNewResponseArr = oresponse.results;
                            if (oresponse.results[0].OrderQuantity === oresponse.results[0].totalgatequantity) {
                                gateEntryCreated = true;
                            } else {
                                gateEntryCreated = false;
                            }
                        }


                        if (gateType === '1' || gateType === '2') {
                            oNewResponseArr.map(function (item) {

                                var num = item.delievered_quantity;
                                var oValue = num.indexOf(".");
                                if (oValue != -1) {
                                    var num1 = num.slice(0, oValue);
                                    var qty = num.slice(oValue, oValue + 3);
                                    var num2 = num1 + qty;
                                } else {
                                    num2 = item.delievered_quantity;
                                }

                                var obj = {
                                    Sono: item.ReferenceSDDocument,
                                    Zinvoice: item.invoice,
                                    Delievery: item.DeliveryDocument,
                                    GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.DeliveryDocumentItem,
                                    Lifnr: item.SoldToParty,
                                    Name1: item.CustomerName,
                                    Matnr: item.Material,
                                    OrderQty: num2,
                                    Maktx: item.material_description,
                                    Uom: item.ItemWeightUnit,
                                    Remark: '',
                                    ZbagQty: item.zpackage.toString()
                                };
                                aNewArr.push(obj);
                                gateItemNum = gateItemNum + 10;
                            }.bind(this));
                        } else if (gateType === '3') {

                            oNewResponseArr.map(function (item) {
                                var obj = {
                                    Ebeln: item.PurchaseOrder,
                                    GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                    Lifnr: item.suppliernumber,
                                    Name1: item.suppliername,
                                    Maktx: item.Material,
                                    Matnr: item.ProductName,
                                    Lpnum: item.ConsumptionTaxCtrlCode,
                                    OrderQty: item.OrderQuantity,
                                    OpenQty: null,
                                    GateQty: null,
                                    // Department: '',
                                    Remark: '',
                                    Uom: item.PurchaseOrderQuantityUnit,
                                    Zinvoice: '',
                                    OutQty: item.totalqty1,
                                    Bnfpo: '',
                                    OutQty: null,
                                    InQty: null,
                                    OutValue: null
                                };
                                aNewArr.push(obj);
                                gateItemNum = gateItemNum + 10;
                            }.bind(this));

                        } else if (gateType === '4') {

                            oNewResponseArr.map(function (item) {
                                var obj = {
                                    Ebeln: item.PurchaseOrder,
                                    GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                    Lifnr: item.suppliernumber,
                                    Name1: item.suppliername,
                                    Maktx: item.Material,
                                    Matnr: item.ProductName,
                                    Lpnum: item.ConsumptionTaxCtrlCode,
                                    OrderQty: item.OrderQuantity,
                                    OpenQty: null,
                                    GateQty: null,
                                    // Department: '',
                                    Remark: '',
                                    Uom: item.PurchaseOrderQuantityUnit,
                                    Zinvoice: '',
                                    OutQty: item.totalqty1,
                                    Bnfpo: '',
                                    OutQty: null,
                                    InQty: null,
                                    OutValue: null
                                };
                                aNewArr.push(obj);
                                gateItemNum = gateItemNum + 10;
                            }.bind(this));

                        }
                        else if (gateType === '5') {
                            oNewResponseArr.map(function (item) {
                                var num = item.OrderQuantity;
                                var oValue = num.indexOf(".");
                                if (oValue != -1) {
                                    var num1 = num.slice(0, oValue);
                                    var qty = num.slice(oValue, oValue + 3);
                                    var num2 = num1 + qty;
                                    console.log(qty);
                                } else {
                                    num2 = item.OrderQuantity;
                                }

                                var outqty = item.totalqty1;
                                var value = outqty.indexOf(".");
                                if (value != -1) {
                                    var quantity = outqty.slice(0, value);
                                    var quantity1 = outqty.slice(value, value + 3);
                                    var quantity2 = quantity + quantity1;

                                } else {
                                    quantity2 = item.totalqty1;
                                }


                                var obj = {
                                    Ebeln: item.PurchaseOrder,
                                    GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                    Ebelp: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                    Lifnr: item.suppliernumber,
                                    Name1: item.suppliername,
                                    Matnr: item.Material,
                                    Maktx: item.ProductName,
                                    RsplName: item.tolerancequantity,
                                    OrderQty: num2,
                                    GateQty: null,
                                    OpenQty: item.totalgatequantity,
                                    Remark: '',
                                    Uom: item.PurchaseOrderQuantityUnit,
                                    OutQty: quantity2,
                                };
                                aNewArr.push(obj);
                                gateItemNum = gateItemNum + 10;
                            }.bind(this));


                        } else if (gateType === '6') {

                            oNewResponseArr.map(function (item) {
                                var obj = {
                                    Ebeln: item.PurchaseOrder,
                                    GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                    Lifnr: item.suppliernumber,
                                    Name1: item.suppliername,
                                    Maktx: item.Material,
                                    Matnr: item.ProductName,
                                    OrderQty: item.OrderQuantity,
                                    GateQty: null,
                                    Remark: '',
                                    Uom: ''
                                };
                                aNewArr.push(obj);
                                gateItemNum = gateItemNum + 10;
                            }.bind(this));

                        } else if (gateType === '7') {
                            oNewResponseArr.map(function (item) {
                                var obj = {
                                    Ebeln: item.PurchaseOrder,
                                    GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                    Lifnr: item.suppliernumber,
                                    Name1: item.suppliername,
                                    Maktx: item.Material,
                                    Matnr: item.ProductName,
                                    OrderQty: item.OrderQuantity,
                                    GateQty: null,
                                    Remark: '',
                                    Uom: ''
                                };
                                aNewArr.push(obj);
                                gateItemNum = gateItemNum + 10;
                            }.bind(this));
                        }

                        oTableModel.setProperty("/aTableItem", aNewArr);
                        oBusyDialog.close();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });
            },

            onAddNewRows: function () {
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var aTableArr = oTableModel.getProperty("/aTableItem");
                if (!oTableModel.getProperty("/aTableItem").length === 0) {
                    MessageBox.warning("Please fetch table data first!");
                } else {
                    var igateNum = Math.max.apply(null, aTableArr.map(function (item) {
                        return Number(item.GateItem)
                    }));
                    if (igateNum === -Infinity) {
                        igateNum = 0;
                    }
                    if (gateType === '1' || gateType === '2') {
                        //oTableModel.getProperty("/aTableItem").map(function (item) {

                        var obj = {
                            Sono: '',
                            Zinvoice: '',
                            Delievery: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Matnr: '',
                            OrderQty: null,
                            OpenQty: null,
                            Maktx: '',
                            Uom: '',
                            Remark: ''
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '3') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            Lpnum: '',
                            OrderQty: null,
                            OpenQty: null,
                            GateQty: null,
                            // Department: '',
                            Remark: '',
                            Uom: '',
                            Zinvoice: '',
                            OutQty: null,
                            InQty: null,
                            Address1: null
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '4') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            Lpnum: '',
                            OrderQty: null,
                            OpenQty: null,
                            GateQty: null,
                            // Department: '',
                            Remark: '',
                            Uom: '',
                            Zinvoice: '',
                            OutQty: null,
                            Address1: null
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '5') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            OrderQty: null,
                            GateQty: null,
                            Remark: '',
                            Uom: ''
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '6') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            OrderQty: null,
                            GateQty: null,
                            Remark: '',
                            Uom: ''
                        };
                        aTableArr.push(obj);
                        //});
                    }

                    oTableModel.setProperty("/aTableItem", aTableArr);
                }
            },
            onDeleteSelectedData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait ..."
                });
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableId;
                if (gateType === '5') {
                    oTableId = "table2";
                } else if (gateType === '1' || gateType === '2') {
                    oTableId = "table1"
                } else if (gateType === '6') {
                    oTableId = "table3"
                } else if (gateType === '3' || gateType === '4') {
                    oTableId = "table4"
                }
                var aNewArray = [];

                var tb = this.getView().byId(oTableId);

                var rowid = tb.getSelectedIndices();
                var data = aTableArr[rowid];

                if (rowid.length === 1) {
                    MessageBox.alert("Are you sure you want to delete?", {
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.OK) {
                                oBusyDialog.open();
                                oModel.remove("/gate_item(Gateno='" + data.Gateno + "',GateItem='" + data.GateItem + "')", {
                                    method: "DELETE",
                                    success: function (data) {
                                        oBusyDialog.close();


                                        for (var i = 0; i < aSelectedIndex.length; i++) {
                                            aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                            // aTableArr.splice(aSelectedIndex[i],1);
                                        }

                                        aNewArray.map(function (item) {
                                            var gateItem = item;
                                            var iIndex = "";
                                            aTableArr.map(function (item, index) {
                                                if (gateItem === item.GateItem) {
                                                    iIndex = index;
                                                }
                                            });
                                            aTableArr.splice(iIndex, 1);
                                        }.bind(this));

                                        var iGateItem = 10;
                                        aTableArr.map(function (item) {
                                            if (iGateItem === 10) {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            } else {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            }
                                        }.bind(this));

                                        oTableModel.setProperty("/aTableItem", aTableArr);
                                    },
                                    error: function (e) {
                                        oBusyDialog.close();
                                        for (var i = 0; i < aSelectedIndex.length; i++) {
                                            aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                            // aTableArr.splice(aSelectedIndex[i],1);
                                        }

                                        aNewArray.map(function (item) {
                                            var gateItem = item;
                                            var iIndex = "";
                                            aTableArr.map(function (item, index) {
                                                if (gateItem === item.GateItem) {
                                                    iIndex = index;
                                                }
                                            });
                                            aTableArr.splice(iIndex, 1);
                                        }.bind(this));

                                        var iGateItem = 10;
                                        aTableArr.map(function (item) {
                                            if (iGateItem === 10) {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            } else {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            }
                                        }.bind(this));

                                        oTableModel.setProperty("/aTableItem", aTableArr);
                                    }
                                });
                            }
                        }
                    })
                }

                if (rowid.length > 1) {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Deleting Records",
                        text: "Please wait ..."
                    });
                    MessageBox.alert("Are you sure you want to delete?", {
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.OK) {
                                for (var i = 0; i <= rowid.length; i++) {
                                    oBusyDialog.open();
                                    data = aTableArr[i];
                                    oModel.remove("/gate_item(Gateno='" + data.Gateno + "',GateItem='" + data.GateItem + "')", {
                                        method: "DELETE",
                                        success: function (data) {
                                            oBusyDialog.close();

                                            for (var i = 0; i < aSelectedIndex.length; i++) {
                                                aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                                // aTableArr.splice(aSelectedIndex[i],1);
                                            }

                                            aNewArray.map(function (item) {
                                                var gateItem = item;
                                                var iIndex = "";
                                                aTableArr.map(function (item, index) {
                                                    if (gateItem === item.GateItem) {
                                                        iIndex = index;
                                                    }
                                                });
                                                aTableArr.splice(iIndex, 1);
                                            }.bind(this));

                                            var iGateItem = 10;
                                            aTableArr.map(function (item) {
                                                if (iGateItem === 10) {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                } else {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                }
                                            }.bind(this));

                                            oTableModel.setProperty("/aTableItem", aTableArr);

                                        },
                                        error: function (e) {
                                            oBusyDialog.close();
                                            for (var i = 0; i < aSelectedIndex.length; i++) {
                                                aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                                // aTableArr.splice(aSelectedIndex[i],1);
                                            }

                                            aNewArray.map(function (item) {
                                                var gateItem = item;
                                                var iIndex = "";
                                                aTableArr.map(function (item, index) {
                                                    if (gateItem === item.GateItem) {
                                                        iIndex = index;
                                                    }
                                                });
                                                aTableArr.splice(iIndex, 1);
                                            }.bind(this));

                                            var iGateItem = 10;
                                            aTableArr.map(function (item) {
                                                if (iGateItem === 10) {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                } else {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                }
                                            }.bind(this));

                                            oTableModel.setProperty("/aTableItem", aTableArr);
                                        }
                                    });
                                }
                            }
                        }
                    });

                }

            },

            deleteSelectedRow: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var aSelectedIndex = oTable.getSelectedIndices();

                var aNewArr = []
                for (var i = 0; i < aSelectedIndex.length; i++) {
                    aNewArr.push(aTableArr[aSelectedIndex[i]])
                }

                // if (gateType === "5") {
                aNewArr.map(function (items) {
                    var oFilter = new sap.ui.model.Filter("Gateno", "EQ", items.Gateno)
                    var oFilter1 = new sap.ui.model.Filter("GateItem", "EQ", items.GateItem)
                    oModel.read("/gate_item", {
                        filters: [oFilter, oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oModel.remove("/gate_item(Gateno='" + items.Gateno + "',GateItem='" + items.GateItem + "')", {
                                    success: function () {

                                    }
                                })
                                var id = "";
                                var path = ""
                                var idx = ""

                                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                                    id = aSelectedIndex[i]
                                    path = oTable.getContextByIndex(id).sPath;
                                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                                    aTableArr.splice(idx, 1)
                                }
                                oTableModel.setProperty("/aTableItem", aTableArr)
                            } else {
                                var id = "";
                                var path = ""
                                var idx = ""

                                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                                    id = aSelectedIndex[i]
                                    path = oTable.getContextByIndex(id).sPath;
                                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                                    aTableArr.splice(idx, 1)
                                }
                                oTableModel.setProperty("/aTableItem", aTableArr)
                            }
                        }
                    })

                })
                // }
            },

            getWeight: function () {
                var radioButtonValue = this.getView().byId("idRadioWeight").getSelectedButton().getText();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var url = "https://smplweighingscale.in:8081/weightscale/registorWeightScaleData";
                var url1 = "https://smplweighingscale.in:8081/weightscale/getWeightScaleData";
                $.ajax({
                    url: url,
                    beforeSend: function (xhr) {
                        // xhr.withCredentials = true
                        // xhr.username = username;
                        // xhr.password = password;
                    },
                    // headers: {
                    //     "Access-Control-Allow-Headers" : "*"
                    // },
                    type: "GET",
                    success: function (oresponse) {
                        //alert("1st API respone"+oresponse);
                        setTimeout(function () {
                            $.ajax({
                                url: url1,
                                beforeSend: function (xhr) {
                                    // xhr.withCredentials = true;
                                    // xhr.username = username;
                                    // xhr.password = password;
                                },
                                type: "GET",
                                success: function (oresponse1) {
                                    console.log("GET api:=" + oresponse1);
                                    //alert("2st API respone"+oresponse);
                                    var data = oresponse1.slice(-14, -6)
                                    var data1 = data.replace(/^\s+|\s+$/gm, '')
                                    if (radioButtonValue === "Gross") {
                                        this.getView().setModel(new JSONModel(), "oWeightModel")
                                        this.getView().getModel("oWeightModel").setProperty("/GrossWt", data1)
                                    } else if (radioButtonValue === "Tare") {
                                        this.getView().setModel(new JSONModel(), "oTareWeightModel")
                                        this.getView().getModel("oTareWeightModel").setProperty("/TareWt", data1)
                                    }
                                }.bind(this)

                            })
                        }.bind(this), 5000);

                    }.bind(this)
                })
            },
            onReadNumberRange: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oEntryType = oCommonModel.getProperty('/typeobject').Domain;
                var companycode = oCommonModel.getProperty('/displayObject').companyCode;
                var num = "";
                if (companycode === "1000") {
                    num = "01"
                } else if (companycode === "2000") {
                    num = "02"
                } else if (companycode === "3000") {
                    num = "03"
                } else if (companycode === "4000") {
                    num = "04"
                }

                // if (oEntryType === 'DEL') {
                //     var num = "05"
                // } else if (oEntryType === 'RDEL') {
                //     var num = "06"
                // } else if (oEntryType === 'WPO') {
                //     var num = "01"
                // } else if (oEntryType === 'RGP') {
                //     var num = "03"
                // } else if (oEntryType === 'NRGP') {
                //     var num = "04"
                // } else if (oEntryType === 'WPOR') {
                //     var num = "02"
                // }
                // var url = "/numberrange/?&nrrangenr=01";
                var url1 = "/sap/bc/http/sap/zgatehttp_2022?sap-client=080&numc=";
                var url = url1 + num;
                // var url = "/numberrange";
                var username = "ZSAP_4MUSER";
                var password = "LECapyZCfBppljSuk}TVWLSAUpS7RgmNLLaoFrAS";

                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        oCommonModel.setProperty("/GateEntryGeneratedNum", result);
                    }.bind(this)
                });

            },
            onValueHelpWithSuggestionsRequested: function () {
                this._oBasicSearchFieldWithSuggestions = new sap.m.SearchField();
                if (!this.pDialogWithSuggestions) {
                    this.pDialogWithSuggestions = this.loadFragment({
                        name: "zgateentry.fragments.ValueHelpDialog"
                    });
                }
                this.pDialogWithSuggestions.then(function (oDialogSuggestions) {
                    var oFilterBar = oDialogSuggestions.getFilterBar();
                    this._oVHDWithSuggestions = oDialogSuggestions;

                    // Initialise the dialog with model only the first time. Then only open it
                    if (this._bDialogWithSuggestionsInitialized) {
                        // Re-set the tokens from the input and update the table
                        oDialogSuggestions.setTokens([]);
                        oDialogSuggestions.setTokens(this._oMultiInputWithSuggestions.getTokens());
                        oDialogSuggestions.update();

                        oDialogSuggestions.open();
                        return;
                    }
                    this.getView().addDependent(oDialogSuggestions);

                    // Set key fields for filtering in the Define Conditions Tab
                    oDialogSuggestions.setRangeKeyFields([{
                        label: "Product Code",
                        key: "Product",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);

                    // Set Basic Search for FilterBar
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldWithSuggestions);

                    // Trigger filter bar search when the basic search is fired
                    this._oBasicSearchFieldWithSuggestions.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialogSuggestions.getTableAsync().then(function (oTable) {

                        oTable.setModel(this.oProductsModel);

                        // For Desktop and tabled the default table is sap.ui.table.Table
                        if (oTable.bindRows) {
                            // Bind rows to the ODataModel and add columns
                            oTable.bindAggregation("rows", {
                                path: "/MATERIAL",
                                events: {
                                    dataReceived: function () {
                                        oDialogSuggestions.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label: "Product Code", template: "Product" }));
                            oTable.addColumn(new UIColumn({ label: "Product Name", template: "DESCRIPTION" }));
                        }

                        // For Mobile the default table is sap.m.Table
                        if (oTable.bindItems) {
                            // Bind items to the ODataModel and add columns
                            oTable.bindAggregation("items", {
                                path: "/MATERIAL",
                                template: new ColumnListItem({
                                    cells: [new Label({ text: "{Product}" }), new Label({ text: "{DESCRIPTION}" })]
                                }),
                                events: {
                                    dataReceived: function () {
                                        oDialogSuggestions.update();
                                    }
                                }
                            });
                            oTable.addColumn(new MColumn({ header: new Label({ text: "Product Code" }) }));
                            oTable.addColumn(new MColumn({ header: new Label({ text: "Product Name" }) }));
                        }
                        oDialogSuggestions.update();
                    }.bind(this));

                    oDialogSuggestions.setTokens(this._oMultiInputWithSuggestions.getTokens());
                    this._bDialogWithSuggestionsInitialized = true;
                    oDialogSuggestions.open();
                }.bind(this));
            },
            onOpenDialog: function () {

                // create dialog lazily
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "sap.ui.demo.walkthrough.view.HelloDialog"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            handlef4: function () {
                var that = this;
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                // var dataModel = this.getOwnerComponent().getModel('dataModel');
                var oInput = sap.ui.getCore().byId("material");
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("material", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "Orderid",
                        descriptionKey: "Orderid",
                        filtermode: "true",
                        ok: function (oEvent) {
                            //  var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.Material;
                            // dataModel.setProperty("/value", valueset);
                            //   var ansh = that.byId("material").setValue(valueset);
                            // that.getView().byId("packingtype").setText(valueset);
                            //  this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }


                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    // filterBarExpanded: false,
                    filterBarExpanded: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Material", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "ProductName", control: new sap.m.Input() })],

                    search: function (oEvt) {
                        // var oParams = oEvt.getParameter("purchase_ordentity");
                        // var mater = oEvt.mParameters.selectionSet[0].mProperties.value;
                        // var mDESC = oEvt.mParameters.selectionSet[1].mProperties.value;
                        oTable.bindRows({
                            path: "/purchase_ordentity"
                        });
                    }
                });

                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Material", template: "Material" },
                        { label: "ProductName", template: "ProductName" }
                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/Y1416_GATE/");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
            },
            //its Already working
            onValueHelpRequest1: function (oEvent) {
                var oView = this.getView();
                this.oSource = oEvent.getSource();
                this.sPath = oEvent.getSource().getBindingContext('oTableItemModel').getPath();
                var sKey = this.oSource.getCustomData()[0].getKey();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zgateentry.fragments.VendorValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    this._configValueHelpDialog(this.oSource);
                    if (sKey === 'VC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>SupplierName}",
                            description: "{oGenericModel>Supplier}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/VendorValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Vendor");
                    } else if (sKey === 'MC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>DESCRIPTION}",
                            description: "{oGenericModel>Product}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/MaterialValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Material");
                    }

                    oValueHelpDialog.open();
                }.bind(this));
            },
            //Its New Fun
            onValueHelpRequest: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;

                var oView = this.getView();
                this.oSource = oEvent.getSource();
                this.sPath = oEvent.getSource().getBindingContext('oTableItemModel').getPath();
                var sKey = this.oSource.getCustomData()[0].getKey();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zgateentry.fragments.VendorValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    this._configValueHelpDialog(this.oSource);
                    if (sKey === 'VC' && gateType != 4) {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>SupplierName}",
                            description: "{oGenericModel>Supplier}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/VendorValueHelp',
                            template: oTemplate
                        });
                    } else if (sKey === 'VC' && gateType == 4) {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>SupplierName}",
                            description: "{oGenericModel>Supplier}",
                            info: "{oGenericModel>Type}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/Vendor_CustomerValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Vendor");
                    } else if (sKey === 'MC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>DESCRIPTION}",
                            description: "{oGenericModel>Product}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/MaterialValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Material");
                    }

                    oValueHelpDialog.open();
                }.bind(this));
            },

            _configValueHelpDialog: function (oSource) {

                var sInputValue = oSource.getValue(),
                    oModel = this.getView().getModel('oGenericModel'),
                    sKey = oSource.getCustomData()[0].getKey();
                if (sKey === 'VC') {
                    var aData = oModel.getProperty("/VendorValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.SupplierName === sInputValue);
                    });
                    oModel.setProperty("/VendorValueHelp", aData);
                } else if (sKey === 'MC') {
                    var aData = oModel.getProperty("/MaterialValueHelp");
                    var aData = oModel.getProperty("/VendorValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.Product === sInputValue);
                    });
                    oModel.setProperty("/VendorValueHelp", aData);
                }



            },

            onValueHelpDialogClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                //this.oSource = this.byId("productInput");
                if (!oSelectedItem) {
                    this.oSource.resetProperty("value");
                    return;
                }
                if (sPath.search('/MaterialValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Matnr = oObject.DESCRIPTION;
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Lpnum = oObject.HSN;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                } else if (sPath.search('/VendorValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Name1 = oObject.SupplierName;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                } else if (sPath.search('/Vendor_CustomerValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Name1 = oObject.SupplierName;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                }


                this.oSource.setValue(oSelectedItem.getDescription());
            },
            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                if (oEvent.getParameter('itemsBinding').getPath() === '/VendorValueHelp') {
                    var oFilter = new Filter([
                        new Filter("Supplier", FilterOperator.Contains, sValue),
                        new Filter("SupplierName", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Supplier", FilterOperator.Contains, sValue);
                    // var oFilter = new Filter("SupplierName", FilterOperator.Contains, sValue);
                } else if (oEvent.getParameter('itemsBinding').getPath() === '/Vendor_CustomerValueHelp') {
                    var oFilter = new Filter([
                        new Filter("Supplier", FilterOperator.Contains, sValue),
                        new Filter("SupplierName", FilterOperator.Contains, sValue),
                        new Filter("Type", FilterOperator.Contains, sValue)
                    ])
                } else if (oEvent.getParameter('itemsBinding').getPath() === '/MaterialValueHelp') {
                    var oFilter = new Filter([
                        new Filter("Product", FilterOperator.Contains, sValue),
                        new Filter("DESCRIPTION", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Product", FilterOperator.Contains, sValue);
                }
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            handleSuggest: function (oEvent) {
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(100000);
                var sTerm = oEvent.getParameter("value");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("Supplier", sap.ui.model.FilterOperator.StartsWith, sTerm));
                }
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },

            handleSuggest1: function (oEvent) {
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(100000);
                var sTerm = oEvent.getParameter("value");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("Product", sap.ui.model.FilterOperator.StartsWith, sTerm));
                }
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },

            handleSuggest2: function (oEvent) {
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(100000);
                var sTerm = oEvent.getParameter("value");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("DESCRIPTION", sap.ui.model.FilterOperator.StartsWith, sTerm));
                }
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },

            searchSupplier: function (oEvent) {
                var oModel = this.getView().getModel();
                var oValue = oEvent.getSource().getValue();
                var oFilter = new sap.ui.model.Filter("Supplier", "EQ", oValue);
                var oTableModel = this.getView().getModel('oTableItemModel').getProperty('/aTableItem');
                var sPath = "/aTableItem/";
                oModel.read('/SUPPLIER', {
                    filters: [oFilter],
                    success: function (oresponse) {
                        for (var i = 0; i < oTableModel.length; i++) {
                            this.getView().getModel('oTableItemModel').getProperty(sPath + i).Name1 = oresponse.results[0].SupplierName;
                            this.getView().getModel('oTableItemModel').setProperty(sPath + i, this.getView().getModel('oTableItemModel').getProperty(sPath + i));
                        }
                    }.bind(this)
                })
            },

            searchMaterial: function (oEvent) {
                var oModel = this.getView().getModel();
                var oValue = oEvent.getSource().getValue();
                var oFilter = new sap.ui.model.Filter("Product", "EQ", oValue);
                var oTableModel = this.getView().getModel('oTableItemModel').getProperty('/aTableItem');
                var sPath = "/aTableItem/";
                oModel.read('/MATERIAL', {
                    filters: [oFilter],
                    success: function (oresponse) {
                        for (var i = 0; i < oTableModel.length; i++) {

                            this.getView().getModel('oTableItemModel').getProperty(sPath + i).Maktx = oresponse.results[0].DESCRIPTION;
                            this.getView().getModel('oTableItemModel').getProperty(sPath + i).Lpnum = oresponse.results[0].HSN;
                            this.getView().getModel('oTableItemModel').setProperty(sPath + i, this.getView().getModel('oTableItemModel').getProperty(sPath + i));

                        }
                    }.bind(this)
                })
            },






            // handleSaveGateEntryData: function () {
            //     var gateEntrytype = this.getOwnerComponent().getModel('oCommonModel').getProperty('/displayObject').GateType;
            //     var oBusyDialog = new sap.m.BusyDialog({
            //         title: "Saving data",
            //         text: "Please wait ..."
            //     });
            //     oBusyDialog.open();
            //     var VehicleNumber = this.getView().byId("vehno").getValue();
            //     var OperatorName = this.getView().byId("idOpr").getValue();

            //     if (VehicleNumber == "") {
            //         oBusyDialog.close();
            //         MessageBox.error("Please Enter Vehicle Number")
            //     } else if (OperatorName == "" && (gateEntrytype == 3 || gateEntrytype == 4)) {
            //         oBusyDialog.close();
            //         MessageBox.error("Please Enter Operator Name")
            //     }
            //     else {

            //         // var Lrdate = this.getView().byId("idLrDate").getValue();
            //         // var Lrdate1 = Lrdate.split("-");
            //         // if (Lrdate1[1].length != 2) {
            //         //     var Lrdate2 = Lrdate1[0] + "-" + 0 + Lrdate1[1] + "-" + Lrdate1[2]
            //         // } else {
            //         //     Lrdate2 = Lrdate
            //         // }
            //         // oGateEntryHeadModel.getData().LrDate = Lrdate2

            //         // var InvoiceDate = this.getView().byId("idInvoiceDate").getValue();
            //         // var InvoiceDate1 = InvoiceDate.split("-");
            //         // if (InvoiceDate1[1].length != 2) {
            //         //     var InvoiceDate2 = InvoiceDate1[0] + "-" + 0 + InvoiceDate1[1] + "-" + InvoiceDate1[2]
            //         // } else {
            //         //     InvoiceDate2 = InvoiceDate
            //         // }
            //         // oGateEntryHeadModel.getData().Invdt = InvoiceDate2

            //         // var EntryDate = this.getView().byId("idEntryDate").getValue();
            //         // var EntryDate1 = EntryDate.split("-")
            //         // if (EntryDate1[1].length != 2) {
            //         //     var EntryDate2 = EntryDate1[0] + "-" + 0 + EntryDate1[1] + "-" + EntryDate1[2]
            //         // } else {
            //         //     EntryDate2 = EntryDate
            //         // }
            //         // oGateEntryHeadModel.getData().Entrydate = EntryDate2;

            //         // if (gatetype === 1 || gatetype === 2 || (gatetype === 3 && oCommonModel.getProperty('/displayObject').gatInOutKey === 'In') || gatetype === 5 || gatetype === 6) {
            //         //     var GateInDate = this.getView().byId("picker0").getValue();
            //         //     var GateInDate1 = GateInDate.split("-")
            //         //     if (GateInDate1[1].length != 2) {
            //         //         var GateInDate2 = GateInDate1[0] + "-" + 0 + GateInDate1[1] + "-" + GateInDate1[2]
            //         //     } else {
            //         //         GateInDate2 = GateInDate
            //         //     }
            //         //     oGateEntryHeadModel.getData().GateInDate = GateInDate2;
            //         // }

            //         // if (gatetype === 2 || (gatetype === 3 && oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out') || gatetype === 4) {
            //         //     var GateOutDate = this.getView().byId("idOut").getValue();
            //         //     var GateOutDate1 = GateOutDate.split("-");
            //         //     if (GateOutDate1[1].length != 2) {
            //         //         var GateOutDate2 = GateOutDate1[0] + "-" + 0 + GateOutDate1[1] + "-" + GateOutDate1[2]
            //         //     } else {
            //         //         GateOutDate2 = GateOutDate
            //         //     }
            //         //     oGateEntryHeadModel.getData().GateOutDt = GateOutDate2;
            //         // }

            //         // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();
            //         var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');

            //         if (oCommonModel.getProperty('/displayObject').Action === "Create") {
            //             // this.onReadNumberRange();
            //             // setTimeout(function () {
            //             var cancel = this.getView().byId("idCancel").getSelected().toString();
            //             var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
            //             var gatetype = oCommonModel.getProperty('/displayObject').GateType;
            //             var oModel = this.getView().getModel();
            //             var aheaderObj = [];
            //             var oTableModel = this.getView().getModel('oTableItemModel');
            //             var oTableData = oTableModel.getProperty('/aTableItem');
            //             var oGateEntryHeadModel = this.getView().getModel("oGateEntryHeadModel");
            //             var sGateNum = oCommonModel.getProperty("/displayObject").GateNum;
            //             var oGenericModel = this.getView().getModel("oGenericModel");
            //             var oGrossWt = this.getView().byId("idGross").getValue();
            //             var oTareWt = this.getView().byId("idTare").getValue();
            //             var oNetWt = this.getView().byId("idNet").getValue();
            //             var TypeOfReturn = this.getView().byId("TypeOfReturn").getValue();
            //             var entryTime = this.getView().byId("idEntryTime").getValue();

            //             var gateoutdate = this.getView().byId("idOut").getValue();
            //             var gateouttime = this.getView().byId("idTimeOut").getValue();
            //             var gateindate = this.getView().byId("picker0").getValue();
            //             var gateintime = this.getView().byId("idGateInTime").getValue();


            //             var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
            //             var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;

            //             oGateEntryHeadModel.getData().Gateno = oCommonModel.getProperty("/GateEntryGeneratedNum");
            //             // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();

            //             oTableModel.getProperty("/aTableItem").map(function (items) {
            //                 delete items.NetPriceAmount
            //             })

            //             oGateEntryHeadModel.getData().to_gateitem.results = oTableModel.getProperty("/aTableItem");
            //             oGateEntryHeadModel.getData().NetWt = this.getView().byId("idNet").getValue();
            //             // oGateEntryHeadModel.getData().Driveralcoholic = this.getView().byId("idAlcoholic").getSelectedButton().getText();
            //             aheaderObj.push(oGateEntryHeadModel.getData());

            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && (gatetype === '3' || gatetype === '4' || gatetype === '5' || gatetype === '6')) {
            //                 var str = oGateEntryHeadModel.getData().Invdt
            //                 var ymd = str.split("-")
            //                 var year = ymd[0]
            //                 if (ymd[1].length < 2) {
            //                     var month = "0" + ymd[1]
            //                 } else {
            //                     month = ymd[1]
            //                 }

            //                 if (ymd[2].length < 2) {
            //                     var day = "0" + ymd[2]
            //                 } else {
            //                     day = ymd[2]
            //                 }
            //                 var date = year + "-" + month + "-" + day
            //                 oGateEntryHeadModel.getData().Invdt = date
            //             }

            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '1') {

            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }


            //             }
            //             // if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '3') {
            //             //     if (oGrossWt.length === 0 || oTareWt.length === 0) {
            //             //         oGateEntryHeadModel.getData().GrossWt = "0.00";
            //             //         oGateEntryHeadModel.getData().TareWt = "0.00";
            //             //     }

            //             // }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '2') {

            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }

            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '4') {

            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }

            //             }
            //             if ((oCommonModel.getProperty('/displayObject').Action === "Gate Out" && gatetype === '5') || (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '5')) {
            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = parseFloat(oGrossWt).toFixed(2);
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = parseFloat(oTareWt).toFixed(2);
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }

            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '5') {
            //                 oGateEntryHeadModel.getData().GateOutDt = null;
            //                 oGateEntryHeadModel.getData().GateOutTm = null;
            //                 oGateEntryHeadModel.getData().GateInDate = null;
            //                 oGateEntryHeadModel.getData().GateInTm = null;

            //                 var time = entryTime.split(":")
            //                 if (time[0].length < 2) {
            //                     var time1 = "0" + time[0]
            //                 } else {
            //                     var time1 = time[0]
            //                 }
            //                 if (time[1].length < 2) {
            //                     var time2 = "0" + time[1]
            //                 } else {
            //                     var time2 = time[1]
            //                 }
            //                 if (time[2].length < 2) {
            //                     var time3 = "0" + time[2]
            //                 } else {
            //                     var time3 = time[2]
            //                 }
            //                 var timestring = time1 + time2 + time3
            //                 var timestring1 = timestring.replace(/:/g, '');
            //                 var hours = timestring1.substring(0, 2)
            //                 var minutes = timestring1.substring(2, 4);
            //                 var seconds = timestring1.substring(4);

            //                 var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
            //                 oGateEntryHeadModel.getData().Entrytime = iso8601Duration
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '3' && gateinout === 'Out') {
            //                 oGateEntryHeadModel.getData().Entrytime = null
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '3' && gateinout === 'In') {
            //                 oGateEntryHeadModel.getData().Entrytime = null
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '4') {
            //                 oGateEntryHeadModel.getData().Entrytime = null
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '1') {
            //                 oGateEntryHeadModel.getData().GateOutDt = null;
            //                 oGateEntryHeadModel.getData().GateOutTm = null;
            //                 oGateEntryHeadModel.getData().GateInDate = null;
            //                 oGateEntryHeadModel.getData().GateInTm = null;

            //                 var time = entryTime.split(":")
            //                 if (time[0].length < 2) {
            //                     var time1 = "0" + time[0]
            //                 } else {
            //                     var time1 = time[0]
            //                 }
            //                 if (time[1].length < 2) {
            //                     var time2 = "0" + time[1]
            //                 } else {
            //                     var time2 = time[1]
            //                 }
            //                 if (time[2].length < 2) {
            //                     var time3 = "0" + time[2]
            //                 } else {
            //                     var time3 = time[2]
            //                 }
            //                 var timestring = time1 + time2 + time3
            //                 var timestring1 = timestring.replace(/:/g, '');
            //                 var hours = timestring1.substring(0, 2)
            //                 var minutes = timestring1.substring(2, 4);
            //                 var seconds = timestring1.substring(4);

            //                 var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
            //                 oGateEntryHeadModel.getData().Entrytime = iso8601Duration
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '2') {
            //                 oGateEntryHeadModel.getData().GateOutDt = null;
            //                 oGateEntryHeadModel.getData().GateOutTm = null;
            //                 oGateEntryHeadModel.getData().GateInDate = null;
            //                 oGateEntryHeadModel.getData().GateInTm = null;

            //                 var time = entryTime.split(":")
            //                 if (time[0].length < 2) {
            //                     var time1 = "0" + time[0]
            //                 } else {
            //                     var time1 = time[0]
            //                 }
            //                 if (time[1].length < 2) {
            //                     var time2 = "0" + time[1]
            //                 } else {
            //                     var time2 = time[1]
            //                 }
            //                 if (time[2].length < 2) {
            //                     var time3 = "0" + time[2]
            //                 } else {
            //                     var time3 = time[2]
            //                 }
            //                 var timestring = time1 + time2 + time3
            //                 var timestring1 = timestring.replace(/:/g, '');
            //                 var hours = timestring1.substring(0, 2)
            //                 var minutes = timestring1.substring(2, 4);
            //                 var seconds = timestring1.substring(4);

            //                 var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
            //                 oGateEntryHeadModel.getData().Entrytime = iso8601Duration
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '6') {

            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }
            //                 oGateEntryHeadModel.getData().Entrytime = null

            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '6') {

            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }

            //             }
            //             if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').GateType === '3') {
            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //             }
            //             if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').GateType === '3') {
            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }
            //             }
            //             if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Create") {
            //                 oGateEntryHeadModel.getData().GateOutDt = "0.00";
            //                 oGateEntryHeadModel.getData().GateOutTm = "0.00";
            //             }
            //             if (gatetype === '4' && oCommonModel.getProperty('/displayObject').Action === "Create") {
            //                 oGateEntryHeadModel.getData().GateInDate = "0.00";
            //                 oGateEntryHeadModel.getData().GateInTm = "0.00";
            //             }
            //             if (gatetype === '3' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').Action === "Create") {
            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }
            //             }
            //             if (gatetype === '3' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').Action === "Create") {
            //                 if (oGrossWt.length === 0) {
            //                     oGateEntryHeadModel.getData().GrossWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().GrossWt = oGrossWt;
            //                 }

            //                 if (oTareWt.length === 0) {
            //                     oGateEntryHeadModel.getData().TareWt = "0.00";
            //                 } else {
            //                     oGateEntryHeadModel.getData().TareWt = oTareWt;
            //                 }

            //                 if (oNetWt.length === 0) {
            //                     oGateEntryHeadModel.getData().NetWt = "0.00";
            //                 }
            //             }

            //             oModel.create("/zgat", oGateEntryHeadModel.getData(), {
            //                 method: "POST",
            //                 success: function (data) {
            //                     oBusyDialog.close();
            //                     MessageBox.success("Gate no." + oCommonModel.getProperty("/GateEntryGeneratedNum") + " generated successfully!", {
            //                         onClose: function (oAction) {
            //                             if (oAction === MessageBox.Action.OK) {
            //                                 var oHistory = sap.ui.core.routing.History.getInstance();
            //                                 var sPreviousHash = oHistory.getPreviousHash();

            //                                 if (sPreviousHash !== undefined) {
            //                                     window.history.go(-1);
            //                                 } else {
            //                                     var oRouter = this.getOwnerComponent().getRouter();
            //                                     oRouter.navTo("Gate", {}, true);
            //                                 }
            //                             }
            //                         }.bind(this)
            //                     });
            //                 }.bind(this),
            //                 error: function (e) {
            //                     oBusyDialog.close();
            //                     // alert("error");
            //                 }
            //             });
            //             // }.bind(this), 3000);
            //         } else if (oCommonModel.getProperty('/displayObject').Action === "Change" || oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
            //             var cancel = this.getView().byId("idCancel").getSelected().toString();
            //             var gatetype = oCommonModel.getProperty('/displayObject').GateType;
            //             var oModel = this.getView().getModel();
            //             var aheaderObj = [];
            //             var oTableModel = this.getView().getModel('oTableItemModel');
            //             var oTableData = oTableModel.getProperty('/aTableItem');
            //             var oGateEntryHeadModel = this.getView().getModel("oGateEntryHeadModel");
            //             var sGateNum = oCommonModel.getProperty("/displayObject").GateNum;
            //             var oGenericModel = this.getView().getModel("oGenericModel");
            //             var oGrossWt = this.getView().byId("idGross").getValue();
            //             var oTareWt = this.getView().byId("idTare").getValue();
            //             var oNetWt = this.getView().byId("idNet").getValue();
            //             var TypeOfReturn = this.getView().byId("TypeOfReturn").getValue();
            //             var entryTime = this.getView().byId("idEntryTime").getValue();
            //             var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
            //             var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;


            //             var duration = this.getView().byId("idVehicleDuration").getValue();

            //             if (gateoutdate != "") {
            //                 var gateOutDate = gateoutdate
            //                 var gateOutTime = gateouttime
            //                 var gateInDate = gateindate
            //                 var gateInTime = gateintime

            //                 var startdatetime = (gateInDate + " " + gateInTime).replace(/-/g, '/')
            //                 var startdatetime1 = new Date(startdatetime)
            //                 var enddatetime = (gateOutDate + " " + gateOutTime).replace(/-/g, '/')
            //                 var enddatetime1 = new Date(enddatetime)

            //                 var milliseconds = Math.abs(enddatetime1 - startdatetime1)
            //                 var seconds = Math.floor((milliseconds / 1000) % 60);
            //                 var minutes = Math.floor((milliseconds / 1000 / 60) % 60);
            //                 var hours = Math.floor(milliseconds / 3600000);
            //                 var formattedTime = [
            //                     hours.toString().padStart(2, "0"),
            //                     minutes.toString().padStart(2, "0"),
            //                     seconds.toString().padStart(2, "0")
            //                 ].join(":");
            //                 if (formattedTime === "NaN:NaN:NaN") {
            //                     var timeduration = "0.00"
            //                 } else {
            //                     timeduration = formattedTime
            //                     oGateEntryHeadModel.getData().Duration1 = timeduration
            //                     this.getView().byId("idVehicleDuration").setValue(timeduration)
            //                     // this.getView().getModel("VehicleInDuration").setProperty("/duration", timeduration)
            //                 }
            //             }

            //             oGateEntryHeadModel.getData().Duration1 = timeduration

            //             oGateEntryHeadModel.getData().Gateno = oCommonModel.getProperty("/GateEntryGeneratedNum");
            //             // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();
            //             oTableModel.getProperty("/aTableItem").map(function (items) {
            //                 delete items.NetPriceAmount
            //             })
            //             oGateEntryHeadModel.getData().to_gateitem.results = oTableModel.getProperty("/aTableItem");
            //             oGateEntryHeadModel.getData().NetWt = this.getView().byId("idNet").getValue();
            //             // oGateEntryHeadModel.getData().Driveralcoholic = this.getView().byId("idAlcoholic").getSelectedButton().getText();
            //             aheaderObj.push(oGateEntryHeadModel.getData());

            //             oGateEntryHeadModel.getData().GrossWt = this.getView().byId("idGross").getValue();
            //             oGateEntryHeadModel.getData().TareWt = this.getView().byId("idTare").getValue();
            //             oGateEntryHeadModel.getData().NetWt = this.getView().byId("idNet").getValue();

            //             delete oGateEntryHeadModel.getData().ZDAY
            //             delete oGateEntryHeadModel.getData().ZMONTH
            //             delete oGateEntryHeadModel.getData().ZYEAR
            //             delete oGateEntryHeadModel.getData().DAYMONTH

            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && (gatetype === '3' || gatetype === '4' || gatetype === '5' || gatetype === '6')) {
            //                 var str = oGateEntryHeadModel.getData().Invdt
            //                 var ymd = str.split("-")
            //                 var year = ymd[0]
            //                 if (ymd[1].length < 2) {
            //                     var month = "0" + ymd[1]
            //                 } else {
            //                     month = ymd[1]
            //                 }

            //                 if (ymd[2].length < 2) {
            //                     var day = "0" + ymd[2]
            //                 } else {
            //                     day = ymd[2]
            //                 }
            //                 var date = year + "-" + month + "-" + day
            //                 oGateEntryHeadModel.getData().Invdt = date
            //             }

            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
            //                 if (cancel === "false")
            //                     oGateEntryHeadModel.getData().Cancelled = "";

            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
            //                 if (cancel === "true")
            //                     oGateEntryHeadModel.getData().Cancelled = "X";

            //             }

            //             if (gatetype === '5' && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
            //                 oGateEntryHeadModel.getData().GateOutDt = this.getView().byId("idOut1").getValue();
            //                 oGateEntryHeadModel.getData().GateOutTm = this.getView().byId("idTimeOut1").getValue();
            //             }
            //             if ((gatetype === '5' || gatetype === '1') && oCommonModel.getProperty('/displayObject').Action === "Change") {
            //                 var checkbox = this.getView().byId("idCheckBox").getSelected();
            //                 if (checkbox === false) {
            //                     oGateEntryHeadModel.getData().GateInDate = null;
            //                     oGateEntryHeadModel.getData().GateInTm = null;
            //                 } else {
            //                     oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
            //                     oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
            //                 }
            //             }
            //             if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Change") {
            //                 var checkbox = this.getView().byId("idCheckBox").getSelected();
            //                 if (checkbox === false) {
            //                     oGateEntryHeadModel.getData().GateInDate = null;
            //                     oGateEntryHeadModel.getData().GateInTm = null;
            //                 } else {
            //                     oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
            //                     oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
            //                 }
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
            //                 var time = entryTime.split(":")
            //                 if (time[0].length < 2) {
            //                     var time1 = "0" + time[0]
            //                 } else {
            //                     var time1 = time[0]
            //                 }
            //                 if (time[1].length < 2) {
            //                     var time2 = "0" + time[1]
            //                 } else {
            //                     var time2 = time[1]
            //                 }
            //                 if (time[2].length < 2) {
            //                     var time3 = "0" + time[2]
            //                 } else {
            //                     var time3 = time[2]
            //                 }

            //                 var timestring = time1 + time2 + time3

            //                 var timestring1 = entryTime.replace(/:/g, '');
            //                 var hours = timestring.substring(0, 2)
            //                 var minutes = timestring.substring(2, 4);
            //                 var seconds = timestring.substring(4);

            //                 var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
            //                 oGateEntryHeadModel.getData().Entrytime = iso8601Duration
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '3' && gateinout === 'Out') {
            //                 oGateEntryHeadModel.getData().Entrytime = null
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '3' && gateinout === 'In') {
            //                 oGateEntryHeadModel.getData().Entrytime = null
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '4') {
            //                 oGateEntryHeadModel.getData().Entrytime = null
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '6') {
            //                 oGateEntryHeadModel.getData().Entrytime = null
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '1') {
            //                 var time = entryTime.split(":")
            //                 if (time[0].length < 2) {
            //                     var time1 = "0" + time[0]
            //                 } else {
            //                     var time1 = time[0]
            //                 }
            //                 if (time[1].length < 2) {
            //                     var time2 = "0" + time[1]
            //                 } else {
            //                     var time2 = time[1]
            //                 }
            //                 if (time[2].length < 2) {
            //                     var time3 = "0" + time[2]
            //                 } else {
            //                     var time3 = time[2]
            //                 }

            //                 var timestring = time1 + time2 + time3

            //                 var timestring1 = entryTime.replace(/:/g, '');
            //                 var hours = timestring.substring(0, 2)
            //                 var minutes = timestring.substring(2, 4);
            //                 var seconds = timestring.substring(4);

            //                 var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
            //                 oGateEntryHeadModel.getData().Entrytime = iso8601Duration
            //             }
            //             if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '2') {
            //                 oGateEntryHeadModel.getData().GateOutDt = null;
            //                 oGateEntryHeadModel.getData().GateOutTm = null;
            //                 oGateEntryHeadModel.getData().GateInDate = null;
            //                 oGateEntryHeadModel.getData().GateInTm = null;

            //                 var time = entryTime.split(":")
            //                 if (time[0].length < 2) {
            //                     var time1 = "0" + time[0]
            //                 } else {
            //                     var time1 = time[0]
            //                 }
            //                 if (time[1].length < 2) {
            //                     var time2 = "0" + time[1]
            //                 } else {
            //                     var time2 = time[1]
            //                 }
            //                 if (time[2].length < 2) {
            //                     var time3 = "0" + time[2]
            //                 } else {
            //                     var time3 = time[2]
            //                 }
            //                 var timestring = time1 + time2 + time3
            //                 var timestring1 = timestring.replace(/:/g, '');
            //                 var hours = timestring1.substring(0, 2)
            //                 var minutes = timestring1.substring(2, 4);
            //                 var seconds = timestring1.substring(4);

            //                 var iso8601Duration = `PT${hours}H${minutes}M${seconds}S`;
            //                 oGateEntryHeadModel.getData().Entrytime = iso8601Duration
            //             }
            //             if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
            //                 oGateEntryHeadModel.getData().GateOutDt = this.getView().byId("idOut1").getValue();
            //                 oGateEntryHeadModel.getData().GateOutTm = this.getView().byId("idTimeOut1").getValue();
            //             }
            //             if (gatetype === '2' && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
            //                 oGateEntryHeadModel.getData().GateOutDt = this.getView().byId("idOut1").getValue();
            //                 oGateEntryHeadModel.getData().GateOutTm = this.getView().byId("idTimeOut1").getValue();
            //             }
            //             // if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Change") {
            //             //     oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
            //             //     oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
            //             // }
            //             if (gatetype === '2' && oCommonModel.getProperty('/displayObject').Action === "Change") {
            //                 oGateEntryHeadModel.getData().GateInDate = this.getView().byId("picker1").getValue();
            //                 oGateEntryHeadModel.getData().GateInTm = this.getView().byId("idGateInTime1").getValue();
            //             }

            //             if (cancel === "false") {
            //                 oGateEntryHeadModel.getData().Cancelled = "";
            //             } else {
            //                 oGateEntryHeadModel.getData().Cancelled = "X";
            //             }

            //             if (oGenericModel.getProperty("/isRowItemEmpty")) {
            //                 if (oTableData.length === 0) {
            //                     if (oGenericModel.getProperty("/isRowItemEmpty") && oCommonModel.getProperty('/displayObject').Action === "Change") {
            //                         delete oGateEntryHeadModel.getData().__metadata;
            //                         delete oGateEntryHeadModel.getData().to_gateitem;
            //                         oModel.update("/zgat(Gateno='" + sGateNum + "')", oGateEntryHeadModel.getData(), {
            //                             success: function (data) {
            //                                 oBusyDialog.close();
            //                                 MessageBox.success("Gate no. updated successfully!", {
            //                                     onClose: function (oAction) {
            //                                         if (oAction === MessageBox.Action.OK) {
            //                                             var oHistory = sap.ui.core.routing.History.getInstance();
            //                                             var sPreviousHash = oHistory.getPreviousHash();

            //                                             if (sPreviousHash !== undefined) {
            //                                                 window.history.go(-1);
            //                                             } else {
            //                                                 var oRouter = this.getOwnerComponent().getRouter();
            //                                                 oRouter.navTo("Gate", {}, true);
            //                                             }
            //                                         }
            //                                     }.bind(this)
            //                                 });
            //                                 // alert("success");
            //                             }.bind(this),
            //                             error: function (e) {
            //                                 oBusyDialog.close();
            //                                 alert("error");
            //                             }
            //                         });

            //                     } else if (oGenericModel.getProperty("/isRowItemEmpty") && oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
            //                         delete oGateEntryHeadModel.getData().__metadata;
            //                         delete oGateEntryHeadModel.getData().to_gateitem;
            //                         oModel.update("/zgat(Gateno='" + sGateNum + "')", oGateEntryHeadModel.getData(), {
            //                             success: function (data) {
            //                                 oBusyDialog.close();
            //                                 MessageBox.success("Gate no. updated successfully!", {
            //                                     onClose: function (oAction) {
            //                                         if (oAction === MessageBox.Action.OK) {
            //                                             var oHistory = sap.ui.core.routing.History.getInstance();
            //                                             var sPreviousHash = oHistory.getPreviousHash();

            //                                             if (sPreviousHash !== undefined) {
            //                                                 window.history.go(-1);
            //                                             } else {
            //                                                 var oRouter = this.getOwnerComponent().getRouter();
            //                                                 oRouter.navTo("Gate", {}, true);
            //                                             }
            //                                         }
            //                                     }.bind(this)
            //                                 });
            //                                 // alert("success");
            //                             }.bind(this),
            //                             error: function (e) {
            //                                 oBusyDialog.close();
            //                                 alert("error");
            //                             }
            //                         });

            //                     } else {
            //                         delete oGateEntryHeadModel.getData().__metadata;
            //                         delete oGateEntryHeadModel.getData().to_gateitem;
            //                         oModel.update("/zgat(Gateno='" + sGateNum + "')", oGateEntryHeadModel.getData(), {
            //                             success: function (data) {
            //                                 oBusyDialog.close();
            //                                 MessageBox.success("Gate no. updated successfully!", {
            //                                     onClose: function (oAction) {
            //                                         if (oAction === MessageBox.Action.OK) {
            //                                             var oHistory = sap.ui.core.routing.History.getInstance();
            //                                             var sPreviousHash = oHistory.getPreviousHash();

            //                                             if (sPreviousHash !== undefined) {
            //                                                 window.history.go(-1);
            //                                             } else {
            //                                                 var oRouter = this.getOwnerComponent().getRouter();
            //                                                 oRouter.navTo("Gate", {}, true);
            //                                             }
            //                                         }
            //                                     }.bind(this)
            //                                 });
            //                                 // alert("success");
            //                             }.bind(this),
            //                             error: function (e) {
            //                                 oBusyDialog.close();
            //                                 alert("error");
            //                             }
            //                         });
            //                     }
            //                 } else {
            //                     oGateEntryHeadModel.getData().to_gateitem.results.map(function (item, index, arr) {
            //                         delete item.__metadata;
            //                         delete item.to_gatehead;
            //                         // if (index === 0) {
            //                         item.Gateno = sGateNum;
            //                         delete item.NetPriceAmount
            //                         oModel.create("/zgateitem_ent", item, {
            //                             success: function (data) {
            //                                 if (index === arr.length - 1) {
            //                                     delete aheaderObj[0].__metadata;
            //                                     delete aheaderObj[0].to_gateitem;
            //                                     oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
            //                                         success: function (data) {
            //                                             oBusyDialog.close();
            //                                             MessageBox.success("Gate no. updated successfully!", {
            //                                                 onClose: function (oAction) {
            //                                                     if (oAction === MessageBox.Action.OK) {
            //                                                         var oHistory = sap.ui.core.routing.History.getInstance();
            //                                                         var sPreviousHash = oHistory.getPreviousHash();

            //                                                         if (sPreviousHash !== undefined) {
            //                                                             window.history.go(-1);
            //                                                         } else {
            //                                                             var oRouter = this.getOwnerComponent().getRouter();
            //                                                             oRouter.navTo("Gate", {}, true);
            //                                                         }
            //                                                     }
            //                                                 }.bind(this)
            //                                             });
            //                                             // alert("success");
            //                                         }.bind(this),
            //                                         error: function (e) {
            //                                             oBusyDialog.close();
            //                                             alert("error");
            //                                         }
            //                                     });

            //                                 }
            //                             },
            //                             error: function (e) {
            //                                 oBusyDialog.close();
            //                             }
            //                         });
            //                         // }

            //                     }.bind(this));
            //                 }
            //             } else {
            //                 oGateEntryHeadModel.getData().to_gateitem.results.map(function (item, index, arr) {
            //                     if (item.hasOwnProperty("__metadata")) {
            //                         delete item.__metadata;
            //                         delete item.to_gatehead;
            //                         item.Gateno = sGateNum;
            //                         // if (index === 0) {
            //                         oModel.update("/zgateitem_ent(Gateno='" + item.Gateno + "',GateItem='" + item.GateItem + "')", item, {
            //                             success: function (data) {
            //                                 if (index === arr.length - 1) {
            //                                     delete aheaderObj[0].__metadata;
            //                                     delete aheaderObj[0].to_gateitem;
            //                                     oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
            //                                         success: function (data) {
            //                                             oBusyDialog.close();
            //                                             MessageBox.success("Gate no. updated successfully!", {
            //                                                 onClose: function (oAction) {
            //                                                     if (oAction === MessageBox.Action.OK) {
            //                                                         var oHistory = sap.ui.core.routing.History.getInstance();
            //                                                         var sPreviousHash = oHistory.getPreviousHash();

            //                                                         if (sPreviousHash !== undefined) {
            //                                                             window.history.go(-1);
            //                                                         } else {
            //                                                             var oRouter = this.getOwnerComponent().getRouter();
            //                                                             oRouter.navTo("Gate", {}, true);
            //                                                         }
            //                                                     }
            //                                                 }.bind(this)
            //                                             });
            //                                             // alert("success");
            //                                         }.bind(this),
            //                                         error: function (e) {
            //                                             oBusyDialog.close();
            //                                             alert("error");
            //                                         }
            //                                     });

            //                                 }
            //                             },
            //                             error: function (e) {
            //                                 oBusyDialog.close();
            //                             }
            //                         });
            //                         // }
            //                     } else {
            //                         item.Gateno = sGateNum;
            //                         oModel.create("/zgateitem_ent", item, {
            //                             success: function (data) {
            //                                 if (index === arr.length - 1) {
            //                                     delete aheaderObj[0].__metadata;
            //                                     delete aheaderObj[0].to_gateitem;
            //                                     oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
            //                                         success: function (data) {
            //                                             oBusyDialog.close();
            //                                             MessageBox.success("Gate no. updated successfully!", {
            //                                                 onClose: function (oAction) {
            //                                                     if (oAction === MessageBox.Action.OK) {
            //                                                         var oHistory = sap.ui.core.routing.History.getInstance();
            //                                                         var sPreviousHash = oHistory.getPreviousHash();

            //                                                         if (sPreviousHash !== undefined) {
            //                                                             window.history.go(-1);
            //                                                         } else {
            //                                                             var oRouter = this.getOwnerComponent().getRouter();
            //                                                             oRouter.navTo("Gate", {}, true);
            //                                                         }
            //                                                     }
            //                                                 }.bind(this)
            //                                             });
            //                                             // alert("success");
            //                                         }.bind(this),
            //                                         error: function (e) {
            //                                             oBusyDialog.close();
            //                                             alert("error");
            //                                         }
            //                                     });

            //                                 }
            //                             },
            //                             error: function (e) {
            //                                 oBusyDialog.close();
            //                             }
            //                         });
            //                     }


            //                 }.bind(this));
            //             }



            //         }

            //     }
            // },

        });
    });

