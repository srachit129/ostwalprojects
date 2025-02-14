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
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BusyDialog, UIComponent, MessageBox, MessageToast, Fragment, Sorter, syncStyleClass, JSONModel, Filter, FilterOperator, Spreadsheet, Export, ExportTypeCSV) {
        "use strict";
        var oBusy = new sap.m.BusyDialog({
            text: "Please Wait"
        });
        return Controller.extend("zmmdltmg.controller.mmdltmg", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oGenericModel");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_DL")
                oModel.read("/Zmm_dl_PJ0", {
                    success: function (oresponse) {

                    }
                })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oDiNumberDataModel")
                oModel.read("/Zmm_dl_PJ0", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oDiNumberDataModel").setProperty("/aDiNumberData", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oDiNumberData_AcctualQtyModel")
                oModel.read("/Zgrn_QTY", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oDiNumberData_AcctualQtyModel").setProperty("/aDiNumber_AcctualQtyData", oresponse.results)
                    }.bind(this)
                })

                this.onReadValueHelpData("MaterialValueHelp");
                this.onReadValueHelpData("PlantValueHelp");
                this.onReadValueHelpData("CompanyCodeValueHelp");
                this.onReadValueHelpData("ProductValueHelp");

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oMaterialGroupModel")
                oModel.read("/material_Group", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oMaterialGroupModel").setProperty("/aMaterialGroupData", oresponse.results)
                    }.bind(this)
                })
                this.CallBackendData();

            },
            CallBackendData: function () {
                // this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel")
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_DL")
                var aTableArr = []
                oModel.read("/Zmm_dl_PJ0", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var StartDate = new Date(items.StartDate)
                            var dt = Number(StartDate.getDate());
                            var DT = dt < 10 ? "0" + dt : dt;
                            var mm = Number(StartDate.getMonth() + 1);
                            var MM = mm < 10 ? "0" + mm : mm;
                            var StartDate1 = StartDate.getFullYear() + '-' + MM + '-' + DT;

                            var EndDat = new Date(items.EndDat)
                            var dt1 = Number(EndDat.getDate());
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(EndDat.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var EndDat1 = EndDat.getFullYear() + '-' + MM1 + '-' + DT1;

                            var obj = {
                                "DiNumber": items.DiNumber,
                                "CompanyCode": items.CompanyCode,
                                "Plant": items.Plant,
                                "MaterialCode": items.MaterialCode,
                                "MaterialDescription": items.Material_descr,
                                "MaterialGroupText": items.Material_group_desc,
                                "MaterialGroup": items.MaterialGroup,
                                "ActualQty": items.ActuallyQty,
                                "ReceivedQty": items.ReceivedQty,
                                "PendingQty": items.PendingQty,
                                "StartDate": StartDate1,
                                "EndDate": EndDat1
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel("oTableItemModel").setProperty("/aTableItem", aTableArr)
                        oBusyDialog.close();
                    }.bind(this)
                })

            },
            onReadValueHelpData: function (sTypeName) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_DL")
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCOMPANYCODE")
                var sPath = "";
                var oGenericModel = this.getView().getModel("oGenericModel");
                if (sTypeName === 'ProductValueHelp') {
                    sPath = "/material_Group";
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
                } else if (sTypeName === 'MaterialValueHelp') {
                    sPath = "/material";
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
                } else if (sTypeName === 'PlantValueHelp') {
                    sPath = "/Plant";
                    oModel1.read(sPath, {
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
                } else if (sTypeName === 'CompanyCodeValueHelp') {
                    sPath = "/Company_Code";
                    oModel1.read(sPath, {
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

            onConfirmDialog: function () {
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

            csvJSON: function (csv) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableModel = this.getView().getModel('oTableItemModel');
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
                oTableModel.setProperty("/aTableItem", data);
                this.getView().byId('table1').setVisibleRowCount(data);
                oBusyDialog.close();

            },

            onSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving data"
                });

                oBusyDialog.open();

                var oModel = this.getView().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableArr = oTableModel.getProperty("/aTableItem");

                aTableArr.map(function (items) {
                    var oFilter = new sap.ui.model.Filter("DiNumber", "EQ", items.DiNumber)

                    var startDate = new Date(items.StartDate);
                    var startDate1 = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
                    var startDate2 = startDate1.toISOString().slice(0, 16);

                    var endDate = new Date(items.EndDate);
                    var endDate1 = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
                    var endDate2 = endDate1.toISOString().slice(0, 16);

                    oModel.read("/Zmm_dl_PJ0", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            var obj = {
                                "DiNumber": items.DiNumber,
                                "CompanyCode": items.CompanyCode,
                                "Plant": items.Plant,
                                "MaterialCode": items.MaterialCode,
                                "Material_descr": items.MaterialDescription,
                                "Material_group_desc": items.MaterialGroupText,
                                "MaterialGroup": items.MaterialGroup,
                                "ActuallyQty": items.ActualQty == "" ? "0.00" : items.ActualQty,
                                "ReceivedQty": items.ReceivedQty == "" ? "0.00" : items.ReceivedQty,
                                "PendingQty": items.PendingQty == "" ? "0.00" : items.PendingQty,
                                "StartDate": startDate2,
                                "EndDat": endDate2
                            }
                            if (oresponse.results.length > 0) {
                                oModel.update("/Zmm_dl_PJ0(DiNumber='" + items.DiNumber + "')", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data updated.")
                                    }
                                })
                            } else {
                                oModel.create("/Zmm_dl_PJ0", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data Saved")
                                    }
                                })
                            }
                        }
                    })
                })

            },

            addRow: function () {
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var obj = {
                    "DiNumber": "",
                    "CompanyCode": "",
                    "Plant": "",
                    "MaterialCode": "",
                    "MaterialDescription": "",
                    "MaterialGroupText": "",
                    "MaterialGroup": "",
                    "ActuallyQty": "",
                    "ReceivedQty": "",
                    "PendingQty": "",
                    "StartDate": "",
                    "EndDat": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)
            },

            deleteRow: function (oEvent) {
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/Zmm_dl_PJ0(DiNumber='" + aTableArr[aSelectedIndex[i]].DiNumber + "')", {
                        success: function (oresponse) {
                            MessageToast.show("Data Deleted");
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

            DiNumberFunction: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var aDiNumberData = this.getView().getModel("oDiNumberDataModel").getProperty("/aDiNumberData");
                var aDiNumberData_AcctualQty = this.getView().getModel("oDiNumberData_AcctualQtyModel").getProperty("/aDiNumber_AcctualQtyData");
                var DiNumber = oContext.DiNumber;
                var DiNumberArr = [];

                for (var i = 0; i < aDiNumberData.length; i++) {
                    DiNumberArr.push(aDiNumberData[i].DiNumber)
                }
                var index = DiNumberArr.indexOf(DiNumber);
                if (index != -1) {
                    aDiNumberData.map(function (item) {
                        if (DiNumber == item.DiNumber) {
                            var CurrentDate = new Date(item.StartDate)
                            var dt1 = Number(CurrentDate.getDate());
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(CurrentDate.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;


                            var CurrentDate2 = new Date(item.EndDat)
                            var dt2 = Number(CurrentDate2.getDate());
                            var DT2 = dt2 < 10 ? "0" + dt2 : dt2;
                            var mm2 = Number(CurrentDate2.getMonth() + 1);
                            var MM2 = mm2 < 10 ? "0" + mm2 : mm2;
                            var CurrentDate21 = CurrentDate2.getFullYear() + '-' + MM2 + '-' + DT2;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().CompanyCode = item.CompanyCode;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().Plant = item.Plant;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().MaterialCode = item.MaterialCode;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().MaterialDescription = item.Material_descr;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().MaterialGroup = item.MaterialGroup;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().MaterialGroupText = item.Material_group_desc;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().ActualQty = item.ActuallyQty;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().ReceivedQty = item.ReceivedQty;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().PendingQty = item.PendingQty;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().StartDate = CurrentDate1;
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().EndDate = CurrentDate21;
                        }
                    })
                } else {
                    aDiNumberData_AcctualQty.map(function (items) {
                        if (DiNumber == items.YY1_DINumber_PDH) {
                            oEvent.getSource().getBindingContext("oTableItemModel").getObject().ReceivedQty = items.Qty;
                        }
                    })
                    // oEvent.getSource().getBindingContext("oTableItemModel").getObject().ActualQty = "item.ActuallyQty";
                }

            },
            DiNumberFunction_CallData: function (oEvent) {
                oBusy.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_DL");
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var DiNumber = oContext.DiNumber;
                if (DiNumber == "") {
                    oBusy.close();
                    MessageBox.error("Please Enter Di Number")
                }
                else {
                    var oFilter1 = new sap.ui.model.Filter("DiNumber", "EQ", DiNumber)
                    oModel.read("/Zmm_dl_PJ0", {
                        filters: [oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oresponse.results.map(function (items) {
                                    oEvent.getSource().getBindingContext("oTableItemModel").getObject().ActualQty = items.ActuallyQty;

                                })
                                oBusy.close();

                            }
                            else {

                                this.CallBackendData_According_Dinumber();
                            }
                        }.bind(this),
                    })
                }

            },
            CallBackendData_According_Dinumber: function () {
            
            },

            ActualQuantityFunction: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var ActualQty = Number(oContext.ActualQty);
                var ReceivedQty1 = oContext.ReceivedQty;
                var ReceivedQty = ReceivedQty1 == "" ? 0 : Number(oContext.ReceivedQty)
                var PendingQty = ActualQty - ReceivedQty;
                var PendingQty1 = PendingQty.toString();
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().PendingQty = PendingQty1;

            },

            RefreshTableData: function () {
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

            },

            OnDownloadExcel: function () {
                var aCols, aTable, oSettings, oSheet;
                var FileName = prompt("Please Enter File Name", "Ditmg");

                aCols = this.createColumnConfig();
                aTable = this.getView().getModel("oTableItemModel").getProperty('/aTableItem');
                oSettings = {
                    workbook: {
                        columns: aCols,
                        context: {

                        },
                        hierarchyLevel: 'Level'
                    },
                    dataSource: aTable,
                    fileName: FileName + '.xlsx',
                    worker: false
                };
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().then(function () {
                    MessageToast.show('Spreadsheet export has finished');
                }).finally(oSheet.destroy);
            },
            createColumnConfig: function () {
                return [
                    {
                        label: 'Di Number',
                        property: 'DiNumber',
                        width: '25'
                    },
                    {
                        label: 'Company Code',
                        property: 'CompanyCode',
                        width: '25'
                    },
                    {
                        label: 'Plant',
                        property: 'Plant',
                        width: '25'
                    },
                    {
                        label: 'Material Code',
                        property: 'MaterialCode',
                        width: '18'
                    },
                    {
                        label: 'Material Description',
                        property: 'MaterialDescription',
                        width: '18'
                    },
                    {
                        label: 'Material Group Text',
                        property: 'MaterialGroupText',
                        width: '18'
                    },
                    {
                        label: 'Material Group',
                        property: 'MaterialGroup',
                        width: '18'
                    },
                    {
                        label: 'Actual Qty',
                        property: 'ActualQty',
                        width: '18'
                    },
                    {
                        label: 'Received Qty',
                        property: 'ReceivedQty',
                        width: '18'
                    },
                    {
                        label: 'Pending Qty',
                        property: 'PendingQty',
                        width: '18'
                    },
                    {
                        label: 'Start Date',
                        property: 'StartDate',
                        width: '18'
                    },
                    {
                        label: 'End Date',
                        property: 'EndDate',
                        width: '18'
                    }];
            },











            //Its Created By Rachit Sir
            onValueHelpRequest: function (oEvent) {
                var oView = this.getView();
                
                var sKey = this.oSource.getCustomData()[0].getKey();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zmmdltmg.fragment.VendorValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    this._configValueHelpDialog(this.oSource);
                    if (sKey === 'MC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>ProductDescription}",
                            description: "{oGenericModel>material}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/MaterialValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Material");
                    } else if (sKey === 'PC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>ProductGroupText}",
                            description: "{oGenericModel>MaterialGroup}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/ProductValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Material");
                    } else if (sKey === 'Plant') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>PlantName}",
                            description: "{oGenericModel>Plant}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/PlantValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Plant");
                    } else if (sKey === 'CompanyCode') {
                        var oTemplate = new sap.m.StandardListItem({
                            description: "{oGenericModel>CompanyCode}",
                            title: "{oGenericModel>CompanyCodeName}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/CompanyCodeValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Company Code");
                    }

                    oValueHelpDialog.open();
                }.bind(this));
            },

            //Its Created By Rachit Sir
            _configValueHelpDialog: function (oSource) {
                var sInputValue = oSource.getValue(),
                    oModel = this.getView().getModel('oGenericModel'),
                    sKey = oSource.getCustomData()[0].getKey();
                if (sKey === 'MC') {
                    var aData = oModel.getProperty("/MaterialValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.material === sInputValue);
                    });
                    oModel.setProperty("/MaterialValueHelp", aData);
                } else if (sKey === 'PC') {
                    var aData = oModel.getProperty("/ProductValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.material === sInputValue);
                    });
                    oModel.setProperty("/ProductValueHelp", aData);
                } else if (sKey === 'Plant') {
                    var aData = oModel.getProperty("/PlantValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.Plant === sInputValue);
                    });
                    oModel.setProperty("/PlantValueHelp", aData);
                } else if (sKey === 'CompanyCode') {
                    var aData = oModel.getProperty("/CompanyCodeValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.Plant === sInputValue);
                    });
                    oModel.setProperty("/CompanyCodeValueHelp", aData);
                }
            },

            //Its Created By Rachit Sir
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
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).MaterialCode = oObject.material;
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).MaterialDescription = oObject.ProductDescription;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                } else if (sPath.search('/ProductValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).MaterialGroup = oObject.MaterialGroup;
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).MaterialGroupText = oObject.ProductGroupText;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                } else if (sPath.search('/PlantValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Plant = oObject.Plant;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                } else if (sPath.search('/CompanyCodeValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).CompanyCode = oObject.CompanyCode;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                }


                this.oSource.setValue(oSelectedItem.getDescription());
            },

            //Its Created By Rachit Sir
            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                if (oEvent.getParameter('itemsBinding').getPath() === '/MaterialValueHelp') {
                    var oFilter = new Filter([
                        new Filter("material", FilterOperator.Contains, sValue),
                        new Filter("ProductDescription", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Supplier", FilterOperator.Contains, sValue);
                    // var oFilter = new Filter("SupplierName", FilterOperator.Contains, sValue);
                } else if (oEvent.getParameter('itemsBinding').getPath() === '/ProductValueHelp') {
                    var oFilter = new Filter([
                        new Filter("MaterialGroup", FilterOperator.Contains, sValue),
                        new Filter("ProductGroupText", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Product", FilterOperator.Contains, sValue);
                } else if (oEvent.getParameter('itemsBinding').getPath() === '/PlantValueHelp') {
                    var oFilter = new Filter([
                        new Filter("Plant", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Product", FilterOperator.Contains, sValue);
                } else if (oEvent.getParameter('itemsBinding').getPath() === '/CompanyCodeValueHelp') {
                    var oFilter = new Filter([
                        new Filter("CompanyCode", FilterOperator.Contains, sValue),
                        new Filter("CompanyCodeName", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Product", FilterOperator.Contains, sValue);
                }
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            //Thie Function Is Not Use In This Module Pool
            onSendEmailPress: function () {
                // Compose the mailto link
                var recipientEmail = "kvshekhawat99195@gmail.com";
                var subject = "Hello Buddy";
                var body = "Please Fiend This Attachment";

                // Encode the components to ensure they are properly formatted in the mailto link
                recipientEmail = encodeURIComponent(recipientEmail);
                subject = encodeURIComponent(subject);
                body = encodeURIComponent(body);

                // Create the mailto link
                var mailtoLink = "mailto:" + recipientEmail + "?subject=" + subject + "&body=" + body;

                // Open the user's default email client with the pre-filled data
                window.location.href = mailtoLink;
            },
        });
    });
