sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/BusyDialog",
    "sap/m/Text",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "zsdmodulepooltmg/js/xlsx.full.min",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BusyDialog, Text, UIComponent, MessageBox, MessageToast, Spreadsheet, Export, ExportTypeCSV) {
        "use strict";

        return Controller.extend("zsdmodulepooltmg.controller.Sales_Rebates_Tmg", {
            onInit: function () {
                var oBusy = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusy.open();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oFirstTableDataModel");
                this.getView().getModel('oFirstTableDataModel').setProperty("/aFirstTableItem", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oSecondTableDataModel");
                this.getView().getModel('oSecondTableDataModel').setProperty("/aSecondTableData", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oThirdTableDataModel");
                this.getView().getModel('oThirdTableDataModel').setProperty("/aThirdTableData", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oForthTableDataModel");
                this.getView().getModel('oForthTableDataModel').setProperty("/aForthTable", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oFifthTableDataModel");
                this.getView().getModel('oFifthTableDataModel').setProperty("/aFifthTable", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oSeventhTableDataModel");
                this.getView().getModel('oSeventhTableDataModel').setProperty("/aSeventhTable", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oEighthTableDataModel");
                this.getView().getModel('oEighthTableDataModel').setProperty("/aEighthTable", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oNinthTableDataModel");
                this.getView().getModel('oNinthTableDataModel').setProperty("/aNinthTable", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTenthTableDataModel");
                this.getView().getModel('oTenthTableDataModel').setProperty("/aTenthTable", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oEleventhTableDataModel");
                this.getView().getModel('oEleventhTableDataModel').setProperty("/aEleventhTable", []);

                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.TableChange, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallFirstTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallSecondTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallThirdTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallForthTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallFifthTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallSeventhTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallEighthTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallNinthTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallTenthTableData, this);
                UIComponent.getRouterFor(this).getRoute('Sales_Rebates_Tmg').attachPatternMatched(this.CallEleventhTableData, this);




                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS", "DELEAR_PORTAL", "ZuiehfdzCaFrYTAE6EijwpPFlg]gbZEGnwdNUYHc")
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZDISTRICT_STATE_BINDING")
                var oModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMATERIAL_PRICE_GROUP_BIND")
                var oModel3 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSTATE_CODE_BINDING")
                var oModel4 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSALESGROUP")

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "CircularNumber")
                oModel.read("/YY1_SD_CIRCULARNUMBER", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("CircularNumber").setProperty("/aData", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oDistrictNameModel")
                oModel1.read("/ZDISTRICT_STATE_prj", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (ores) {
                        this.getView().getModel("oDistrictNameModel").setProperty("/aDistrictName", ores.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oMaterialPricingGroupModel")
                oModel2.read("/ZMATERIAL_PRICE_GROUP", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (item) {
                        this.getView().getModel("oMaterialPricingGroupModel").setProperty("/aMaterialPricingGroup", item.results)
                    }.bind(this)
                })


                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oSalesGroupModel")
                oModel4.read("/ZSALESGROUP", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (Callitem) {
                        this.getView().getModel("oSalesGroupModel").setProperty("/aSalesGroupData", Callitem.results)
                    }.bind(this)
                })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oStateCodeModel")
                var StateCodeArr = [];
                oModel3.read("/ZSTATE_CODE", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (ores) {
                        var tabledata = ores.results;
                        tabledata.map(function (items) {
                            var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                            var Region_slice = (items.Region).slice(0, 1);
                            var index = alphabet.indexOf(Region_slice);
                            if (index === -1) {
                                var obj = {
                                    "Region": items.Region,
                                    "Country": items.Country,
                                }
                                StateCodeArr.push(obj)
                            }

                        })
                        oBusy.close();
                        this.getView().getModel("oStateCodeModel").setProperty("/aStateCode", StateCodeArr)
                    }.bind(this)
                })
            },
            TableChange: function () {
                var radioButton = this.getView().byId("radioButton").getSelectedButton().getText();
                // var radioButton = this.getView().byId("radioButton").getSelectedIndex();
                if (radioButton === "General Discount(District Wise)") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "General Discount(State Wise)") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "General Discount(Sales Group Wise)") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "Cash Discount") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "Lifting Discount") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "Price Difference") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "District Name") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "Lifting Discount(Invoice Wise)") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "Price Difference (District Wise)") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(false);
                }
                else if (radioButton === "Credit Note GL") {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel7");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel8");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel9");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel10");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel11");
                    oPanel.setVisible(true);
                }
            },








            //Cash Discount Tmg Data Call
            CallFirstTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")
                var aTableArr = [];
                oModel.read("/Cash_Discount", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                // "SalesGroup": items.SalesGrp,
                                // "CustomerDistrict": items.District,
                                "CircularNumber": items.CircularNo,
                                "PaymentTerms": items.PaymentTerm,
                                "materialpricegroup": items.materialpricegroup,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oFirstTableDataModel').setProperty("/aFirstTableItem", aTableArr)
                        oBusyDialog.close();
                    }.bind(this)
                })

                var obj = {
                    District: [
                        {
                            "Key": "1",
                            "Description": "Dhar"
                        },
                        {
                            "Key": "2",
                            "Description": "Rampur"
                        }
                    ]
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "DistrictObject")
            },

            FirstTableExcelUpload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var k = 0; k < ExcelDataCompare.length; k++) {
                    CircularArr.push(ExcelDataCompare[k].circular_no);
                }

                var ExcelDataCompare1 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var materialpricegroupArr = [];
                for (var k = 0; k < ExcelDataCompare1.length; k++) {
                    materialpricegroupArr.push(ExcelDataCompare1[k].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oFirstTableDataModel")
                var aTableArr = oTableModel.getProperty("/aFirstTableItem")
                var len = aTableArr.length;
                var that = this;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var materialpricegroup_ErrorArr = [];
                                        var PaymentTerms_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            if (CircularArr.includes(jsonData[D].CircularNumber.toString()) == false ||
                                                materialpricegroupArr.includes((jsonData[D].materialpricegroup.toString()).toUpperCase()) == false) {
                                                var obj = {
                                                    "CircularNumber": (jsonData[D].CircularNumber).toString(),
                                                    "PaymentTerms": "ZS01",
                                                    "materialpricegroup": ((jsonData[D].materialpricegroup).toString()).toUpperCase(),
                                                    "Amount": (jsonData[D].Amount).toString(),
                                                }
                                                if (CircularArr.includes(jsonData[D].CircularNumber.toString()) == false) {
                                                    CircularNumber_ErrorArr.push(len + D + 1)
                                                    obj["CircularNumber_valueState"] = "Error";

                                                }
                                                if (materialpricegroupArr.includes(jsonData[D].materialpricegroup.toString()) == false) {
                                                    materialpricegroup_ErrorArr.push(len + D + 1)
                                                    obj["MaterialPricingGroup_valueState"] = "Error";
                                                }

                                                aTableArr.push(obj)
                                            }
                                            else {
                                                var obj = {
                                                    "CircularNumber": (jsonData[D].CircularNumber).toString(),
                                                    "PaymentTerms": "ZS01",
                                                    "materialpricegroup": ((jsonData[D].materialpricegroup).toString()).toUpperCase(),
                                                    "Amount": (jsonData[D].Amount).toString(),
                                                }
                                                aTableArr.push(obj)
                                            }
                                        }
                                        if (materialpricegroup_ErrorArr.length != 0 ||
                                            CircularNumber_ErrorArr.length != 0 ||
                                            PaymentTerms_ErrorArr.length != 0) {

                                            var aError = [];
                                            if (materialpricegroup_ErrorArr.length > 0) {
                                                var string = "The Material Price Group on index " + materialpricegroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (PaymentTerms_ErrorArr.length > 0) {
                                                var string = "The Payment Terms on index " + PaymentTerms_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }

                                            // Create a VBox (Vertical Box) to hold the Text controls
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        console.log(jsonData);
                                        oTableModel.setProperty("/aFirstTableItem", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            FirstTableExcelDownload: function () {
                var rows = [{
                    "CircularNumber": "",
                    "PaymentTerms": "ZS01",
                    "materialpricegroup": "",
                    "Amount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "Cash Discount.xlsx");
            },
            //Cash Discount Tmg Data Save
            FirstTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving data"
                });

                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")
                // var oModel = this.getView().getModel();
                var tabledata = this.getView().getModel("oFirstTableDataModel").getProperty("/aFirstTableItem")
                var oTableModel = this.getView().getModel('oFirstTableDataModel');
                var data = oTableModel.getProperty("/aFirstTableItem")
                var indexvalue = data.length;
                var ErrorArr = [];
                var CircularArr = [];
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                for (var k = 0; k < ExcelDataCompare.length; k++) {
                    CircularArr.push(ExcelDataCompare[k].circular_no);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                for (var j = 0; j < indexvalue; j++) {
                    var CircularNumber = data[j].CircularNumber;
                    var MaterialPricingGroup = data[j].materialpricegroup;
                    var PaymentTerms = data[j].PaymentTerms;
                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);
                    // var circular_noIndex = CircularArr[CircularNumber];
                    if (circular_noIndex === -1 || PaymentTerms != "ZS01" || MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(j + 1);
                    }
                    if (circular_noIndex === -1) {
                        data[j].CircularNumber_valueState = "Error";
                    }
                    if (MaterialPricingGroupIndex === -1) {
                        data[j].MaterialPricingGroup_valueState = "Error";
                    }
                }
                if (ErrorArr.length > 0) {
                    oTableModel.setProperty("/aFirstTableItem", data);
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The Circular Number or Payment Terms is incorrect at row " + ErrorIndex + " of the table")
                }
                else {

                    tabledata.map(function (items) {
                        // var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                        // var oFilter1 = new sap.ui.model.Filter("District", "EQ", items.CustomerDistrict)
                        var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                        var oFilter3 = new sap.ui.model.Filter("PaymentTerm", "EQ", items.PaymentTerms)
                        var oFilter4 = new sap.ui.model.Filter("materialpricegroup", "EQ", items.materialpricegroup)

                        oModel.read("/Cash_Discount", {
                            filters: [oFilter2, oFilter3, oFilter4],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        // "District": items.CustomerDistrict,
                                        "CircularNo": items.CircularNumber,
                                        "PaymentTerm": items.PaymentTerms,
                                        "materialpricegroup": items.materialpricegroup,
                                        "Amount": items.Amount
                                    }

                                    oModel.update("/Cash_Discount(CircularNo='" + encodeURIComponent(items.CircularNumber) + "',PaymentTerm='" + items.PaymentTerms + "',materialpricegroup='" + items.materialpricegroup + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close()
                                        }
                                    })
                                } else {
                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        // "District": items.CustomerDistrict,
                                        "CircularNo": items.CircularNumber,
                                        "PaymentTerm": "ZS01",
                                        "materialpricegroup": items.materialpricegroup,
                                        "Amount": items.Amount
                                    }
                                    oModel.create("/Cash_Discount", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                        }
                                    })
                                }
                            }
                        })

                    })
                }


            },

            //Cash Discount Tmg Data Add
            FirstTableSingleRowAdd: function () {
                var oTableModel = this.getView().getModel("oFirstTableDataModel")
                var aTableArr = oTableModel.getProperty("/aFirstTableItem")

                var obj = {
                    "CircularNumber": "",
                    "PaymentTerms": "ZS01",
                    "materialpricegroup": "",
                    "Amount": "",
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aFirstTableItem", aTableArr)

            },

            //Cash Discount Tmg Data Delete
            FirstTableSingleRowDelete: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oFirstTableDataModel");
                var aTableArr = oTableModel.getProperty("/aFirstTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/Cash_Discount(CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',PaymentTerm='" + aTableArr[aSelectedIndex[i]].PaymentTerms + "',materialpricegroup='" + aTableArr[aSelectedIndex[i]].materialpricegroup + "')", {
                        success: function (oresponse) {

                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aFirstTableItem", aTableArr)
            },
            //Cash Discount Tmg Error Handle Function
            Cash_Discount_CircularNumber_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oFirstTableDataModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                }
                // setTimeout(function () {
                //     oContext.CircularNumber_valueState = "";
                // }, 5000);
            },
            Cash_Discount_MaterialPricingGroup_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oFirstTableDataModel').getObject();
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.MaterialPricingGroup_valueState = "None";
                }
            },










            //General Discount (District Wise) Tmg Data Call
            CallSecondTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
                var aTableArr = [];
                oModel.read("/GENERAL_DISCOUNT", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                // "SalesGroup": items.SalesGrp,
                                "CustomerDistrict": items.District,
                                "CircularNumber": items.CircularNo,
                                "materialpricegroup": items.materialpricegroup,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oSecondTableDataModel').setProperty("/aSecondTableData", aTableArr)
                    }.bind(this)
                })
            },

            //General Discount (District Wise) Tmg Excel Data Upload
            Second_Table_Excel_Upload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var ExcelDataCompare1 = this.getView().getModel("oDistrictNameModel").getProperty("/aDistrictName")
                var DistrictArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    DistrictArr.push((ExcelDataCompare1[S].DistrictName).toUpperCase());
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oSecondTableDataModel")
                var aTableArr = oTableModel.getProperty("/aSecondTableData")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var District_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "CustomerDistrict": (jsonData[D].CustomerDistrict).toString(),
                                                "CircularNumber": (jsonData[D].CircularNumber).toString(),
                                                "materialpricegroup": (jsonData[D].materialpricegroup).toString(),
                                                "Amount": (jsonData[D].Amount).toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (DistrictArr.includes(((jsonData[D].CustomerDistrict).toString()).toUpperCase()) == false) {
                                                obj["CustomerDistrict_valueState"] = "Error";
                                                District_ErrorArr.push(Errorlen + D + 1)
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].materialpricegroup).toString()) == false) {
                                                obj["materialpricegroup_valueState"] = "Error";
                                                MaterialPricingGroup_ErrorArr.push(Errorlen + D + 1)
                                            }

                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0 || District_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (MaterialPricingGroup_ErrorArr.length > 0) {
                                                var string = "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (District_ErrorArr.length > 0) {
                                                var string = "The District on index " + District_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aSecondTableData", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },

            Second_Table_Excel_Download1: sap.m.Table.prototype.exportData || function () {
                // var FileName = prompt("Enter the name under which you want to download excel", "Purchase");
                // if (FileName != "") {
                var oModel = this.getView().getModel("oSecondTableDataModel");
                var oExport = new Export({

                    exportType: new ExportTypeCSV({
                        fileExtension: "csv",
                        separatorChar: ","
                    }),

                    models: oModel,

                    rows: {
                        path: "/aSecondTableData"
                    },
                    columns: [{
                        name: "CustomerDistrict",
                        template: {
                            content: "",
                        }
                    }, {
                        name: "CircularNumber",
                        template: {
                            content: "",
                        }
                    }, {
                        name: "materialpricegroup",
                        template: {
                            content: "",
                        }
                    }, {
                        name: "Amount",
                        template: {
                            content: "",
                        }
                    },]
                });
                console.log(oExport);
                oExport.saveFile().catch(function (oError) {

                }).then(function () {
                    oExport.destroy();
                });
                // }
                // else {
                //     MessageBox.error("Please Enter File Name")
                // }
            },
            Second_Table_Excel_Download: function () {
                var rows = [{
                    "CustomerDistrict": "",
                    "CircularNumber": "",
                    "materialpricegroup": "",
                    "Amount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "General Discount (District Wise).xlsx");
            },
            //General Discount (District Wise) Tmg Data Save
            Second_Table_SaveData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
                var ExcelDataCompare1 = this.getView().getModel("oDistrictNameModel").getProperty("/aDistrictName")
                var DistrictArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    DistrictArr.push((ExcelDataCompare1[S].DistrictName));
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oSecondTableDataModel")
                var aTableArr = oTableModel.getProperty("/aSecondTableData")
                var MaterialPricingGroup_ErrorArr = [];
                var DistrictName_ErrorArr = [];
                var circular_no_ErrorArr = [];
                for (var D = 0; D < aTableArr.length; D++) {
                    if (MaterialPricingGroupArr.includes(aTableArr[D].materialpricegroup.toString()) == false) {
                        MaterialPricingGroup_ErrorArr.push(D + 1)
                        aTableArr[D].materialpricegroup_valueState = "Error";

                    }
                    if (DistrictArr.includes(aTableArr[D].CustomerDistrict.toString()) == false) {
                        DistrictName_ErrorArr.push(D + 1)
                        aTableArr[D].CustomerDistrict_valueState = "Error";
                    }
                    if (CircularArr.includes(aTableArr[D].CircularNumber.toString()) == false) {
                        circular_no_ErrorArr.push(D + 1)
                        aTableArr[D].CircularNumber_valueState = "Error";
                    }

                }
                if (MaterialPricingGroup_ErrorArr.length != 0 || DistrictName_ErrorArr.length != 0 || circular_no_ErrorArr.length != 0) {
                    this.getView().getModel("oSecondTableDataModel").setProperty("/aSecondTableData", aTableArr)
                    oBusyDialog.close();
                    var aError = [];
                    if (MaterialPricingGroup_ErrorArr.length > 0) {
                        aError.push(new Text({ text: "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong" }))
                    }
                    if (DistrictName_ErrorArr.length > 0) {
                        aError.push(new Text({ text: "The District Name on index " + DistrictName_ErrorArr.toString() + " of the table is wrong" }))
                    }
                    if (circular_no_ErrorArr.length > 0) {
                        aError.push(new Text({ text: "The Circular Number on index " + circular_no_ErrorArr.toString() + " of the table is wrong" }))
                    }
                    var vbox = new sap.m.VBox({
                        items: aError
                    });
                    MessageBox.error(vbox, {
                        title: "General Discount (District Wise) Tmg Error",
                    });
                }
                else {
                    aTableArr.map(function (items) {
                        // var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                        var oFilter1 = new sap.ui.model.Filter("District", "EQ", items.CustomerDistrict)
                        var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                        var oFilter3 = new sap.ui.model.Filter("materialpricegroup", "EQ", items.materialpricegroup)

                        oModel.read("/GENERAL_DISCOUNT", {
                            filters: [oFilter1, oFilter2, oFilter3],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        "District": items.CustomerDistrict,
                                        "CircularNo": items.CircularNumber,
                                        "materialpricegroup": items.materialpricegroup,
                                        // "SalesGrp": items.SalesGroup,
                                        "Amount": items.Amount
                                    }

                                    oModel.update("/GENERAL_DISCOUNT(District='" + encodeURIComponent(items.CustomerDistrict) + "',CircularNo='" + encodeURIComponent(items.CircularNumber) + "',materialpricegroup='" + encodeURIComponent(items.materialpricegroup) + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                        }
                                    })
                                } else {
                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        "District": items.CustomerDistrict,
                                        "CircularNo": items.CircularNumber,
                                        "materialpricegroup": items.materialpricegroup,
                                        // "SalesGrp": items.SalesGroup,
                                        "Amount": items.Amount
                                    }

                                    oModel.create("/GENERAL_DISCOUNT", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error(oresponse) {
                                            oBusyDialog.close();
                                        }
                                    })
                                }
                            }
                        })
                    })
                }
            },
            //General Discount (District Wise) Tmg Data Add
            Second_Table_AddData: function () {
                var oTableModel = this.getView().getModel("oSecondTableDataModel")
                var aTableArr = oTableModel.getProperty("/aSecondTableData")

                var obj = {
                    "CustomerDistrict": "",
                    "CircularNumber": "",
                    "materialpricegroup": "",
                    "Amount": "",
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aSecondTableData", aTableArr)

            },

            //General Discount (District Wise) Tmg Data Delete
            Second_Table_DeleteData: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oSecondTableDataModel");
                var aTableArr = oTableModel.getProperty("/aSecondTableData");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/GENERAL_DISCOUNT(District='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CustomerDistrict) + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',materialpricegroup='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].materialpricegroup) + "')", {
                        success: function (oresponse) {

                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aSecondTableData", aTableArr)
            },

            //General Discount (District Wise) Error Handle Function
            General_Discount_District_Wise_CustomerDistrict_Change: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oSecondTableDataModel').getObject();
                var ExcelDataCompare1 = this.getView().getModel("oDistrictNameModel").getProperty("/aDistrictName")
                var District = oEvent.mParameters.value;
                var DistrictArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    DistrictArr.push((ExcelDataCompare1[S].DistrictName));
                }
                if (DistrictArr.includes(District) == true) {
                    oContext.CustomerDistrict_valueState = "None";
                }
            },
            General_Discount_District_Wise_CircularNumber_Change: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oSecondTableDataModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                }
                // setTimeout(function () {
                //     oContext.CircularNumber_valueState = "";
                // }, 5000);
            },
            General_Discount_District_Wise_MaterialPriseGroup_Change: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oSecondTableDataModel').getObject();
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.materialpricegroup_valueState = "None";
                }
            },











            //General Discount (State Wise) Tmg Data Call
            CallThirdTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGDT_STATE_BINDING")
                var aTableArr = [];
                oModel.read("/zgdt_state_prcds", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                // "SalesGroup": items.SalesGrp,
                                "Custstcode": items.Custstcode < 10 ? "0" + items.Custstcode : items.Custstcode,
                                "CircularNo": items.CircularNo,
                                "Materialpricegrp": items.Materialpricegrp,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oThirdTableDataModel').setProperty("/aThirdTableData", aTableArr)
                    }.bind(this)
                })
            },

            //General Discount (State Wise) Tmg Excel Data Upload Csv Function
            ThirdTablecsvJSON: function (csv) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });

                oBusyDialog.open();

                var oTableModel = this.getView().getModel('oThirdTableDataModel');
                // var oContext = csv.getSource().getBindingContext('oFirstTableDataModel').getObject();
                var lines = csv.split('\n');
                var result = [];
                var headers = lines[0].split(',');
                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var currentline = lines[i].split(',');
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }

                var oStringResult = JSON.stringify(result);
                var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ''));
                var len = oFinalResult.length - 1;
                var ErrorArr = [];

                var data = oTableModel.getProperty("/aThirdTableData");
                var data1 = oTableModel.getProperty("/aThirdTableData")
                var indexvalue = data1.length;

                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var ExcelDataCompare2 = this.getView().getModel("oStateCodeModel").getProperty("/aStateCode")
                var CircularArr = [];
                for (var k = 0; k < ExcelDataCompare.length; k++) {
                    CircularArr.push(ExcelDataCompare[k].circular_no);
                }

                var MaterialPricingGroupArr = [];
                for (var k = 0; k < ExcelDataCompare1.length; k++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare1[k].MaterialPricingGroup);
                }

                var RegionArr = [];
                for (var k = 0; k < ExcelDataCompare2.length; k++) {
                    RegionArr.push(ExcelDataCompare2[k].Region);
                }
                for (var j = 0; j < len; j++) {
                    var ata = {};
                    ata = oFinalResult[j];
                    var CircularNumber = oFinalResult[j].CircularNo;
                    var Region = oFinalResult[j].Custstcode < 10 ? "0" + oFinalResult[j].Custstcode : oFinalResult[j].Custstcode;
                    // var Region = oFinalResult[j].Region;
                    var MaterialPricingGroup = oFinalResult[j].Materialpricegrp;

                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var RegionIndex = RegionArr.indexOf(Region);
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);

                    if (circular_noIndex === -1 || RegionIndex === -1 || MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(indexvalue + j + 1);
                    }
                    var obj = {
                        "Custstcode": Region,
                        "CircularNo": oFinalResult[j].CircularNo,
                        "Materialpricegrp": oFinalResult[j].Materialpricegrp,
                        "Amount": oFinalResult[j].Amount,
                    }
                    data.push(obj);

                }
                var ErrorIndex = ErrorArr.toString();
                if (ErrorArr.length > 0) {

                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                }
                oTableModel.setProperty("/aThirdTableData", data);
                this.getView().byId('General_Discount_Tmg_State').setVisibleRowCount(data);
                oBusyDialog.close();

            },
            //General Discount (State Wise) Tmg Excel Data Upload
            Third_Table_Excel_Upload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oStateCodeModel").getProperty("/aStateCode")
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var CircularArr = [];

                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var RegionArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    RegionArr.push((ExcelDataCompare1[S].Region).toUpperCase());
                }

                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oThirdTableDataModel")
                var aTableArr = oTableModel.getProperty("/aThirdTableData")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var Region_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "Custstcode": jsonData[D].Custstcode < 10 ? "0" + jsonData[D].Custstcode : (jsonData[D].Custstcode).toString(),
                                                "CircularNo": (jsonData[D].CircularNo).toString(),
                                                "Materialpricegrp": (jsonData[D].Materialpricegrp).toString(),
                                                "Amount": (jsonData[D].Amount).toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].CircularNo).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNo_ValueState"] = "Error";
                                            }
                                            var region = jsonData[D].Custstcode < 10 ? "0" + jsonData[D].Custstcode : (jsonData[D].Custstcode).toString();
                                            if (RegionArr.includes(region.toString()) == false) {
                                                Region_ErrorArr.push(Errorlen + D + 1)
                                                obj["Custstcode_ValueState"] = "Error";
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].Materialpricegrp).toString()) == false) {
                                                MaterialPricingGroup_ErrorArr.push(Errorlen + D + 1)
                                                obj["Materialpricegrp_ValueState"] = "Error";
                                            }
                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0 || Region_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (MaterialPricingGroup_ErrorArr.length > 0) {
                                                var string = "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (Region_ErrorArr.length > 0) {
                                                var string = "The State Code on index " + Region_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aThirdTableData", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            Third_Table_Excel_Download: function () {
                var rows = [{
                    "Custstcode": "",
                    "CircularNo": "",
                    "Materialpricegrp": "",
                    "Amount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "General Discount (State Wise).xlsx");
            },
            //General Discount (State Wise) Tmg Data Save
            Third_Table_SaveData11: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGDT_STATE_BINDING")
                var tabledata = this.getView().getModel("oThirdTableDataModel").getProperty("/aThirdTableData");
                var oTableModel = this.getView().getModel('oThirdTableDataModel');
                var data = oTableModel.getProperty("/aThirdTableData")
                var indexvalue = data.length;
                var ErrorArr = [];

                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var ExcelDataCompare1 = this.getView().getModel("oStateCodeModel").getProperty("/aStateCode")
                var RegionArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    RegionArr.push(ExcelDataCompare1[S].Region);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }

                for (var j = 0; j < indexvalue; j++) {
                    var CircularNumber = data[j].CircularNo;
                    var Region = data[j].Custstcode;
                    // var Region = oFinalResult[j].Region;
                    // var Region = oFinalResult[j].Custstcode < 10 ? "0" + oFinalResult[j].Custstcode : oFinalResult[j].Custstcode;
                    var MaterialPricingGroup = data[j].Materialpricegrp;

                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var RegionIndex = RegionArr.indexOf(Region);
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);

                    if (circular_noIndex === -1 || RegionIndex === -1 || MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(j + 1);
                        // break;
                    }

                }
                if (ErrorArr.length > 0) {
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                }
                else {

                    tabledata.map(function (items) {
                        // var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                        var oFilter1 = new sap.ui.model.Filter("Custstcode", "EQ", items.Custstcode)
                        var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNo)
                        var oFilter3 = new sap.ui.model.Filter("Materialpricegrp", "EQ", items.Materialpricegrp)

                        oModel.read("/zgdt_state_prcds", {
                            filters: [oFilter1, oFilter2, oFilter3],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        "District": items.CustomerDistrict,
                                        "CircularNo": items.CircularNumber,
                                        "Materialpricegrp": items.Materialpricegrp,
                                        // "SalesGrp": items.SalesGroup,
                                        "Amount": items.Amount
                                    }

                                    oModel.update("/zgdt_state_prcds(Custstcode='" + items.Custstcode + "',CircularNo='" + encodeURIComponent(items.CircularNo) + "',Materialpricegrp='" + items.Materialpricegrp + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                        }
                                    })
                                } else {
                                    var amount = items.Amount;
                                    var Amount = parseFloat(amount).toFixed(2);
                                    var obj = {
                                        "Custstcode": items.Custstcode,
                                        "CircularNo": items.CircularNo,
                                        "Materialpricegrp": items.Materialpricegrp,
                                        "Amount": items.Amount,
                                    }

                                    oModel.create("/zgdt_state_prcds", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error(oresponse) {
                                            MessageToast.show("Data not saved")
                                            oBusyDialog.close();
                                        }
                                    })
                                }
                            }
                        })
                    })
                }



            },
            Third_Table_SaveData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGDT_STATE_BINDING")
                var tabledata = this.getView().getModel("oThirdTableDataModel").getProperty("/aThirdTableData");
                var oTableModel = this.getView().getModel('oThirdTableDataModel');
                var data = oTableModel.getProperty("/aThirdTableData")
                var indexvalue = data.length;
                var ErrorArr = [];

                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                var ExcelDataCompare1 = this.getView().getModel("oStateCodeModel").getProperty("/aStateCode")
                var RegionArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    RegionArr.push(ExcelDataCompare1[S].Region);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                // var CircularArr = [];
                // var MaterialPricingGroupArr = [];
                // var RegionArr = [];
                for (var j = 0; j < indexvalue; j++) {
                    var CircularNumber = data[j].CircularNo;
                    var Region = data[j].Custstcode;
                    var MaterialPricingGroup = data[j].Materialpricegrp;

                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var RegionIndex = RegionArr.indexOf(Region);
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);

                    if (circular_noIndex === -1 || RegionIndex === -1 || MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(j + 1);
                    }
                    if (circular_noIndex === -1) {
                        data[j].CircularNo_ValueState = "Error";
                    }
                    if (RegionIndex === -1) {
                        data[j].Custstcode_ValueState = "Error";
                    }
                    if (MaterialPricingGroupIndex === -1) {
                        data[j].Materialpricegrp_ValueState = "Error";
                    }
                }
                if (ErrorArr.length > 0) {
                    oTableModel.setProperty("/aThirdTableData", data)
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                }
                else {

                    tabledata.map(function (items) {
                        var oFilter1 = new sap.ui.model.Filter("Custstcode", "EQ", items.Custstcode)
                        var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNo)
                        var oFilter3 = new sap.ui.model.Filter("Materialpricegrp", "EQ", items.Materialpricegrp)

                        oModel.read("/zgdt_state_prcds", {
                            filters: [oFilter1, oFilter2, oFilter3],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        "District": items.CustomerDistrict,
                                        "CircularNo": items.CircularNumber,
                                        "Materialpricegrp": items.Materialpricegrp,
                                        // "SalesGrp": items.SalesGroup,
                                        "Amount": items.Amount
                                    }

                                    oModel.update("/zgdt_state_prcds(Custstcode='" + items.Custstcode + "',CircularNo='" + encodeURIComponent(items.CircularNo) + "',Materialpricegrp='" + items.Materialpricegrp + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                        }
                                    })
                                } else {
                                    var amount = items.Amount;
                                    var Amount = parseFloat(amount).toFixed(2);
                                    var obj = {
                                        "Custstcode": items.Custstcode,
                                        "CircularNo": items.CircularNo,
                                        "Materialpricegrp": items.Materialpricegrp,
                                        "Amount": items.Amount,
                                    }

                                    oModel.create("/zgdt_state_prcds", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error(oresponse) {
                                            MessageToast.show("Data not saved")
                                            oBusyDialog.close();
                                        }
                                    })
                                }
                            }
                        })
                    })
                }



            },

            Third_Table_AddData: function () {
                var oTableModel = this.getView().getModel("oThirdTableDataModel")
                var aTableArr = oTableModel.getProperty("/aThirdTableData")

                var obj = {
                    "Custstcode": "",
                    "CircularNo": "",
                    "Materialpricegrp": "",
                    "Amount": "",
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aThirdTableData", aTableArr)

            },

            //General Discount (State Wise) Tmg Data Delete
            Third_Table_DeleteData: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGDT_STATE_BINDING")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oThirdTableDataModel");
                var aTableArr = oTableModel.getProperty("/aThirdTableData");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/zgdt_state_prcds(Custstcode='" + aTableArr[aSelectedIndex[i]].Custstcode + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNo) + "',Materialpricegrp='" + aTableArr[aSelectedIndex[i]].Materialpricegrp + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Deleted")

                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aThirdTableData", aTableArr)
            },

            //Error Handling Function
            General_Discount_State_Wise_Custstcode_ValueState: function (oEvent) {
                var ExcelDataCompare1 = this.getView().getModel("oStateCodeModel").getProperty("/aStateCode")
                var RegionArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    RegionArr.push((ExcelDataCompare1[S].Region).toUpperCase());
                }
                var oContext = oEvent.getSource().getBindingContext('oThirdTableDataModel').getObject();
                if (RegionArr.includes(oEvent.mParameters.value) == true) {
                    oContext.Custstcode_ValueState = "None";
                }

            },
            General_Discount_State_Wise_CircularNo_ValueState: function (oEvent) {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                var oContext = oEvent.getSource().getBindingContext('oThirdTableDataModel').getObject();
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNo_ValueState = "None";
                }
            },
            General_Discount_State_Wise_Materialpricegrp_ValueState: function (oEvent) {
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oContext = oEvent.getSource().getBindingContext('oThirdTableDataModel').getObject();
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.Materialpricegrp_ValueState = "None";
                }
            },















            // Lifting Discount Tmg Data Call
            CallForthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS")
                var aTableArr = [];
                oModel.read("/Lifting_Discount", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var orderDateFrom = items.DeliveryDate
                            var oDate = new Date(orderDateFrom)
                            var orderDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                            var orderDateFrom2 = orderDateFrom1.toISOString().slice(0, 10);

                            var orderDateTo = items.DeliveryNdDate
                            var oDate1 = new Date(orderDateTo)
                            var orderDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                            var orderDateTo2 = orderDateTo1.toISOString().slice(0, 10);

                            var obj = {
                                // "SalesGroup": items.SalesGrp,
                                "Materialprgrp": items.Materialprgrp,
                                "CircularNumber": items.CircularNo,
                                "OrderDateFrom": orderDateFrom2,
                                "OrderDateTo": orderDateTo2,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oForthTableDataModel').setProperty("/aForthTable", aTableArr)
                    }.bind(this)
                })
            },

            // Lifting Discount Tmg Excel Data Upload xlsx Function
            Forth_Table_Excel_Data_Upload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oSalesGroupModel").getProperty("/aSalesGroupData")
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var CircularArr = [];

                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oForthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aForthTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        // var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet, {
                                            raw: false,
                                            // header: 1,
                                            // dateNF: 'dd-mm-yyyy',
                                        });
                                        for (var D = 0; D < jsonData.length; D++) {
                                            const Excel_OrderDateFrom = jsonData[D].OrderDateFrom;
                                            var String_OrderDateFrom = "";
                                            if (Excel_OrderDateFrom.includes('.') == true) {
                                                var [day, month, year] = Excel_OrderDateFrom.split('.');
                                                String_OrderDateFrom = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_OrderDateFrom.includes('-') == true) {
                                                var [day, month, year] = Excel_OrderDateFrom.split('-');
                                                String_OrderDateFrom = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            }
                                            else {
                                                String_OrderDateFrom = Excel_OrderDateFrom;
                                            }
                                            const OrderDateFrom = new Date(String_OrderDateFrom);
                                            const OrderDateFrom1 = `${OrderDateFrom.getFullYear()}-${OrderDateFrom.getMonth() + 1 < 10 ? '0' : ''}${OrderDateFrom.getMonth() + 1}-${OrderDateFrom.getDate() < 10 ? '0' : ''}${OrderDateFrom.getDate()}`;

                                            const Excel_OrderDateTo = jsonData[D].OrderDateTo;
                                            var String_OrderDateTo = "";
                                            if (Excel_OrderDateTo.includes('.') == true) {
                                                var [day, month, year] = Excel_OrderDateTo.split('.');
                                                String_OrderDateTo = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_OrderDateTo.includes('-') == true) {
                                                var [day, month, year] = Excel_OrderDateTo.split('-');
                                                String_OrderDateTo = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else {
                                                String_OrderDateTo = Excel_OrderDateTo;
                                            }
                                            const OrderDateTo = new Date(String_OrderDateTo);
                                            const OrderDateTo1 = `${OrderDateTo.getFullYear()}-${OrderDateTo.getMonth() + 1 < 10 ? '0' : ''}${OrderDateTo.getMonth() + 1}-${OrderDateTo.getDate() < 10 ? '0' : ''}${OrderDateTo.getDate()}`;
                                            var obj = {
                                                "OrderDateFrom": OrderDateFrom1,
                                                "OrderDateTo": OrderDateTo1,
                                                "CircularNumber": jsonData[D].CircularNumber.toString(),
                                                "Materialprgrp": jsonData[D].Materialprgrp.toString(),
                                                "Amount": jsonData[D].Amount.toString(),
                                            }

                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1);
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].Materialprgrp).toString()) == false) {
                                                MaterialPricingGroup_ErrorArr.push(Errorlen + D + 1);
                                                obj["MaterialPricingGroup_valueState"] = "Error";
                                            }

                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (MaterialPricingGroup_ErrorArr.length > 0) {
                                                var string = "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aForthTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            //Date With Single Format
            Forth_Table_Excel_Data_Upload1: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oSalesGroupModel").getProperty("/aSalesGroupData")
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var CircularArr = [];

                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }


                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oForthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aForthTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        // var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet, {
                                            raw: false,
                                            // header: 1,
                                            dateNF: 'dd-mm-yyyy',
                                        });
                                        for (var D = 0; D < jsonData.length; D++) {
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].Materialprgrp).toString()) == false) {
                                                MaterialPricingGroup_ErrorArr.push(Errorlen + D + 1)
                                            }


                                            const Excel_OrderDateFrom1 = new Date(jsonData[D].OrderDateFrom);
                                            const OrderDateFrom2 = `${Excel_OrderDateFrom1.getFullYear()}-${Excel_OrderDateFrom1.getMonth() + 1 < 10 ? '0' : ''}${Excel_OrderDateFrom1.getMonth() + 1}-${Excel_OrderDateFrom1.getDate() < 10 ? '0' : ''}${Excel_OrderDateFrom1.getDate()}`;


                                            const Excel_OrderDateTo1 = new Date(jsonData[D].OrderDateTo);
                                            const OrderDateTo2 = `${Excel_OrderDateTo1.getFullYear()}-${Excel_OrderDateTo1.getMonth() + 1 < 10 ? '0' : ''}${Excel_OrderDateTo1.getMonth() + 1}-${Excel_OrderDateTo1.getDate() < 10 ? '0' : ''}${Excel_OrderDateTo1.getDate()}`;
                                            var obj = {
                                                "OrderDateFrom": OrderDateFrom2,
                                                "OrderDateTo": OrderDateTo2,
                                                "CircularNumber": jsonData[D].CircularNumber.toString(),
                                                "Materialprgrp": jsonData[D].Materialprgrp.toString(),
                                                "Amount": jsonData[D].Amount.toString(),
                                            }
                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0 || District_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (MaterialPricingGroup_ErrorArr.length > 0) {
                                                var string = "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aForthTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            Forth_Table_Excel_Data_Download: function () {
                var rows = [{
                    "Materialprgrp": "",
                    "CircularNumber": "",
                    "OrderDateFrom": "dd-mm-yyyy",
                    "OrderDateTo": "dd-mm-yyyy",
                    "Amount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "Lifting Discount.xlsx");
            },
            // Lifting Discount Tmg Data Save
            Forth_Table_Data_Save: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS")
                var tabledata = this.getView().getModel("oForthTableDataModel").getProperty("/aForthTable");
                var oTableModel = this.getView().getModel('oForthTableDataModel');
                var data = oTableModel.getProperty("/aForthTable")
                var indexvalue = data.length;
                var ErrorArr = [];

                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var k = 0; k < ExcelDataCompare.length; k++) {
                    CircularArr.push(ExcelDataCompare[k].circular_no);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }

                for (var j = 0; j < indexvalue; j++) {
                    var CircularNumber = data[j].CircularNumber;
                    var MaterialPricingGroup = data[j].Materialprgrp;

                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);
                    if (circular_noIndex === -1 || MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(j + 1);
                    }
                    if (circular_noIndex === -1) {
                        data[j].CircularNumber_valueState = "Error"
                    }
                    if (MaterialPricingGroupIndex === -1) {
                        data[j].MaterialPricingGroup_valueState = "Error"
                    }

                }
                if (ErrorArr.length > 0) {
                    oTableModel.setProperty("/aForthTable", data)
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                }
                else {

                    tabledata.map(function (items) {
                        // var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                        var oFilter1 = new sap.ui.model.Filter("Materialprgrp", "EQ", items.Materialprgrp)
                        var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                        var oFilter3 = new sap.ui.model.Filter("DeliveryDate", "EQ", items.OrderDateFrom)
                        var oFilter4 = new sap.ui.model.Filter("DeliveryNdDate", "EQ", items.OrderDateTo)

                        var orderDateFrom = items.OrderDateFrom;
                        var oDate = new Date(orderDateFrom);
                        var orderDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        var orderDateFrom2 = orderDateFrom1.toISOString().slice(0, 16);

                        var orderDateFrom3 = orderDateFrom1.toISOString().slice(0, 10);

                        var orderDateTo = items.OrderDateTo;
                        var oDate1 = new Date(orderDateTo);
                        var orderDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                        var orderDateTo2 = orderDateTo1.toISOString().slice(0, 16);

                        var orderDateTo3 = orderDateTo1.toISOString().slice(0, 10);


                        oModel.read("/Lifting_Discount", {
                            filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var oTableData = {
                                        // "SalesGrp": items.SalesGroup,
                                        "Materialprgrp": items.Materialprgrp,
                                        "CircularNo": items.CircularNumber,
                                        "DeliveryDate": orderDateFrom2,
                                        "DeliveryNdDate": orderDateTo2,
                                        "Amount": items.Amount
                                    }
                                    oModel.update("/Lifting_Discount(Materialprgrp='" + encodeURIComponent(items.Materialprgrp) + "',DeliveryDate=datetime'" + encodeURIComponent((orderDateFrom3 + "T00:00:00")) + "',DeliveryNdDate=datetime'" + encodeURIComponent((orderDateTo3 + "T00:00:00")) + "',CircularNo='" + encodeURIComponent(items.CircularNumber) + "')", oTableData, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                            MessageToast.show("Data not updated")
                                        }
                                    })
                                } else {
                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        "Materialprgrp": items.Materialprgrp,
                                        "CircularNo": items.CircularNumber,
                                        "DeliveryDate": orderDateFrom2,
                                        "DeliveryNdDate": orderDateTo2,
                                        "Amount": items.Amount
                                    }

                                    oModel.create("/Lifting_Discount", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error(oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data not saved")
                                        }
                                    })
                                }
                            }
                        })
                    })
                }



            },

            // Lifting Discount Tmg Data Add
            Forth_Table_Data_Add_SingleRow: function () {
                var oTableModel = this.getView().getModel("oForthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aForthTable")

                var obj = {
                    "Sales Group": "",
                    "OrderDateFrom": "",
                    "OrderDateTo": "",
                    "Circular Number": "",
                    "Material Code": "",
                    "Amount": "",
                    // "Created By": "",
                    // "Created On": "",
                    // "Changed By": "",
                    // "Changed On": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aForthTable", aTableArr)

            },

            // Lifting Discount Tmg Data Delete
            Forth_Table_Data_Delete_SingleRow: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oForthTableDataModel");
                var aTableArr = oTableModel.getProperty("/aForthTable");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/Lifting_Discount(DeliveryDate=datetime'" + encodeURIComponent((aTableArr[aSelectedIndex[i]].OrderDateFrom + "T00:00:00")) + "',DeliveryNdDate=datetime'" + encodeURIComponent((aTableArr[aSelectedIndex[i]].OrderDateTo + "T00:00:00")) + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',Materialprgrp='" + aTableArr[aSelectedIndex[i]].Materialprgrp + "')", {
                        success: function (oresponse) {

                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aForthTable", aTableArr)
            },


            //Lifting Discount Tmg Error Handle Function
            Lifting_Discount_CircularNumber_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oForthTableDataModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                }
                // setTimeout(function () {
                //     oContext.CircularNumber_valueState = "";
                // }, 5000);
            },
            Lifting_Discount_MaterialPricingGroup_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oForthTableDataModel').getObject();
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.MaterialPricingGroup_valueState = "None";
                }
            },












            // District Mantain Tmg Data Call
            CallFifthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZDISTRICT_STATE_BINDING")
                var aTableArr = [];
                oModel.read("/ZDISTRICT_STATE_prj", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var StateCode = Number(items.StateCode);
                            var State_Code = StateCode < 10 ? "0" + StateCode : StateCode;
                            var State_Code1 = State_Code.toString();
                            var obj = {
                                // "SalesGroup": items.SalesGrp,
                                "DistrictName": items.DistrictName,
                                "StateCode": State_Code1,
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oFifthTableDataModel').setProperty("/aFifthTable", aTableArr)
                    }.bind(this)
                })
            },
            FifthTableExcelTemplateDownload: function () {
                var rows = [{
                    "DistrictName": "",
                    "StateCode": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "District Mantain Tmg.xlsx");
            },
            FifthTableExcelDataDownload: function () {
                var rows = this.getView().getModel('oFifthTableDataModel').getProperty("/aFifthTable");
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.writeFile(workbook, "District_Mantain_Data.xlsx");
            },
            // District Mantain Tmg Data Upload
            FifthTableExcelUpload: function () {
                var oTableModel = this.getView().getModel("oFifthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aFifthTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "DistrictName": (jsonData[D].DistrictName).toString(),
                                                "StateCode": (jsonData[D].StateCode).toString(),
                                            }
                                            aTableArr.push(obj);
                                        }
                                        oTableModel.setProperty("/aFifthTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            // District Mantain Tmg Data Upload
            FifthTableExcelUploadcsvJSON: function (csv) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableModel = this.getView().getModel('oFifthTableDataModel');
                // var oContext = csv.getSource().getBindingContext('oTableItemModel').getObject();
                var lines = csv.split('\n');
                var result = [];
                var headers = lines[0].split(',');
                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var currentline = lines[i].split(',');
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }
                var oStringResult = JSON.stringify(result);
                var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ''));
                var len = oFinalResult.length - 1;
                var data = [];
                for (var j = 0; j < len; j++) {
                    var StateCode = oFinalResult[j].StateCode;
                    var excelObj = {
                        "DistrictName": oFinalResult[j].DistrictName,
                        "StateCode": StateCode < 10 ? "0" + StateCode : StateCode,
                    }
                    data.push(excelObj);
                }


                //return result; //JavaScript object
                oTableModel.setProperty("/aFifthTable", data);
                this.getView().byId('District_Name_Maintain_Tmg').setVisibleRowCount(data);
                oBusyDialog.close();

            },

            // District Mantain Tmg Data Add
            FifthTableSingleRowAdd: function () {
                // var oTableModel = this.getView().getModel("oFifthTableDataModel")
                // var aTableArr = oTableModel.getProperty("/aFifthTable")
                var aTableArr = this.getView().getModel("oFifthTableDataModel").getProperty("/aFifthTable")


                var obj = {
                    "DistrictName": "",
                    "StateCode": "",
                }
                aTableArr.push(obj)
                this.getView().getModel("oFifthTableDataModel").setProperty("/aFifthTable", aTableArr)

            },

            // District Mantain Tmg Data Save
            FifthTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();

                // var oModel = this.getView().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZDISTRICT_STATE_BINDING")
                var tabledata = this.getView().getModel("oFifthTableDataModel").getProperty("/aFifthTable");

                tabledata.map(function (items) {
                    // var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                    var oFilter1 = new sap.ui.model.Filter("DistrictName", "EQ", items.DistrictName)
                    var oFilter2 = new sap.ui.model.Filter("StateCode", "EQ", items.StateCode)


                    oModel.read("/ZDISTRICT_STATE_prj", {
                        filters: [oFilter1, oFilter2],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                var obj = {
                                    // "SalesGrp": items.SalesGroup,
                                    "DistrictName": items.DistrictName,
                                    "StateCode": items.StateCode,
                                }

                                oModel.update("/ZDISTRICT_STATE_prj(DistrictName='" + encodeURIComponent(items.DistrictName) + "',StateCode='" + encodeURIComponent(items.StateCode) + "')", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data updated")
                                    },
                                    error: function () {
                                        MessageToast.show("Data not updated")
                                        oBusyDialog.close();
                                    }
                                })
                            } else {
                                var obj = {
                                    "DistrictName": items.DistrictName,
                                    "StateCode": items.StateCode,
                                }

                                oModel.create("/ZDISTRICT_STATE_prj", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data saved")
                                    },
                                    error(oresponse) {
                                        MessageToast.show("Data not saved")
                                        oBusyDialog.close();
                                    }
                                })
                            }
                        }
                    })
                })



            },

            // District Mantain Tmg Data Delete
            FifthTableSingleRowDelete: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZDISTRICT_STATE_BINDING")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oFifthTableDataModel");
                var aTableArr = oTableModel.getProperty("/aFifthTable");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZDISTRICT_STATE_prj(DistrictName='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].DistrictName) + "',StateCode='" + aTableArr[aSelectedIndex[i]].StateCode + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Deleted")
                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aFifthTable", aTableArr)
            },


















            SeventhTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SALES_GROUP")
                var oTableModel = this.getView().getModel("oSeventhTableDataModel")
                var aTableArr = oTableModel.getProperty("/aSeventhTable")
                // var oTableModel = this.getView().getModel('oSecondTableDataModel');
                var data = oTableModel.getProperty("/aSeventhTable")
                var indexvalue = data.length;
                var ErrorArr = [];

                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var k = 0; k < ExcelDataCompare.length; k++) {
                    CircularArr.push(ExcelDataCompare[k].circular_no);
                }

                var ExcelDataCompare1 = this.getView().getModel("oSalesGroupModel").getProperty("/aSalesGroupData")
                var SalesGroupArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    SalesGroupArr.push(ExcelDataCompare1[S].SalesGroup);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }

                for (var j = 0; j < indexvalue; j++) {
                    var CircularNumber = data[j].circular_no;
                    var materialpricegroup = data[j].materialpricegroup;
                    var SalesGroup = data[j].SalesGroup;
                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var materialpricegroupIndex = MaterialPricingGroupArr.indexOf(materialpricegroup);
                    var SalesGroupIndex = SalesGroupArr.indexOf(SalesGroup);
                    // var circular_noIndex = CircularArr[CircularNumber];
                    if (circular_noIndex === -1 || materialpricegroupIndex === -1 || SalesGroupIndex === -1) {
                        ErrorArr.push(j + 1);
                    }
                    if (circular_noIndex === -1) {
                        data[j].CircularNumber_valueState = "Error";
                    }
                    if (materialpricegroupIndex === -1) {
                        data[j].MaterialPricingGroup_valueState = "Error";
                    }
                    if (SalesGroupIndex === -1) {
                        data[j].SalesGroup_valueState = "Error";
                    }

                }
                if (ErrorArr.length > 0) {
                    oTableModel.setProperty("/aSeventhTable", data)
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                }
                else {
                    aTableArr.map(function (items) {
                        var oFilter = new sap.ui.model.Filter("Circularnumber", "EQ", items.circular_no)
                        var oFilter1 = new sap.ui.model.Filter("Salesgroup", "EQ", items.SalesGroup)
                        var oFilter2 = new sap.ui.model.Filter("Materialpricegroup", "EQ", items.materialpricegroup)

                        var obj = {
                            "Circularnumber": items.circular_no,
                            "Salesgroup": items.SalesGroup,
                            "Materialpricegroup": items.materialpricegroup,
                            "Amount": items.Amount
                        }

                        oModel.read("/ZGD_SALES_GROUP_PRJ", {
                            filters: [oFilter, oFilter1, oFilter2],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    oModel.update("/ZGD_SALES_GROUP_PRJ(Circularnumber='" + encodeURIComponent(items.circular_no) + "',Salesgroup='" + items.SalesGroup + "',Materialpricegroup='" + items.materialpricegroup + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close()
                                        }
                                    })
                                } else {
                                    oModel.create("/ZGD_SALES_GROUP_PRJ", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                        }
                                    })
                                }
                            }
                        })
                    })
                }

            },

            SeventhTableSingleRowDelete: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SALES_GROUP")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oSeventhTableDataModel");
                var aTableArr = oTableModel.getProperty("/aSeventhTable");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZGD_SALES_GROUP_PRJ(Circularnumber='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].circular_no) + "',Salesgroup='" + aTableArr[aSelectedIndex[i]].SalesGroup + "',Materialpricegroup='" + aTableArr[aSelectedIndex[i]].materialpricegroup + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Deleted")
                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aSeventhTable", aTableArr)
            },

            SeventhTableSingleRowAdd: function () {
                var oTableModel = this.getView().getModel("oSeventhTableDataModel")
                var aTableArr = oTableModel.getProperty("/aSeventhTable")

                var obj = {
                    "CircularNumber": "",
                    "SalesGroup": "",
                    "materialpricegroup": "",
                    "Amount": "",
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aFirstTableItem", aTableArr)
            },
            SeventhTableExcelUpload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oSalesGroupModel").getProperty("/aSalesGroupData")
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var CircularArr = [];

                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var SalesGroupArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    SalesGroupArr.push((ExcelDataCompare1[S].SalesGroup).toUpperCase());
                }

                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oSeventhTableDataModel")
                var aTableArr = oTableModel.getProperty("/aSeventhTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var SalesGroup_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "circular_no": jsonData[D].circular_no.toString(),
                                                "SalesGroup": jsonData[D].SalesGroup.toString(),
                                                "materialpricegroup": jsonData[D].materialpricegroup.toString(),
                                                "Amount": jsonData[D].Amount.toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].circular_no).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (SalesGroupArr.includes(jsonData[D].SalesGroup.toString()) == false) {
                                                SalesGroup_ErrorArr.push(Errorlen + D + 1)
                                                obj["SalesGroup_valueState"] = "Error";
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].materialpricegroup).toString()) == false) {
                                                MaterialPricingGroup_ErrorArr.push(Errorlen + D + 1)
                                                obj["MaterialPricingGroup_valueState"] = "Error";
                                            }
                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0 || SalesGroup_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (MaterialPricingGroup_ErrorArr.length > 0) {
                                                var string = "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (SalesGroup_ErrorArr.length > 0) {
                                                var string = "The Sales Group on index " + SalesGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aSeventhTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },

            SeventhTableExcelDownload: function () {
                var rows = [{
                    "circular_no": "",
                    "SalesGroup": "",
                    "materialpricegroup": "",
                    "Amount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "General Discount (Sales Wise).xlsx");
            },


            CallSeventhTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SALES_GROUP")
                var aTableArr = [];
                oModel.read("/ZGD_SALES_GROUP_PRJ", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "circular_no": items.Circularnumber,
                                "SalesGroup": items.Salesgroup,
                                "materialpricegroup": items.Materialpricegroup,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oSeventhTableDataModel').setProperty("/aSeventhTable", aTableArr)
                    }.bind(this)
                })
            },


            //Error Handling Function
            General_Discount_SalesGroup_Wise_SalesGroup_ValueState: function (oEvent) {
                var SalesGroupArr = [];
                var ExcelDataCompare1 = this.getView().getModel("oSalesGroupModel").getProperty("/aSalesGroupData")
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    SalesGroupArr.push((ExcelDataCompare1[S].SalesGroup));
                }
                var oContext = oEvent.getSource().getBindingContext('oSeventhTableDataModel').getObject();
                if (SalesGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.SalesGroup_valueState = "None";
                }

            },
            General_Discount_SalesGroup_Wise_CircularNo_ValueState: function (oEvent) {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                var oContext = oEvent.getSource().getBindingContext('oSeventhTableDataModel').getObject();
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                }
            },
            General_Discount_SalesGroup_Wise_Materialpricegrp_ValueState: function (oEvent) {
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oContext = oEvent.getSource().getBindingContext('oSeventhTableDataModel').getObject();
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.MaterialPricingGroup_valueState = "None";
                }
            },















            EighthTableExcelDownload: function () {
                var rows = [{
                    "CircularNumber": "",
                    "MaterialCode": "",
                    "AgreedAmount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "Price Difference.xlsx");
            },

            EighthTableExcelUpload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];

                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var oTableModel = this.getView().getModel("oEighthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aEighthTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "CircularNumber": jsonData[D].CircularNumber.toString(),
                                                "MaterialCode": jsonData[D].MaterialCode.toString(),
                                                "AgreedAmount": jsonData[D].AgreedAmount.toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            aTableArr.push(obj);
                                        }
                                        if (CircularNumber_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aEighthTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            EighthTableJSON: function (csv) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableModel = this.getView().getModel('oEighthTableDataModel');
                // var oContext = csv.getSource().getBindingContext('oTableItemModel').getObject();
                var lines = csv.split('\n');
                var result = [];
                var headers = lines[0].split(',');
                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var currentline = lines[i].split(',');
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }
                var oStringResult = JSON.stringify(result);
                var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ''));
                var len = oFinalResult.length - 1;
                var data = [];
                for (var j = 0; j < len; j++) {
                    var ata = {};
                    ata = oFinalResult[j];
                    data.push(ata);
                }


                //return result; //JavaScript object
                oTableModel.setProperty("/aEighthTable", data);
                this.getView().byId('General_discount_tmg_salesgroup').setVisibleRowCount(data);
                oBusyDialog.close();

            },

            EighthTableSingleRowAdd: function () {
                var oTableModel = this.getView().getModel("oEighthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aEighthTable")

                var obj = {
                    "CircularNumber": "",
                    "MaterialCode": "",
                    "AgreedAmount": "",
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aEighthTable", aTableArr)
            },

            EighthTableSingleRowDelete: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICE_SERVICE_BINDING")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oEighthTableDataModel");
                var aTableArr = oTableModel.getProperty("/aEighthTable");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZPRC_DIFF_CDS(CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',Materialcode='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
                        success: function (oresponse) {

                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aEighthTable", aTableArr)
            },

            EighthTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                var oTableModel = this.getView().getModel("oEighthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aEighthTable")
                var ErrorArr = [];
                for (var D = 0; D < aTableArr.length; D++) {
                    if (CircularArr.includes(aTableArr[D].CircularNumber) == false) {
                        ErrorArr.push(D + 1);
                        aTableArr[D].CircularNumber_valueState = "Error";
                    }
                }
                if (ErrorArr.length != 0) {
                    oTableModel.setProperty("/aEighthTable", aTableArr)
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                } else {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICE_SERVICE_BINDING")
                    aTableArr.map(function (items) {
                        var oFilter = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                        var oFilter1 = new sap.ui.model.Filter("Materialcode", "EQ", items.MaterialCode)
                        var oFilter2 = new sap.ui.model.Filter("Agreedamount", "EQ", items.AgreedAmount)

                        var obj = {
                            "CircularNo": items.CircularNumber,
                            "Materialcode": items.MaterialCode,
                            "Agreedamount": items.AgreedAmount,
                        }

                        oModel.read("/ZPRC_DIFF_CDS", {
                            filters: [oFilter, oFilter1],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    oModel.update("/ZPRC_DIFF_CDS(CircularNo='" + encodeURIComponent(items.CircularNumber) + "',Materialcode='" + items.MaterialCode + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close()
                                        }
                                    })
                                } else {
                                    oModel.create("/ZPRC_DIFF_CDS", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                        }
                                    })
                                }
                            }
                        })
                    })
                }
            },

            CallEighthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICE_SERVICE_BINDING")
                var aTableArr = [];
                oModel.read("/ZPRC_DIFF_CDS", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "CircularNumber": items.CircularNo,
                                "MaterialCode": items.Materialcode,
                                "AgreedAmount": items.Agreedamount,
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oEighthTableDataModel').setProperty("/aEighthTable", aTableArr)
                    }.bind(this)
                })
            },
            //Price Difference Tmg Error Handle Function
            Price_Difference_CircularNumber_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oEighthTableDataModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                }
            },













            // Lifting Discount (Invoiced Wise) Tmg Data Call
            CallNinthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLFD_INV")
                var aTableArr = [];
                oModel.read("/ZLFD_CDS", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var InvoiceDateFrom = items.InvoiceDateFrom
                            var oDate = new Date(InvoiceDateFrom)
                            var InvoiceDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                            var InvoiceDateFrom2 = InvoiceDateFrom1.toISOString().slice(0, 10);

                            var InvoiceDateTo = items.InvoiceDateTo
                            var oDate1 = new Date(InvoiceDateTo)
                            var InvoiceDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                            var InvoiceDateTo2 = InvoiceDateTo1.toISOString().slice(0, 10);
                            var obj = {
                                "Materialprgrp": items.Materialpricegorup,
                                "CircularNumber": items.CircularNo,
                                "InvoiceDateFrom": InvoiceDateFrom2,
                                "InvoiceDateTo": InvoiceDateTo2,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oNinthTableDataModel').setProperty("/aNinthTable", aTableArr)
                    }.bind(this)
                })
            },

            // Lifting Discount (Invoiced Wise) Tmg Single Row Add Function
            Ninth_Table_Data_Add_SingleRow: function () {
                var oTableModel = this.getView().getModel("oNinthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aNinthTable")

                var obj = {
                    "InvoiceDateFrom": "",
                    "InvoiceDateTo": "",
                    "CircularNumber": "",
                    "Materialprgrp": "",
                    "Amount": "",
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aForthTable", aTableArr)

            },

            Ninth_Table_Excel_Data_Download: function () {
                var rows = [{
                    "Materialprgrp": "",
                    "CircularNumber": "",
                    "InvoiceDateFrom": "",
                    "InvoiceDateTo": "",
                    "Amount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "Lifting Discount(Invoiced Wise).xlsx");
            },

            // Lifting Discount (Invoiced Wise) Tmg Data Upload
            Ninth_Table_Excel_Data_Upload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oSalesGroupModel").getProperty("/aSalesGroupData")
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var CircularArr = [];

                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }


                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oNinthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aNinthTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        // var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet, {
                                            raw: false,
                                            // header: 1,
                                            dateNF: 'dd-mm-yyyy',
                                        });
                                        for (var D = 0; D < jsonData.length; D++) {
                                            const Excel_InvoiceDateFrom = jsonData[D].InvoiceDateFrom;
                                            var String_InvoiceDateFrom = "";
                                            if (Excel_InvoiceDateFrom.includes('.') == true) {
                                                var [day, month, year] = Excel_InvoiceDateFrom.split('.');
                                                String_InvoiceDateFrom = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_InvoiceDateFrom.includes('-') == true) {
                                                var [day, month, year] = Excel_InvoiceDateFrom.split('-');
                                                String_InvoiceDateFrom = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else {
                                                String_InvoiceDateFrom = Excel_InvoiceDateFrom;
                                            }
                                            const InvoiceDateFrom = new Date(String_InvoiceDateFrom);
                                            const InvoiceDateFrom1 = `${InvoiceDateFrom.getFullYear()}-${InvoiceDateFrom.getMonth() + 1 < 10 ? '0' : ''}${InvoiceDateFrom.getMonth() + 1}-${InvoiceDateFrom.getDate() < 10 ? '0' : ''}${InvoiceDateFrom.getDate()}`;

                                            const Excel_InvoiceDateTo = jsonData[D].InvoiceDateTo;
                                            var String_InvoiceDateTo = "";
                                            if (Excel_InvoiceDateTo.includes('.') == true) {
                                                var [day, month, year] = Excel_InvoiceDateTo.split('.');
                                                String_InvoiceDateTo = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_InvoiceDateTo.includes('-') == true) {
                                                var [day, month, year] = Excel_InvoiceDateTo.split('-');
                                                String_InvoiceDateTo = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else {
                                                String_InvoiceDateTo = Excel_InvoiceDateTo;
                                            }
                                            const InvoiceDateTo = new Date(String_InvoiceDateTo);
                                            const InvoiceDateTo1 = `${InvoiceDateTo.getFullYear()}-${InvoiceDateTo.getMonth() + 1 < 10 ? '0' : ''}${InvoiceDateTo.getMonth() + 1}-${InvoiceDateTo.getDate() < 10 ? '0' : ''}${InvoiceDateTo.getDate()}`;

                                            var obj = {
                                                "InvoiceDateFrom": InvoiceDateFrom1,
                                                "InvoiceDateTo": InvoiceDateTo1,
                                                "CircularNumber": jsonData[D].CircularNumber.toString(),
                                                "Materialprgrp": jsonData[D].Materialprgrp.toString(),
                                                "Amount": jsonData[D].Amount.toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].Materialprgrp).toString()) == false) {
                                                MaterialPricingGroup_ErrorArr.push(Errorlen + D + 1)
                                                obj["MaterialPricingGroup_valueState"] = "Error";
                                            }
                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (MaterialPricingGroup_ErrorArr.length > 0) {
                                                var string = "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aNinthTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            //Single Date Format
            Ninth_Table_Excel_Data_Upload11: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oSalesGroupModel").getProperty("/aSalesGroupData")
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var CircularArr = [];

                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }


                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oNinthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aNinthTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        // var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet, {
                                            raw: false,
                                            // header: 1,
                                            dateNF: 'dd-mm-yyyy',
                                        });
                                        for (var D = 0; D < jsonData.length; D++) {
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].Materialprgrp).toString()) == false) {
                                                MaterialPricingGroup_ErrorArr.push(Errorlen + D + 1)
                                            }
                                            const Excel_OrderDateFrom1 = new Date(jsonData[D].InvoiceDateFrom);
                                            const InvoiceDateFrom2 = `${Excel_OrderDateFrom1.getFullYear()}-${Excel_OrderDateFrom1.getMonth() + 1 < 10 ? '0' : ''}${Excel_OrderDateFrom1.getMonth() + 1}-${Excel_OrderDateFrom1.getDate() < 10 ? '0' : ''}${Excel_OrderDateFrom1.getDate()}`;


                                            const Excel_OrderDateTo1 = new Date(jsonData[D].InvoiceDateTo);
                                            const InvoiceDateTo2 = `${Excel_OrderDateTo1.getFullYear()}-${Excel_OrderDateTo1.getMonth() + 1 < 10 ? '0' : ''}${Excel_OrderDateTo1.getMonth() + 1}-${Excel_OrderDateTo1.getDate() < 10 ? '0' : ''}${Excel_OrderDateTo1.getDate()}`;


                                            var obj = {
                                                "InvoiceDateFrom": InvoiceDateFrom2,
                                                "InvoiceDateTo": InvoiceDateTo2,
                                                "CircularNumber": jsonData[D].CircularNumber.toString(),
                                                "Materialprgrp": jsonData[D].Materialprgrp.toString(),
                                                "Amount": jsonData[D].Amount.toString(),
                                            }
                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0 || District_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (MaterialPricingGroup_ErrorArr.length > 0) {
                                                var string = "The Material Pricing Group on index " + MaterialPricingGroup_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aNinthTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            // Lifting Discount (Invoiced Wise) Tmg Data Save
            Ninth_Table_Data_Save: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLFD_INV")
                var tabledata = this.getView().getModel("oNinthTableDataModel").getProperty("/aNinthTable");
                var oTableModel = this.getView().getModel('oNinthTableDataModel');
                var data = oTableModel.getProperty("/aNinthTable")
                var indexvalue = data.length;
                var ErrorArr = [];

                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var k = 0; k < ExcelDataCompare.length; k++) {
                    CircularArr.push(ExcelDataCompare[k].circular_no);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }

                for (var j = 0; j < indexvalue; j++) {
                    var CircularNumber = data[j].CircularNumber;
                    var MaterialPricingGroup = data[j].Materialprgrp;

                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);
                    if (circular_noIndex === -1 || MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(j + 1);
                    }
                    if (circular_noIndex === -1) {
                        data[j].CircularNumber_valueState = "Error";
                    }
                    if (MaterialPricingGroupIndex === -1) {
                        data[j].MaterialPricingGroup_valueState = "Error";
                    }
                }
                if (ErrorArr.length > 0) {
                    oTableModel.setProperty("/aNinthTable", data);
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                }
                else {
                    tabledata.map(function (items) {
                        var oFilter1 = new sap.ui.model.Filter("Materialpricegorup", "EQ", items.Materialprgrp)
                        var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                        var oFilter3 = new sap.ui.model.Filter("InvoiceDateFrom", "EQ", items.InvoiceDateFrom)
                        var oFilter4 = new sap.ui.model.Filter("InvoiceDateTo", "EQ", items.InvoiceDateTo)

                        var InvoiceDateFrom = items.InvoiceDateFrom;
                        var oDate = new Date(InvoiceDateFrom);
                        var InvoiceDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        var InvoiceDateFrom2 = InvoiceDateFrom1.toISOString().slice(0, 16);

                        var InvoiceDateFrom3 = InvoiceDateFrom1.toISOString().slice(0, 10);

                        var InvoiceDateTo = items.InvoiceDateTo;
                        var oDate1 = new Date(InvoiceDateTo);
                        var InvoiceDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                        var InvoiceDateTo2 = InvoiceDateTo1.toISOString().slice(0, 16);

                        var InvoiceDateTo3 = InvoiceDateTo1.toISOString().slice(0, 10);


                        oModel.read("/ZLFD_CDS", {
                            filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var oTableData = {
                                        // "SalesGrp": items.SalesGroup,
                                        "Materialpricegorup": items.Materialprgrp,
                                        "CircularNo": items.CircularNumber,
                                        "InvoiceDateFrom": InvoiceDateFrom2,
                                        "InvoiceDateTo": InvoiceDateTo2,
                                        "Amount": items.Amount
                                    }
                                    oModel.update("/ZLFD_CDS(Materialpricegorup='" + encodeURIComponent(items.Materialprgrp) + "',InvoiceDateFrom=datetime'" + encodeURIComponent((InvoiceDateFrom3 + "T00:00:00")) + "',InvoiceDateTo=datetime'" + encodeURIComponent((InvoiceDateTo3 + "T00:00:00")) + "',CircularNo='" + encodeURIComponent(items.CircularNumber) + "')", oTableData, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            oBusyDialog.close();
                                            MessageToast.show("Data not updated")
                                        }
                                    })
                                } else {
                                    var obj = {
                                        // "SalesGrp": items.SalesGroup,
                                        "Materialpricegorup": items.Materialprgrp,
                                        "CircularNo": items.CircularNumber,
                                        "InvoiceDateFrom": InvoiceDateFrom2,
                                        "InvoiceDateTo": InvoiceDateTo2,
                                        "Amount": items.Amount
                                    }

                                    oModel.create("/ZLFD_CDS", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        },
                                        error(oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data not saved")
                                        }
                                    })
                                }
                            }
                        })
                    })
                }



            },
            // Lifting Discount (Invoiced Wise) Tmg Data Delete
            Ninth_Table_Data_Delete_SingleRow: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Delete Data"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLFD_INV")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oNinthTableDataModel");
                var aTableArr = oTableModel.getProperty("/aNinthTable");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZLFD_CDS(InvoiceDateFrom=datetime'" + encodeURIComponent((aTableArr[aSelectedIndex[i]].InvoiceDateFrom + "T00:00:00")) + "',InvoiceDateTo=datetime'" + encodeURIComponent((aTableArr[aSelectedIndex[i]].InvoiceDateTo + "T00:00:00")) + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',Materialpricegorup='" + aTableArr[aSelectedIndex[i]].Materialprgrp + "')", {
                        success: function (oresponse) {
                            oBusyDialog.close();
                            MessageToast.show("Data Deleted")
                        },
                        error(oresponse) {
                            oBusyDialog.close();
                            MessageToast.show("Data not Deleted")
                        }
                    })
                }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aNinthTable", aTableArr)
            },

            //Lifting Discount (Invoiced Wise) Tmg Error Handle Function
            Lifting_Discount_Invoiced_Wise_CircularNumber_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oNinthTableDataModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                }
            },
            Lifting_Discount_Invoiced_Wise_MaterialPricingGroup_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oNinthTableDataModel').getObject();
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.MaterialPricingGroup_valueState = "None";
                }
            },


            TenthTableSingleRowAdd: function () {
                var oTableModel = this.getView().getModel("oTenthTableDataModel");
                var aTableArr = oTableModel.getProperty("/aTenthTable");
                var obj = {
                    "CircularNumber": "",
                    "District": "",
                    "MaterialCode": "",
                    "AgreedAmount": "",
                }
                aTableArr.push(obj);
                oTableModel.setProperty("/aTenthTable", aTableArr)
            },

            TenthTableSingleRowDelete: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Delete data"
                });

                oBusyDialog.open();
                // var oModel = this.getView().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICEDEFF_BINDING")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTenthTableDataModel");
                var aTableArr = oTableModel.getProperty("/aTenthTable");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZPRICEDEFF_CDS(Circularnumber='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',District='" + aTableArr[aSelectedIndex[i]].District + "',Materialcode='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Deleted")
                            oBusyDialog.close();

                        },
                        error(oresponse) {
                            MessageToast.show("Data not Deleted")
                            oBusyDialog.close();
                        }

                    })
                }



                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aTenthTable", aTableArr)
            },

            TenthTableExcelDownload: function () {
                var rows = [{
                    "CircularNumber": "",
                    "District": "",
                    "MaterialCode": "",
                    "AgreedAmount": "",
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "Price Difference(District Wise).xlsx");
            },
            TenthTableExcelUpload1: function () {
                var that = this;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (evn) {
                                        var strCSV = evn.target.result; //string in CSV
                                        that.csvJSON(strCSV);
                                    };
                                    reader.readAsText(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],
                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            TenthTableExcelUpload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var ExcelDataCompare1 = this.getView().getModel("oDistrictNameModel").getProperty("/aDistrictName")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var DistrictArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    DistrictArr.push((ExcelDataCompare1[S].DistrictName).toUpperCase());
                }
                var oTableModel = this.getView().getModel("oTenthTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTenthTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });

                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var District_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "CircularNumber": (jsonData[D].CircularNumber).toString(),
                                                "District": (jsonData[D].District).toString(),
                                                "MaterialCode": (jsonData[D].MaterialCode).toString(),
                                                "AgreedAmount": (jsonData[D].AgreedAmount).toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1);
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (DistrictArr.includes(((jsonData[D].District).toString()).toUpperCase()) == false) {
                                                District_ErrorArr.push(Errorlen + D + 1);
                                                obj["DistrictName_valueState"] = "Error";
                                            }
                                            aTableArr.push(obj);
                                        }
                                        if (MaterialPricingGroup_ErrorArr.length != 0 || CircularNumber_ErrorArr.length != 0 || District_ErrorArr.length != 0) {
                                            var aError = [];
                                            if (CircularNumber_ErrorArr.length > 0) {
                                                var string = "The Circular Number on index " + CircularNumber_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            if (District_ErrorArr.length > 0) {
                                                var string = "The District on index " + District_ErrorArr.toString() + " of the table is wrong";
                                                aError.push(new Text({ text: string }))
                                            }
                                            var vbox = new sap.m.VBox({
                                                items: aError
                                            });
                                            MessageBox.error(vbox, {
                                                title: "Message Box Title",
                                            });
                                        }
                                        oTableModel.setProperty("/aTenthTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },

            // if error 400 bad request ocur then u can check your url
            TenthTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving data"
                });

                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICEDEFF_BINDING")
                var tabledata = this.getView().getModel("oTenthTableDataModel").getProperty("/aTenthTable");

                var oTableModel = this.getView().getModel('oTenthTableDataModel');
                var data = oTableModel.getProperty("/aTenthTable")
                var indexvalue = data.length;
                var ErrorArr = [];

                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var k = 0; k < ExcelDataCompare.length; k++) {
                    CircularArr.push(ExcelDataCompare[k].circular_no);
                }

                var ExcelDataCompare1 = this.getView().getModel("oDistrictNameModel").getProperty("/aDistrictName")
                var DistrictArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    DistrictArr.push(ExcelDataCompare1[S].DistrictName);
                }

                for (var j = 0; j < indexvalue; j++) {
                    var CircularNumber = data[j].CircularNumber;
                    var CustomerDistrict = data[j].District;
                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var CustomerDistrictIndex = DistrictArr.indexOf(CustomerDistrict);
                    if (circular_noIndex == -1 || CustomerDistrictIndex === -1) {
                        ErrorArr.push(j + 1);
                    }
                    if (circular_noIndex == -1) {
                        data[j].CircularNumber_valueState = "Error";
                    }
                    if (CustomerDistrictIndex === -1) {
                        data[j].DistrictName_valueState = "Error";
                    }
                }
                if (ErrorArr.length > 0) {
                    oTableModel.setProperty("/aTenthTable", data);
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The value in row " + ErrorIndex + " of the table is incorrect!!!!!")
                }
                else {
                    tabledata.map(function (items) {
                        var oFilter1 = new sap.ui.model.Filter("Circularnumber", "EQ", items.CircularNumber)
                        var oFilter2 = new sap.ui.model.Filter("District", "EQ", items.District)
                        var oFilter3 = new sap.ui.model.Filter("Materialcode", "EQ", items.MaterialCode)

                        oModel.read("/ZPRICEDEFF_CDS", {
                            filters: [oFilter1, oFilter2, oFilter3],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var obj = {
                                        "Circularnumber": items.CircularNumber,
                                        "District": items.District,
                                        "Materialcode": items.MaterialCode,
                                        "Amount": items.AgreedAmount,

                                    }

                                    oModel.update("/ZPRICEDEFF_CDS(Circularnumber='" + encodeURIComponent(items.CircularNumber) + "',Materialcode='" + encodeURIComponent(items.MaterialCode) + "',District='" + encodeURIComponent(items.District) + "')", obj, {
                                        success: function (oresponse) {
                                            MessageToast.show("Data updated")
                                            oBusyDialog.close()
                                        }.bind(this),
                                        error: function () {
                                            MessageToast.show("Data was not updated")
                                            oBusyDialog.close()
                                        }
                                    })

                                }
                                else {
                                    var obj1 = {
                                        "Circularnumber": items.CircularNumber,
                                        "District": items.District,
                                        "Materialcode": items.MaterialCode,
                                        "Amount": items.AgreedAmount,
                                    }
                                    oModel.create("/ZPRICEDEFF_CDS", obj1, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data saved")
                                        }.bind(this)
                                    })
                                }
                            }
                        })

                    })
                }
            },

            CallTenthTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });

                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICEDEFF_BINDING")
                var aTableArr = [];
                oModel.read("/ZPRICEDEFF_CDS", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "CircularNumber": items.Circularnumber,
                                "District": items.District,
                                "MaterialCode": items.Materialcode,
                                "AgreedAmount": items.Amount,
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oTenthTableDataModel').setProperty("/aTenthTable", aTableArr)
                        oBusyDialog.close();
                    }.bind(this)
                })
            },

            //Price Difference (District Wise) Tmg Error Handle Function
            Price_Difference_District_Wise_CircularNumber_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oTenthTableDataModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                }
            },
            Price_Difference_District_Wise_DistrictName_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oTenthTableDataModel').getObject();
                var ExcelDataCompare1 = this.getView().getModel("oDistrictNameModel").getProperty("/aDistrictName")
                var DistrictArr = [];
                for (var S = 0; S < ExcelDataCompare1.length; S++) {
                    DistrictArr.push((ExcelDataCompare1[S].DistrictName));
                }
                if (DistrictArr.includes(oEvent.mParameters.value) == true) {
                    oContext.DistrictName_valueState = "None";
                }
            },
            EleventhTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving data"
                });

                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCREDIT_NOT_GL")
                var tabledata = this.getView().getModel("oEleventhTableDataModel").getProperty("/aEleventhTable");

                var oTableModel = this.getView().getModel('oEleventhTableDataModel');
                var data = oTableModel.getProperty("/aEleventhTable")

                tabledata.map(function (items) {
                    var oFilter1 = new sap.ui.model.Filter("Material", "EQ", items.Material)
                    // var oFilter2 = new sap.ui.model.Filter("GlAccount", "EQ", items.GlAccount)

                    oModel.read("/ZCREDIT_NOT_GL_PRJ", {
                        filters: [oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                var obj = {
                                    "Material": items.Material,
                                    "GlAccount": items.GlAccount
                                }

                                oModel.update("/ZCREDIT_NOT_GL_PRJ(Material='" + encodeURIComponent(items.Material) + "')", obj, {
                                    success: function (oresponse) {
                                        MessageToast.show("Data updated")
                                        oBusyDialog.close()
                                    }.bind(this),
                                    error: function () {
                                        MessageToast.show("Data was not updated")
                                        oBusyDialog.close()
                                    }
                                })

                            }
                            else {
                                var obj1 = {
                                    "Material": items.Material,
                                    "GlAccount": items.GlAccount
                                }
                                oModel.create("/ZCREDIT_NOT_GL_PRJ", obj1, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data saved")
                                    }.bind(this),
                                    error: function () {
                                        MessageToast.show("Data was not saved")
                                        oBusyDialog.close()
                                    }
                                })
                            }
                        }
                    })

                })

            },

            CallEleventhTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });

                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCREDIT_NOT_GL")
                var aTableArr = [];
                oModel.read("/ZCREDIT_NOT_GL_PRJ", {
                    urlParameters: { "$top": "5000" },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "Material": items.Material,
                                "GlAccount": items.GlAccount,
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oEleventhTableDataModel').setProperty("/aEleventhTable", aTableArr)
                        oBusyDialog.close();
                    }.bind(this)
                })
            },

            EleventhTableExcelUpload: function () {
                var oTableModel = this.getView().getModel("oEleventhTableDataModel")
                var aTableArr = oTableModel.getProperty("/aEleventhTable")
                var Errorlen = aTableArr.length;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = new Uint8Array(e.target.result);
                                        var workbook = XLSX.read(data, {
                                            type: 'array',
                                            cellDates: true
                                        });
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "Material": (jsonData[D].Material).toString(),
                                                "GlAccount": (jsonData[D].GlAccount).toString(),
                                            }
                                            aTableArr.push(obj);
                                        }
                                        oTableModel.setProperty("/aEleventhTable", aTableArr)

                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            EleventhTableSingleRowAdd: function () {
                var oTableModel = this.getView().getModel("oEleventhTableDataModel");
                var aTableArr = oTableModel.getProperty("/aEleventhTable");
                var obj = {
                    "Material": "",
                    "GlAccount": ""
                }
                aTableArr.push(obj);
                oTableModel.setProperty("/aEleventhTable", aTableArr)
            },

            EleventhTableSingleRowDelete: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Delete data"
                });

                oBusyDialog.open();
                // var oModel = this.getView().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCREDIT_NOT_GL")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oEleventhTableDataModel");
                var aTableArr = oTableModel.getProperty("/aEleventhTable");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZCREDIT_NOT_GL_PRJ(Material='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].Material) + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Deleted")
                            oBusyDialog.close();

                        },
                        error(oresponse) {
                            MessageToast.show("Data not Deleted")
                            oBusyDialog.close();
                        }

                    })
                }
                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aEleventhTable", aTableArr)
            },

            EleventhTableExcelDownload: function () {
                var rows = [{
                    "Material": "",
                    "GlAccount": ""
                }]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");
                XLSX.writeFile(workbook, "Credit Note GL.xlsx");
            },


        });
    });
