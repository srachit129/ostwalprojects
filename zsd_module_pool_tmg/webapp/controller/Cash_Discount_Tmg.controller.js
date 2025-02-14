sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "zsdmodulepooltmg/js/xlsx.full.min",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageBox, MessageToast, Text, Spreadsheet, Export, ExportTypeCSV) {
        "use strict";

        return Controller.extend("zsdmodulepooltmg.controller.Cash_Discount_Tmg", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oFirstTableItemModel");
                this.getView().getModel('oFirstTableItemModel').setProperty("/aFirstTableItem", []);
                this.CallFirstTableData();


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
            FirstTableaddSingleRow: function () {
                var oTableModel = this.getView().getModel("oFirstTableItemModel")
                var aTableArr = oTableModel.getProperty("/aFirstTableItem")
                var obj = {
                    "CircularNumber": "",
                    "MaterialGroup": "",
                    "FromDate": "",
                    "ToDate": "",
                    "Amount": "",
                }
                aTableArr.push(obj);
                oTableModel.setProperty("/aFirstTableItem", aTableArr)
            },
            FirstTableDeleteSingleRow: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCASHDIS")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oFirstTableItemModel");
                var aTableArr = oTableModel.getProperty("/aFirstTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZCASHDISCOUNT_CDS(CircularNo='" + encodeURIComponent((aTableArr[aSelectedIndex[i]].CircularNo)) + "',Matprgroup='" + encodeURIComponent((aTableArr[aSelectedIndex[i]].Matprgroup)) + "',Fromdate=datetime'" + encodeURIComponent((aTableArr[aSelectedIndex[i]].Fromdate + "T00:00:00")) + "',Todate=datetime'" + encodeURIComponent(aTableArr[aSelectedIndex[i]].Todate + "T00:00:00") + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Deleted")
                        }.bind(this),
                        error(oresponse) {
                            // oBusyDialog.close();
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
                oTableModel.setProperty("/aFirstTableItem", aTableArr)
            },

            onFirstTableExport: function () {
                var rows = [{
                    "CircularNumber": "",
                    "FromDate": "dd-MM-yyyy",
                    "ToDate": "dd-MM-yyyy",
                    "MaterialGroup": "",
                    "Amount": "",
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
                worksheet1['!cols'] = [{ width: 15 }, { width: 50 }];

                worksheet1["!merges"].push(mergedCells);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet1, "Validation");
                XLSX.writeFile(workbook, "Cash Discount.xlsx");
            },


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
                                            const Excel_FromDate = jsonData[D].FromDate;
                                            var String_FromDate = "";
                                            if (Excel_FromDate.includes('.') == true) {
                                                var [day, month, year] = Excel_FromDate.split('.');
                                                String_FromDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_FromDate.includes('-') == true) {
                                                var [day, month, year] = Excel_FromDate.split('-');
                                                String_FromDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else {
                                                String_FromDate = Excel_FromDate;
                                            }
                                            const FromDate = new Date(String_FromDate);
                                            const FromDate1 = `${FromDate.getFullYear()}-${FromDate.getMonth() + 1 < 10 ? '0' : ''}${FromDate.getMonth() + 1}-${FromDate.getDate() < 10 ? '0' : ''}${FromDate.getDate()}`;

                                            const Excel_ToDate = jsonData[D].ToDate;
                                            var String_ToDate = "";
                                            if (Excel_ToDate.includes('.') == true) {
                                                var [day, month, year] = Excel_ToDate.split('.');
                                                String_ToDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else if (Excel_ToDate.includes('-') == true) {
                                                var [day, month, year] = Excel_ToDate.split('-');
                                                String_ToDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                            } else {
                                                String_ToDate = Excel_ToDate;
                                            }
                                            const ToDate = new Date(String_ToDate);
                                            const ToDate1 = `${ToDate.getFullYear()}-${ToDate.getMonth() + 1 < 10 ? '0' : ''}${ToDate.getMonth() + 1}-${ToDate.getDate() < 10 ? '0' : ''}${ToDate.getDate()}`;

                                            var obj = {
                                                "CircularNo": jsonData[D].CircularNumber.toString(),
                                                "Matprgroup": jsonData[D].MaterialGroup.toString(),
                                                "Fromdate": FromDate1,
                                                "Todate": ToDate1,
                                                "Amount": jsonData[D].Amount.toString(),
                                            }
                                            if (CircularArr.includes((jsonData[D].CircularNumber).toString()) == false) {
                                                CircularNumber_ErrorArr.push(Errorlen + D + 1)
                                                obj["CircularNumber_valueState"] = "Error";
                                            }
                                            if (MaterialPricingGroupArr.includes((jsonData[D].MaterialGroup).toString()) == false) {
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
            
            CallFirstTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCASHDIS")
                var aTableArr = [];
                oModel.read("/ZCASHDISCOUNT_CDS", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var Fromdate = new Date(items.Fromdate)
                            var dt1 = Number(Fromdate.getDate());
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(Fromdate.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var Fromdate1 = Fromdate.getFullYear() + '-' + MM1 + '-' + DT1;


                            var Todate = new Date(items.Todate)
                            var dt1 = Number(Todate.getDate());
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(Todate.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var Todate1 = Todate.getFullYear() + '-' + MM1 + '-' + DT1;
                            var obj = {
                                "CircularNo": items.CircularNo,
                                "Matprgroup": items.Matprgroup,
                                "Fromdate": Fromdate1,
                                "Todate": Todate1,
                                "Amount": items.Amount,
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oFirstTableItemModel').setProperty("/aFirstTableItem", aTableArr)
                        oBusyDialog.close();
                    }.bind(this)
                })
            },
            FirstTableDataSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCASHDIS")
                // var oModel = this.getView().getModel();
                var tabledata = this.getView().getModel("oFirstTableItemModel").getProperty("/aFirstTableItem");
                var oTableModel = this.getView().getModel('oFirstTableItemModel');
                var data = oTableModel.getProperty("/aFirstTableItem");
                var indexvalue = data.length;
                var ErrorArr = [];
                var CircularNumber_Error = [];
                var MaterialPricingGroup_Error = [];

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
                    var CircularNumber = data[j].CircularNo;
                    var MaterialPricingGroup = data[j].Matprgroup;

                    var MaterialPricingGroupIndex = MaterialPricingGroupArr.indexOf(MaterialPricingGroup);
                    var circular_noIndex = CircularArr.indexOf(CircularNumber);
                    // var circular_noIndex = CircularArr[CircularNumber];
                    if (circular_noIndex === -1 && MaterialPricingGroupIndex === -1) {
                        ErrorArr.push(j + 1);
                    } else if (circular_noIndex === -1) {
                        data[j].CircularNumber_valueState = "Error";
                        CircularNumber_Error.push(j + 1)
                    } else if (MaterialPricingGroupIndex === -1) {
                        data[j].MaterialPricingGroup_valueState = "Error";
                        MaterialPricingGroup_Error.push(j + 1);
                    }

                }
                if (CircularNumber_Error.length != 0 && MaterialPricingGroup_Error.length != 0) {
                    oTableModel.setProperty("/aFirstTableItem", data);
                    var ErrorIndex = ErrorArr.toString();
                    oBusyDialog.close();

                    MessageBox.error("The Circular Number and Material Group incorrect at row " + ErrorIndex + " of the table")
                }
                else {
                    tabledata.map(function (items) {
                        var oFilter = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNo)
                        var oFilter1 = new sap.ui.model.Filter("Matprgroup", "EQ", items.Matprgroup)
                        var oFilter2 = new sap.ui.model.Filter("Fromdate", "EQ", items.Fromdate)
                        var oFilter3 = new sap.ui.model.Filter("Todate", "EQ", items.Todate)

                        var Fromdate = items.Fromdate;
                        var oDate = new Date(Fromdate);
                        var Fromdate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        var Fromdate2 = Fromdate1.toISOString().slice(0, 16);

                        var Fromdate3 = Fromdate1.toISOString().slice(0, 10);

                        var Todate = items.Todate;
                        var oDate1 = new Date(Todate);
                        var Todate1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                        var Todate2 = Todate1.toISOString().slice(0, 16);

                        var Todate3 = Todate1.toISOString().slice(0, 10);

                        oModel.read("/ZCASHDISCOUNT_CDS", {
                            filters: [oFilter, oFilter1, oFilter2, oFilter3],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {

                                    var obj = {
                                        "CircularNo": items.CircularNo,
                                        "Matprgroup": items.Matprgroup,
                                        "Fromdate": Fromdate2,
                                        "Todate": Todate2,
                                        "Amount": items.Amount
                                    }

                                    oModel.update("/ZCASHDISCOUNT_CDS(CircularNo='" + encodeURIComponent(items.CircularNo) + "',Matprgroup='" + items.Matprgroup + "',Fromdate=datetime'" + encodeURIComponent((Fromdate3 + "T00:00:00")) + "',Todate=datetime'" + encodeURIComponent((Todate3 + "T00:00:00")) + "')", obj, {
                                        success: function (oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data updated")
                                        }.bind(this),
                                        error(oresponse) {
                                            oBusyDialog.close();
                                            MessageToast.show("Data not updated")
                                        }
                                    })
                                }
                                else {
                                    var obj1 = {
                                        "CircularNo": items.CircularNo,
                                        "Matprgroup": items.Matprgroup,
                                        "Fromdate": Fromdate2,
                                        "Todate": Todate2,
                                        "Amount": items.Amount
                                    }
                                    oModel.create("/ZCASHDISCOUNT_CDS", obj1, {
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
            //Cash Discount Validity Tmg Error Handle Function
            Cash_Discount_Validity_CircularNumber_valueState: function (oEvent) {
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
            Cash_Discount_Validity_MaterialPricingGroup_valueState: function (oEvent) {
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
        });

    });        