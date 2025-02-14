sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/m/Text",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "zsdmodulepooltmg/js/xlsx.full.min",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageBox, MessageToast, Spreadsheet, Text, Export, ExportTypeCSV) {
        "use strict";

        return Controller.extend("zsdmodulepooltmg.controller.Quantity_Discounts_Tmg", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oFirstTableItemModel");
                this.getView().getModel('oFirstTableItemModel').setProperty("/aFirstTableItem", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oSecondTableDataModel");
                this.getView().getModel("oSecondTableDataModel").setProperty("/aSecondTableData", []);

                UIComponent.getRouterFor(this).getRoute('Quantity_Discounts_Tmg').attachPatternMatched(this.TableChange, this);
                UIComponent.getRouterFor(this).getRoute('Quantity_Discounts_Tmg').attachPatternMatched(this.CallFirstTableData, this);
                UIComponent.getRouterFor(this).getRoute('Quantity_Discounts_Tmg').attachPatternMatched(this.CallSecondTableData, this);

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS", "DELEAR_PORTAL", "ZuiehfdzCaFrYTAE6EijwpPFlg]gbZEGnwdNUYHc")

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "CircularNumber")
                oModel.read("/YY1_SD_CIRCULARNUMBER", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("CircularNumber").setProperty("/aData", oresponse.results)
                    }.bind(this)
                })

                var oModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMATERIAL_PRICE_GROUP_BIND")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oMaterialPricingGroupModel")
                oModel2.read("/ZMATERIAL_PRICE_GROUP", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (item) {
                        this.getView().getModel("oMaterialPricingGroupModel").setProperty("/aMaterialPricingGroup", item.results)
                    }.bind(this)
                })
            },
            TableChange: function () {
                var radioButton = this.getView().byId("radioButton").getSelectedIndex();
                if (radioButton === 0) {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(true);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                }
                else if (radioButton === 1) {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(true);
                }
            },
            //Quantity Discount Tmg Data Call
            CallFirstTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQDT_SERVICE_BINDING")
                var aTableArr = [];
                oModel.read("/Quantity_Discount", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                // "SalesGroup": items.SalesGrp,
                                "CircularNumber": items.CircularNo,
                                "QuantitySlabFrom": items.QuantitySlabFrom,
                                "QuantitySlabTo": items.QuantitySlabTo,
                                "MaterialCode": items.Materialpricinggroup,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oFirstTableItemModel').setProperty("/aFirstTableItem", aTableArr)
                        oBusyDialog.close();

                    }.bind(this)
                })
            },

            //Quantity Discount Tmg Data Upload
            FirstTableExcelUpload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oFirstTableItemModel")
                var aTableArr = oTableModel.getProperty("/aFirstTableItem")
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
                                        });
                                        for (var D = 0; D < jsonData.length; D++) {
                                            var obj = {
                                                "CircularNumber": jsonData[D].CircularNumber.toString(),
                                                "QuantitySlabFrom": jsonData[D].QuantitySlabFrom.toString(),
                                                "QuantitySlabTo": jsonData[D].QuantitySlabTo.toString(),
                                                "MaterialCode": jsonData[D].MaterialCode.toString(),
                                                "Amount": jsonData[D].Amount.toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].MaterialCode).toString()) == false) {
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

            //Quantity Discount Tmg Data Save
            FirstTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();

                var oModel = this.getView().getModel();
                var tabledata = this.getView().getModel("oFirstTableItemModel").getProperty("/aFirstTableItem");
                var oTableModel = this.getView().getModel('oFirstTableItemModel');
                var data = oTableModel.getProperty("/aFirstTableItem")
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
                for (var D = 0; D < data.length; D++) {
                    var CircularNumber = data[D].CircularNumber;
                    var MaterialPricingGroup = data[D].MaterialCode;

                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);
                    if (circular_noIndex === -1 || MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(D + 1);
                    }
                    if (circular_noIndex === -1) {
                        data[D].CircularNumber_valueState = "Error";
                    }
                    if (MaterialPricingGroupIndex === -1) {
                        data[D].MaterialPricingGroup_valueState = "Error";
                    }
                }

                var value = []
                var index = []
                for (var i = 0; i < data.length - 1; i++) {
                    if (data[i].CircularNumber === data[i + 1].CircularNumber && data[i].MaterialCode === data[i + 1].MaterialCode) {
                        if (data[i + 1].QuantitySlabFrom > data[i].QuantitySlabFrom && data[i + 1].QuantitySlabFrom < data[i].QuantitySlabTo) {
                            value.push(data[i + 1].QuantitySlabFrom)
                            index.push(i + 1)
                            // MessageBox.error("Quantity Slab Value " + data[i + 1].QuantitySlabFrom + " already consumed on index " + i)
                        }
                    }
                }

                // for (var j = 0; j < indexvalue; j++) {
                //     var CircularNumber = data[j].CircularNumber;
                //     var MaterialPricingGroup = data[j].MaterialCode;

                //     var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);
                //     var circular_noIndex = CircularArr.indexOf(CircularNumber);
                //     // var circular_noIndex = CircularArr[CircularNumber];
                //     if (circular_noIndex === -1 || MaterialPricingGroupIndex === -1) {
                //         ErrorArr.push(j + 1);
                //         // break;
                //     }
                //     else if (circular_noIndex === -1) {
                //         ErrorArr.push(j + 1);
                //         MessageBox.error("The Circular Number is incorrect")
                //     } else if (MaterialPricingGroupIndex === -1) {
                //         ErrorArr.push(j + 1);
                //         MessageBox.error("The MaterialPricingGroup is incorrect")
                //     }


                // }
                if (ErrorArr.length > 0) {
                    oTableModel.setProperty("/aFirstTableItem", data)
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The Circular Number is incorrect at row " + ErrorIndex + " of the table")
                }
                else {
                    if (value.length > 0) {
                        oBusyDialog.close();
                        MessageBox.error("Quantity Slab Value " + value.join(", ") + " already lies between range on line " + index.join(", "))
                    } else {
                        tabledata.map(function (items) {
                            // var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                            var oFilter1 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                            var oFilter2 = new sap.ui.model.Filter("QuantitySlabFrom", "EQ", items.QuantitySlabFrom)
                            var oFilter3 = new sap.ui.model.Filter("QuantitySlabTo", "EQ", items.QuantitySlabTo)
                            var oFilter4 = new sap.ui.model.Filter("Materialpricinggroup", "EQ", items.MaterialCode)

                            // var circulationDateFrom = items.CalculationDateFrom
                            // var oDate = new Date(circulationDateFrom);
                            // var circulationDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                            // var circulationDateFrom2 = circulationDateFrom1.toISOString().slice(0, 16);

                            // var circulationDateTo = items.CalculationDateTo
                            // var oDate1 = new Date(circulationDateTo);
                            // var circulationDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                            // var circulationDateTo2 = circulationDateTo1.toISOString().slice(0, 16);

                            oModel.read("/Quantity_Discount", {
                                filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {

                                        var obj = {
                                            // "SalesGrp": items.SalesGroup,
                                            // "CirculationDateFrom": circulationDateFrom2,
                                            // "CirculationDateTo": circulationDateTo2,
                                            "CircularNo": items.CircularNumber,
                                            "QuantitySlabFrom": items.QuantitySlabFrom,
                                            "QuantitySlabTo": items.QuantitySlabTo,
                                            "Materialpricinggroup": items.MaterialCode,
                                            "Amount": items.Amount
                                        }

                                        oModel.update("/Quantity_Discount(CircularNo='" + encodeURIComponent(items.CircularNumber) + "',QuantitySlabFrom='" + items.QuantitySlabFrom + "',QuantitySlabTo='" + items.QuantitySlabTo + "',Materialpricinggroup='" + items.MaterialCode + "')", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Data updated")
                                            },
                                            error(oresponse) {
                                                oBusyDialog.close();
                                            }
                                        })
                                    } else {
                                        var obj = {
                                            // "CirculationDateFrom": circulationDateFrom2,
                                            // "CirculationDateTo": circulationDateTo2,
                                            "CircularNo": items.CircularNumber,
                                            "QuantitySlabFrom": items.QuantitySlabFrom,
                                            "QuantitySlabTo": items.QuantitySlabTo,
                                            "Materialpricinggroup": items.MaterialCode,
                                            "Amount": items.Amount
                                        }

                                        oModel.create("/Quantity_Discount", obj, {
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
                }
            },

            //Quantity Discount Tmg Data Add
            FirstTableaddSingleRow: function () {
                var oTableModel = this.getView().getModel("oFirstTableItemModel")
                var aTableArr = oTableModel.getProperty("/aFirstTableItem")
                var obj = {
                    "CircularNumber": "",
                    "QuantitySlabFrom": "",
                    "QuantitySlabTo": "",
                    "MaterialCode": "",
                    "Amount": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aFirstTableItem", aTableArr)

            },

            //Quantity Discount Tmg Data Delete
            FirstTableDeleteSingleRow: function (oEvent) {
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var property = oTable.mAggregations.columns[0].mProperties
                var value = property.hasOwnProperty('filterValue')
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oFirstTableItemModel");
                var aTableArr = oTableModel.getProperty("/aFirstTableItem");
                var id = "";
                var path = ""
                var idx = ""


                if (value === true) {
                    var arr = []

                    aTableArr.map(function (items) {
                        var circular = (items.CircularNumber).toLowerCase()
                        if (circular.includes((property.filterValue).toLowerCase())) {
                            arr.push(items)
                        }
                    })

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        oModel.remove("/Quantity_Discount(CircularNo='" + encodeURIComponent(arr[aSelectedIndex[i]].CircularNumber) + "',QuantitySlabFrom='" + arr[aSelectedIndex[i]].QuantitySlabFrom + "',QuantitySlabTo='" + arr[aSelectedIndex[i]].QuantitySlabTo + "',Materialpricinggroup='" + arr[aSelectedIndex[i]].MaterialCode + "')", {
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

                } else {
                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        oModel.remove("/Quantity_Discount(CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',QuantitySlabFrom='" + aTableArr[aSelectedIndex[i]].QuantitySlabFrom + "',QuantitySlabTo='" + aTableArr[aSelectedIndex[i]].QuantitySlabTo + "',Materialpricinggroup='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
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
                }
            },
            onFirstTableDataExport: function () {
                var rows = [{
                    "CircularNumber": "",
                    "QuantitySlabFrom": "",
                    "QuantitySlabTo": "",
                    "MaterialCode": "",
                    "Amount": ""
                }]
                var Validation_Data = [
                    {
                        "Excel Validation For Quantity Discount TMG": "1",
                        "Error": "Date Format is Mandatory in dd-MM-yyyy",
                    },
                    {
                        "Excel Validation For Quantity Discount TMG": "2",
                        "Error": "Please Enter Valid Circular Number",
                    },
                    {
                        "Excel Validation For Quantity Discount TMG": "3",
                        "Error": "Please Enter Valid Material Price Code",
                    }
                ]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                var worksheet1 = XLSX.utils.json_to_sheet(Validation_Data);
                var mergedCells = { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } };

                if (!worksheet1["!merges"]) worksheet1["!merges"] = [];
                worksheet1['!cols'] = [{ width: 15 }, { width: 50 }]; // Optional: Set column widths

                worksheet1["!merges"].push(mergedCells);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet1, "Validation");
                XLSX.writeFile(workbook, "Quantity Discount Tmg.xlsx");
            },

            //Quantity Discount Tmg Error Handle Function
            Quantity_Discount_CircularNumber_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oFirstTableItemModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                } else {
                    oContext.CircularNumber_valueState = "Error";
                }
            },
            Quantity_Discount_MaterialPricingGroup_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oFirstTableItemModel').getObject();
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.MaterialPricingGroup_valueState = "None";
                } else {
                    oContext.MaterialPricingGroup_valueState = "Error";
                }
            },
















            //Tmg for Quantity Discount Data Call
            CallSecondTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    // customIcon: '/css/preloader1.gif',
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var TableModel = this.getView().getModel("oSecondTableDataModel");
                var aTableArr = [];
                var aNewArr = [];
                oModel.read("/dis", {
                    // filters: [oFilter1, oFilter2, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var ValidForm = new Date(items.DisValdFom)
                                var dt = Number(ValidForm.getDate());
                                var DT = dt < 10 ? "0" + dt : dt;
                                var mm = Number(ValidForm.getMonth() + 1);
                                var MM = mm < 10 ? "0" + mm : mm;
                                var ValidForm1 = ValidForm.getFullYear() + '-' + MM + '-' + DT;

                                var ValidTo = new Date(items.DisValidTo)
                                var dt1 = Number(ValidTo.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(ValidTo.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var ValidTo1 = ValidTo.getFullYear() + '-' + MM1 + '-' + DT1;

                                var obj = {
                                    "Circularnumber": items.Circularnumber,
                                    "DocumentValidFrom": ValidForm1,
                                    "DocumentValidTo": ValidTo1,
                                    "Materialpricinggroup": items.Materialpricinggroup,
                                    "Status": items.Status,
                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel("oSecondTableDataModel").setProperty("/aSecondTableData", aTableArr)
                        }
                        oBusyDialog.close();
                    }.bind(this),
                })
            },

            //Tmg for Quantity Discount Add Single Row Data
            AddSingleRowInSecondTableData: function () {
                var TableModel = this.getView().getModel("oSecondTableDataModel");
                var aTableArr = TableModel.getProperty("/aSecondTableData")
                var obj = {
                    Circularnumber: "",
                    DisValdFom: "",
                    DisValidTo: "",
                    Status: "",
                    Materialpricinggroup: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aSecondTableData", aTableArr);
            },

            //Tmg for Quantity Discount Data Save
            SaveSecondTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var tabledata = this.getView().getModel("oSecondTableDataModel").getProperty("/aSecondTableData");
                var oTableModel = this.getView().getModel('oSecondTableDataModel');
                var data = oTableModel.getProperty("/aSecondTableData")
                var indexvalue = data.length;
                var indexvalue1 = indexvalue - 1;
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
                    var MaterialPricingGroup = data[j].Materialpricinggroup;
                    var CircularNumber = data[j].Circularnumber;
                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);
                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    // var circular_noIndex = CircularArr[CircularNumber];
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
                    oTableModel.setProperty("/aSecondTableData", data)
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The Circular Number or status is incorrect at row " + ErrorIndex + " of the table")
                }
                else {

                    tabledata.map(function (items) {
                        var oFilter1 = new sap.ui.model.Filter("Circularnumber", "EQ", items.Circularnumber)
                        var oFilter2 = new sap.ui.model.Filter("DisValdFom", "EQ", items.DocumentValidFrom)
                        var oFilter3 = new sap.ui.model.Filter("DisValidTo", "EQ", items.DocumentValidTo)
                        var oFilter4 = new sap.ui.model.Filter("Materialpricinggroup", "EQ", items.Materialpricinggroup)

                        var DisValdFromdt = items.DocumentValidFrom
                        var oDate = new Date(DisValdFromdt)
                        var DisValdFromdt1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        var DisValdFromdt2 = DisValdFromdt1.toISOString().slice(0, 16);
                        var DisValdFromdt3 = DisValdFromdt1.toISOString().slice(0, 10);

                        var DisValidTodt = items.DocumentValidTo
                        var oDate1 = new Date(DisValidTodt)
                        var DisValidTodt1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                        var DisValidTodt2 = DisValidTodt1.toISOString().slice(0, 16);
                        var DisValidTodt3 = DisValidTodt1.toISOString().slice(0, 10);




                        oModel.read("/dis", {
                            filters: [oFilter1],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var obj = {
                                        "Circularnumber": items.Circularnumber,
                                        "DisValdFom": DisValdFromdt2,
                                        "DisValidTo": DisValidTodt2,
                                        "Materialpricinggroup": items.Materialpricinggroup,
                                        "Status": items.Status,
                                    }

                                    oModel.update("/dis(Circularnumber='" + encodeURIComponent(items.Circularnumber) + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        },
                                        error: function () {
                                            MessageToast.show("You Alredy Enter This Data")
                                            oBusyDialog.close();
                                        }
                                    })
                                } else {
                                    var obj1 = {
                                        "Circularnumber": items.Circularnumber,
                                        "DisValdFom": DisValdFromdt2,
                                        "DisValidTo": DisValidTodt2,
                                        "Materialpricinggroup": items.Materialpricinggroup,
                                        "Status": items.Status,
                                    }

                                    oModel.create("/dis", obj1, {
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

            //Tmg for Quantity Discount Data Excel Upload
            SecondTableExcelUpload: function () {
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }

                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                var oTableModel = this.getView().getModel("oSecondTableDataModel")
                var aTableArr = oTableModel.getProperty("/aSecondTableData")
                var Errorlen = aTableArr.length;
                var excelData = {};
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
                                            dateNF: 'dd-MM-yyyy',
                                            // cellDates: true
                                        });
                                        var CircularNumber_ErrorArr = [];
                                        var MaterialPricingGroup_ErrorArr = [];
                                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                                        // var jsonData = XLSX.utils.sheet_to_json(worksheet);
                                        var jsonData = XLSX.utils.sheet_to_json(worksheet, {
                                            raw: false,
                                        });
                                        for (var D = 0; D < jsonData.length; D++) {
                                            const Excel_DocumentValidFrom = jsonData[D].DocumentValidFrom;
                                            var String_DocumentValidFrom = "";
                                            if (Excel_DocumentValidFrom.includes('.') == true) {
                                                var [day, month, year] = Excel_DocumentValidFrom.split('.');
                                                String_DocumentValidFrom = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_DocumentValidFrom.includes('-') == true) {
                                                var [day, month, year] = Excel_DocumentValidFrom.split('-');
                                                String_DocumentValidFrom = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else {
                                                String_DocumentValidFrom = Excel_DocumentValidFrom;
                                            }
                                            const DocumentValidFrom = new Date(String_DocumentValidFrom);
                                            const DocumentValidFrom1 = `${DocumentValidFrom.getFullYear()}-${DocumentValidFrom.getMonth() + 1 < 10 ? '0' : ''}${DocumentValidFrom.getMonth() + 1}-${DocumentValidFrom.getDate() < 10 ? '0' : ''}${DocumentValidFrom.getDate()}`;

                                            const Excel_DocumentValidTo = jsonData[D].DocumentValidTo;
                                            var String_DocumentValidTo = "";
                                            if (Excel_DocumentValidTo.includes('.') == true) {
                                                var [day, month, year] = Excel_DocumentValidTo.split('.');
                                                String_DocumentValidTo = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_DocumentValidTo.includes('-') == true) {
                                                var [day, month, year] = Excel_DocumentValidTo.split('-');
                                                String_DocumentValidTo = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else {
                                                String_DocumentValidTo = Excel_DocumentValidTo;
                                            }
                                            const DocumentValidTo = new Date(String_DocumentValidTo);
                                            const DocumentValidTo1 = `${DocumentValidTo.getFullYear()}-${DocumentValidTo.getMonth() + 1 < 10 ? '0' : ''}${DocumentValidTo.getMonth() + 1}-${DocumentValidTo.getDate() < 10 ? '0' : ''}${DocumentValidTo.getDate()}`;

                                            var obj = {
                                                "Circularnumber": jsonData[D].Circularnumber.toString(),
                                                "DocumentValidFrom": DocumentValidFrom1,
                                                "DocumentValidTo": DocumentValidTo1,
                                                "Materialpricinggroup": jsonData[D].Materialpricinggroup.toString(),
                                                "Status": jsonData[D].Status.toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].Circularnumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].Materialpricinggroup).toString()) == false) {
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
            //Tmg for Quantity Discount Data Delete
            DeleteSecondTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open(); var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oSecondTableDataModel");
                var aTableArr = oTableModel.getProperty("/aSecondTableData");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/dis(Circularnumber='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].Circularnumber) + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Delete Succesfully")
                            oBusyDialog.close();
                        },
                        error: function () {
                            MessageToast.show("Data Not Delete Succesfully")
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
                oTableModel.setProperty("/aTableItem", aTableArr)
            },

            onSecondTableDataExport: function () {
                var rows = [{
                    "Circularnumber": "",
                    "DocumentValidFrom": "dd-MM-yyyy",
                    "DocumentValidTo": "dd-MM-yyyy",
                    "Materialpricinggroup": "",
                    "Status": "",
                }]
                var Validation_Data = [
                    {
                        "Excel Validation For Quantity Discount TMG": "1",
                        "Error": "Date Format is Mandatory in dd-MM-yyyy",
                    },
                    {
                        "Excel Validation For Quantity Discount TMG": "2",
                        "Error": "Please Enter Valid Circular Number",
                    },
                    {
                        "Excel Validation For Quantity Discount TMG": "3",
                        "Error": "Please Enter Valid Material Price Code",
                    }
                ]
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                var worksheet1 = XLSX.utils.json_to_sheet(Validation_Data);
                var mergedCells = { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } };

                if (!worksheet1["!merges"]) worksheet1["!merges"] = [];
                worksheet1['!cols'] = [{ width: 15 }, { width: 50 }]; // Optional: Set column widths

                worksheet1["!merges"].push(mergedCells);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet1, "Validation");
                XLSX.writeFile(workbook, "Quantity Discount Validity.xlsx");
            },
            //Quantity Discount Validity Tmg Error Handle Function
            Quantity_Discount_Validity_CircularNumber_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oSecondTableDataModel').getObject();
                var ExcelDataCompare = this.getView().getModel("CircularNumber").getProperty("/aData")
                var CircularArr = [];
                for (var D = 0; D < ExcelDataCompare.length; D++) {
                    CircularArr.push(ExcelDataCompare[D].circular_no);
                }
                if (CircularArr.includes(oEvent.mParameters.value) == true) {
                    oContext.CircularNumber_valueState = "None";
                } else {
                    oContext.CircularNumber_valueState = "Error";
                }
            },
            Quantity_Discount_Validity_MaterialPricingGroup_valueState: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('oSecondTableDataModel').getObject();
                var ExcelDataCompare2 = this.getView().getModel("oMaterialPricingGroupModel").getProperty("/aMaterialPricingGroup")
                var MaterialPricingGroupArr = [];
                for (var R = 0; R < ExcelDataCompare2.length; R++) {
                    MaterialPricingGroupArr.push(ExcelDataCompare2[R].MaterialPricingGroup);
                }
                if (MaterialPricingGroupArr.includes(oEvent.mParameters.value) == true) {
                    oContext.MaterialPricingGroup_valueState = "None";
                } else {
                    oContext.MaterialPricingGroup_valueState = "Error";
                }
            },

        });
    });
