sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    'sap/ui/model/type/String',
    'sap/m/Token',
    'sap/ui/comp/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox, TypeString, Token, compLibrary) {
        "use strict";

        return Controller.extend("ztmgforquantitydiscount.controller.Tmg_For_Quantity_Discount", {
            onInit: function () {
                this._oMultipleConditionsInput = this.byId("multipleConditions");
                // this._oMultipleConditionsInput.setTokens(this._getDefaultTokens());



                this.getView().setModel(new sap.ui.model.json.JSONModel(), "TableDataModel");
                this.getView().getModel("TableDataModel").setProperty("/aTableData", []);
                this.CallTableData();
            },
            CallTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    customIcon: '/css/preloader1.gif',
                    text: "Fetching"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var TableModel = this.getView().getModel("TableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData")
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
                            this.getView().getModel("TableDataModel").setProperty("/aTableData", aTableArr)
                        }
                        oBusyDialog.close();
                    }.bind(this),
                })



            },
            AddSingleRowInTableData: function () {
                var TableModel = this.getView().getModel("TableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData")

                var obj = {
                    Circularnumber: "",
                    DisValdFom: "",
                    DisValidTo: "",
                    Status: "",
                    Materialpricinggroup: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aTableData", aTableArr);
            },

            SaveTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var tabledata = this.getView().getModel("TableDataModel").getProperty("/aTableData");
                var oTableModel = this.getView().getModel('TableDataModel');
                var data = oTableModel.getProperty("/aTableData")
                var indexvalue = data.length;
                var indexvalue1 = indexvalue - 1;
                var StatusArr = [];

                for (var j = 0; j < indexvalue; j++) {
                    var Status = data[j].Status;
                    if (Status != "A" && Status != "C") {
                        StatusArr.push(j + 1);
                    }
                }
                if (StatusArr.length > 0) {
                    var ErrorIndex = StatusArr.toString();
                    oBusyDialog.close();
                    MessageBox.error("The status is incorrect at row " + ErrorIndex + " of the table")
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

            TableCellHide: function () {
                var oTable = this.byId("TmgTableForQuantityDiscountModulePool");
                var oCell1 = oTable.getRows()[2].getCells()[2];
                oTable.getRows()[3].getCells()[1].addStyleClass("highlighted");
                oCell1.setEditable(false);
                oCell1.addStyleClass("highlighted");
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
                var oTableModel = this.getView().getModel('TableDataModel');
                var data = oTableModel.getProperty("/aTableData")
                var data1 = oTableModel.getProperty("/aTableData")
                var indexvalue = data1.length;
                // var oContext = csv.getSource().getBindingContext('TableDataModel').getObject();
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
                var StatusArr = [];
                // var data = [];
                for (var j = 0; j < len; j++) {
                    var ata = {};
                    ata = oFinalResult[j];
                    var oDate = new Date(oFinalResult[j].DocumentValidFrom)
                    var dt1 = Number(oDate.getDate());
                    var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                    var mm1 = Number(oDate.getMonth() + 1);
                    var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                    var DocumentValidFrom = oDate.getFullYear() + '-' + MM1 + '-' + DT1;






                    var oDate1 = new Date(oFinalResult[j].DocumentValidTo)
                    var dt1 = Number(oDate1.getDate());
                    var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                    var mm1 = Number(oDate1.getMonth() + 1);
                    var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                    var DocumentValidTo = oDate1.getFullYear() + '-' + MM1 + '-' + DT1;


                    var Status = oFinalResult[j].Status;
                    if (Status != "A" && Status != "C") {
                        StatusArr.push(indexvalue + j + 1);
                    }
                    var myObject = {
                        "Circularnumber": oFinalResult[j].Circularnumber,
                        "DocumentValidFrom": DocumentValidFrom,
                        "DocumentValidTo": DocumentValidTo,
                        "Materialpricinggroup": oFinalResult[j].Materialpricinggroup,
                        "Status": oFinalResult[j].Status,
                    }

                    data.push(myObject);
                }
                var ErrorIndex = StatusArr.toString();
                MessageBox.error("The status is incorrect at row " + ErrorIndex + " of the table")

                //return result; //JavaScript object
                oTableModel.setProperty("/aTableData", data);
                this.getView().byId('TmgTableForQuantityDiscountModulePool').setVisibleRowCount(data);
                oBusyDialog.close();

            },

            removeRow: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("TableDataModel");
                var aTableArr = oTableModel.getProperty("/aTableData");
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




            DeleteTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                // var plant = this.getView().byId("plant1").getValue();

                // var oModel = this.getView().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("TableDataModel");
                var aTableArr = oTableModel.getProperty("/aTableData");
                var aNewArr = [];

                var tb = this.getView().byId("TmgTableForQuantityDiscountModulePool");

                var rowid = tb.getSelectedIndices();
                var data = aTableArr[rowid];

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/dis(Circularnumber='" + encodeURIComponent(data.Circularnumber) + "',Materialpricinggroup='" + encodeURIComponent(data.Materialpricinggroup) + "')", {
                        method: "DELETE",
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

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    aNewArr.push(aTableArr[aSelectedIndex[i]]);
                }

                aNewArr.map(function (item) {
                    var Circularnumber = item.Circularnumber;
                    var DisValdFom = item.DisValdFom;
                    var DisValidTo = item.DisValidTo;
                    var Status = item.Status;
                    var Materialpricinggroup = item.Materialpricinggroup;
                    var iIndex = "";
                    aTableArr.map(function (item, index) {
                        if (Circularnumber === item.Circularnumber && DisValdFom === item.DisValdFom && Status === item.Status && DisValidTo === item.DisValidTo && Materialpricinggroup === item.Materialpricinggroup) {
                            iIndex = index;
                        }
                    })
                    aTableArr.splice(iIndex, 1);
                })
                oTableModel.setProperty("/aTableData", aTableArr)
            },























            onMultipleConditionsVHRequested: function () {

                this.loadFragment({
                    name: "ztmgforquantitydiscount.fragment.ValueHelpDialogMultipleConditions"
                }).then(function (oMultipleConditionsDialog) {

                    this._oMultipleConditionsDialog = oMultipleConditionsDialog;
                    this.getView().addDependent(oMultipleConditionsDialog);
                    oMultipleConditionsDialog.setRangeKeyFields([{
                        label: "Product",
                        key: "ProductId",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);

                    oMultipleConditionsDialog.setTokens(this._oMultipleConditionsInput.getTokens());
                    oMultipleConditionsDialog.open();
                }.bind(this));
            },
            _getDefaultTokens: function () {
                var ValueHelpRangeOperation = compLibrary.valuehelpdialog.ValueHelpRangeOperation;
                var oToken1 = new Token({
                    key: "range_0",
                    text: "=HT-1001"
                }).data("range", {
                    "exclude": false,
                    "operation": ValueHelpRangeOperation.EQ,
                    "keyField": "ProductId",
                    "value1": "HT-1001",
                    "value2": ""
                });
                var oToken2 = new Token({
                    key: "range_1",
                    text: "!(=HT-1000)"
                }).data("range", {
                    "exclude": true,
                    "operation": ValueHelpRangeOperation.EQ,
                    "keyField": "ProductId",
                    "value1": "HT-1000",
                    "value2": ""
                });
    
                return [oToken1, oToken2];
            },
            onMultipleConditionsValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this._oMultipleConditionsInput.setTokens(aTokens);
                this._oMultipleConditionsDialog.close();
            },
            onMultipleConditionsCancelPress: function () {
                this._oMultipleConditionsDialog.close();
            },
            onMultipleConditionsAfterClose: function () {
                this._oMultipleConditionsDialog.destroy();
            },
            GetData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    customIcon: '/css/preloader1.gif',
                    text: "Fetching"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var TableModel = this.getView().getModel("TableDataModel");
                var aTableArr = []
                var aNewArr = [];
                var customerCode = this.getView().byId("multipleConditions").getTokens();
                var customerData = customerCode.map(function (oToken) {
                    return oToken.getText();
                    // return "SP";
                });
                var aFilters = customerData.map(function (value) {
                    // console.log(value)
                    var fil = value.search("");
                    var dev = "NE"
                    return new sap.ui.model.Filter("Materialpricinggroup", dev, value)
                })
                var oFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false
                });
                oModel.read("/dis", {
                    // filters: [oFilter],
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
                            this.getView().getModel("TableDataModel").setProperty("/aTableData", aTableArr)
                        }
                        oBusyDialog.close();
                    }.bind(this),
                })



            },



            
        });
    });
