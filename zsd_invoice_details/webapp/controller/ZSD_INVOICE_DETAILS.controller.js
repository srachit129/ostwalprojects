sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "zsdinvoicedetails/libs/xlsx.min"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageBox, MessageToast, Spreadsheet, Export, ExportTypeCSV) {

        "use strict";

        return Controller.extend("zsdinvoicedetails.controller.ZSD_INVOICE_DETAILS", {
            onInit: function () {
                this.TableChange();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oFirstTableDataModel");
                this.getView().getModel("oFirstTableDataModel").setProperty("/aFirstTableData", []);
                this.CallFirstTableData();

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oSecondTableDataModel");
                this.getView().getModel("oSecondTableDataModel").setProperty("/aSecondTableData", []);
                this.CallSecondTableData();


                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oThirdTableDataModel");
                this.getView().getModel("oThirdTableDataModel").setProperty("/aThirdTableData", []);
                this.CallThirdTableData();


                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oForthTableDataModel");
                this.getView().getModel("oForthTableDataModel").setProperty("/aForthTableData", []);
                this.CallForthTableData();


                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oFifthTableDataModel");
                this.getView().getModel("oFifthTableDataModel").setProperty("/aFifthTableData", []);
                this.CallFifthTableData();
            },
            TableChange: function () {
                var radioButton = this.getView().byId("radioButton").getSelectedIndex();
                if (radioButton === 0) {
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
                }
                else if (radioButton === 1) {
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
                }
                else if (radioButton === 2) {
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
                }
                else if (radioButton === 3) {
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
                }
                else if (radioButton === 4) {
                    var oPanel = this.getView().byId("Panel2");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel3");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel4");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel5");
                    oPanel.setVisible(false);
                    var oPanel = this.getView().byId("Panel6");
                    oPanel.setVisible(true);
                }
            },
            AddSingleRowInFirstTableData: function () {
                var TableModel = this.getView().getModel("oFirstTableDataModel");
                var aTableArr = TableModel.getProperty("/aFirstTableData")

                var obj = {
                    Terms: "",
                    No1: "",
                    Company_code: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aFirstTableData", aTableArr);

            },
            CallFirstTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    customIcon: '/css/preloader1.gif',
                    text: "Loading"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_TERMS");
                var TableModel = this.getView().getModel("oFirstTableDataModel");
                var aTableArr = TableModel.getProperty("/aFirstTableData")
                var aNewArr = [];
                oModel.read("/terms", {
                    // filters: [oFilter1, oFilter2, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var obj = {
                                    "Terms": items.Terms,
                                    "Company_code": items.Company_code,
                                    "No1": items.No1,
                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel("oFirstTableDataModel").setProperty("/aFirstTableData", aTableArr)
                        }
                        oBusyDialog.close();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();

                    }.bind(this)

                })


            },
            AddSingleRowInSecondTableData: function () {
                var TableModel = this.getView().getModel("oSecondTableDataModel");
                var aTableArr = TableModel.getProperty("/aSecondTableData")

                var obj = {
                    Company_Det: "",
                    CorporateOff: "",
                    RegisteredOff: "",
                    Pan: "",
                    TelNo: "",
                    Email: "",
                    Website: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aSecondTableData", aTableArr);

            },
            CallSecondTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    customIcon: '/css/preloader1.gif',
                    text: "Loading"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_COMPANY_DET_DET");
                var SecondTableModel = this.getView().getModel("oSecondTableDataModel");
                var aSecondTableArr = SecondTableModel.getProperty("/aSecondTableData");
                oModel.read("/zsd_company_det_cds", {
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var obj = {
                                    "Company_Det": items.Company_Det,
                                    "Company_code": items.Company_code,
                                    "CorporateOff": items.CorporateOff,
                                    "RegisteredOff": items.RegisteredOff,
                                    "Cin": items.Cin,
                                    "Pan": items.Pan,
                                    "TelNo": items.TelNo,
                                    "Email": items.Email,
                                    "Website": items.Website,
                                }
                                aSecondTableArr.push(obj);
                            })
                            this.getView().getModel("oSecondTableDataModel").setProperty("/aSecondTableData", aSecondTableArr)
                        }
                        oBusyDialog.close();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();

                    }.bind(this)

                })
            },
            AddSingleRowInThirdTableData: function () {
                var TableModel = this.getView().getModel("oThirdTableDataModel");
                var aTableArr = TableModel.getProperty("/aThirdTableData")

                var obj = {
                    Location_name: "",
                    Gstin: "",
                    Address: "",
                    Companycode: "",
                    Region: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aThirdTableData", aTableArr);

            },
            CallThirdTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_INVC_DISPACH1_PRJ_SRVC");
                // var oModel = this.getView().getModel();
                // var Plant = this.getView().byId("Plant").getValue();
                var TableModel = this.getView().getModel("oThirdTableDataModel");
                var aTableArr = TableModel.getProperty("/aThirdTableData")
                var aNewArr = [];

                // var oFilter1 = new sap.ui.model.Filter("Terms", "EQ", Terms)
                // var oBusyDialog = new sap.m.BusyDialog({
                //     title: "Fetching Data",
                //     text: "Please wait",
                // });
                // oBusyDialog.open();

                oModel.read("/zsd_invc_dispach1", {
                    // filters: [oFilter1, oFilter2, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var obj = {
                                    "Location_name": items.Location_name,
                                    "Gstin": items.Gstin,
                                    "Address": items.Address,
                                    "Companycode": items.Companycode,
                                    "Region": items.Region,
                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel("oThirdTableDataModel").setProperty("/aThirdTableData", aTableArr)
                        }
                        // this.AddSingleRowInThirdTableData();
                    }.bind(this),
                })



            },
            SaveFirstTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_TERMS");
                var OnScreenFirstTableData = this.getView().getModel("oFirstTableDataModel").getProperty("/aFirstTableData");
                var aNewArr = [];
                if (OnScreenFirstTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        title: "Saving Data",
                        text: "Please Wait"
                    });
                    busydialog.open();

                    OnScreenFirstTableData.map(function (items) {
                        var oTableData = {
                            No1: items.No1,
                            Terms: items.Terms,
                            Company_code: items.Company_code,
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var Terms = items.Terms;
                        var No1 = items.No1;
                        var Company_code = items.Company_code;
                        var oFilter1 = new sap.ui.model.Filter("Terms", "EQ", Terms)
                        var oFilter2 = new sap.ui.model.Filter("No1", "EQ", No1)
                        var oFilter3 = new sap.ui.model.Filter("Company_code", "EQ", Company_code)

                        oModel.read("/terms", {
                            filters: [oFilter2, oFilter3],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        Terms: items.Terms,
                                        No1: items.No1,
                                        Company_code: items.Company_code,
                                    }
                                    oModel.update("/terms(No1='" + No1 + "',Company_code='" + Company_code + "')", oTableData2, {
                                        success: function (response) {
                                            busydialog.close();
                                            MessageToast.show("Data Updated Succesfully")
                                        }
                                    })
                                } else {
                                    oModel.create("/terms", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            busydialog.close();
                                            MessageToast.show("Data Saved Succesfully")
                                            // MessageBox.show("Data Saved Succesfully", {
                                            //     title: "information",
                                            //     icon: MessageBox.Icon.SUCCESS,
                                            //     onClose: function (oAction) {
                                            //         if (oAction === MessageBox.Action.OK) {
                                            //             window.location.reload();
                                            //         }
                                            //     }
                                            // });
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Saved Succesfully")
                                            // MessageBox.show("Data Not Saved Succesfully", {
                                            //     title: "Warning",
                                            //     icon: MessageBox.Icon.ERROR,
                                            //     // onClose: function (oAction) {
                                            //     //     if (oAction === MessageBox.Action.OK) {
                                            //     //         window.location.reload();
                                            //     //     }
                                            //     // }
                                            // });
                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")

                }
            },
            DeleteFirstTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                // var plant = this.getView().byId("plant1").getValue();

                // var oModel = this.getView().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_TERMS");
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {
                    var oTableModel = this.getView().getModel("oFirstTableDataModel");
                    var aTableArr = oTableModel.getProperty("/aFirstTableData");
                    var aNewArr = [];

                    var tb = this.getView().byId("FirstTable");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        // var No1 = aSelectedIndex[i].No1;
                        // var Company_code = aSelectedIndex[i].Company_code;
                        oModel.remove("/terms(Company_code='" + data.Company_code + "',No1='" + data.No1 + "')", {
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
                        var No1 = item.No1;
                        var Company_code = item.Company_code;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (No1 === item.No1 && Company_code === item.Company_code) {
                                iIndex = index;
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })

                    oTableModel.setProperty("/aTableItem", aTableArr)
                } else if (aSelectedIndex.length < 1) {

                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast One Row")
                } else {
                    oBusyDialog.close();
                    MessageBox.error("You can delete by selecting only one row")
                }
            },
            SaveSecondTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_COMPANY_DET_DET");
                var OnScreenFirstTableData = this.getView().getModel("oSecondTableDataModel").getProperty("/aSecondTableData");
                var aNewArr = [];
                if (OnScreenFirstTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        title: "Saving Data",
                        text: "Please Wait"
                    });
                    busydialog.open();

                    OnScreenFirstTableData.map(function (items) {
                        var oTableData = {
                            Company_Det: items.Company_Det,
                            Company_code: items.Company_code,
                            CorporateOff: items.CorporateOff,
                            RegisteredOff: items.RegisteredOff,
                            Cin: items.Cin,
                            Pan: items.Pan,
                            TelNo: items.TelNo,
                            Email: items.Email,
                            Website: items.Website,
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var Company_Det = items.Company_Det;
                        var Company_code = items.Company_code;
                        var oFilter = new sap.ui.model.Filter("Company_code", "EQ", Company_code)
                        var oFilter1 = new sap.ui.model.Filter("Company_Det", "EQ", Company_Det)

                        oModel.read("/zsd_company_det_cds", {
                            filters: [oFilter, oFilter1],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        Company_Det: items.Company_Det,
                                        Company_code: items.Company_code,
                                        CorporateOff: items.CorporateOff,
                                        RegisteredOff: items.RegisteredOff,
                                        Cin: items.Cin,
                                        Pan: items.Pan,
                                        TelNo: items.TelNo,
                                        Email: items.Email,
                                        Website: items.Website,
                                    }
                                    oModel.update("/zsd_company_det_cds(Company_Det='" + encodeURIComponent(Company_Det) + "',Company_code='" + encodeURIComponent(Company_code) + "')", oTableData2, {
                                        success: function (response) {
                                            busydialog.close();
                                            MessageToast.show("Data Updated Succesfully")
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Updated Succesfully")
                                        }.bind(this)
                                    })
                                } else {
                                    oModel.create("/zsd_company_det_cds", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            busydialog.close();
                                            MessageToast.show("Data Saved Succesfully")
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Saved Succesfully")
                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")

                }
            },

            DeleteSecondTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_COMPANY_DET_DET");
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {
                    var oTableModel = this.getView().getModel("oSecondTableDataModel");
                    var aTableArr = oTableModel.getProperty("/aSecondTableData");
                    var aNewArr = [];

                    var tb = this.getView().byId("SecondTable");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        var Company_Det = aSelectedIndex[i].Company_Det;
                        // if( Company_Det == data.Company_Det ){

                        oModel.remove("/zsd_company_det_cds(Company_Det='" + encodeURIComponent(data.Company_Det) + "',Company_code='" + encodeURIComponent(data.Company_code) + "')", {
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
                        // }
                        // var Company_code = aSelectedIndex[i].Company_code;
                    }

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        aNewArr.push(aTableArr[aSelectedIndex[i]]);
                    }

                    aNewArr.map(function (item) {
                        var Company_Det = item.Company_Det;
                        var Company_code = item.Company_code;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (Company_Det === item.Company_Det && Company_code === item.Company_code) {
                                iIndex = index;
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })

                    oTableModel.setProperty("/aSecondTableData", aTableArr)
                } else if (aSelectedIndex.length < 1) {

                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast One Row")
                } else {
                    oBusyDialog.close();
                    MessageBox.error("You can delete by selecting only one row")
                }
            },

            SaveThirdTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_INVC_DISPACH1_PRJ_SRVC");

                var OnScreenThirdTableData = this.getView().getModel("oThirdTableDataModel").getProperty("/aThirdTableData");
                var aNewArr = [];
                if (OnScreenThirdTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        title: "Saving Data",
                        text: "Please Wait"
                    });
                    busydialog.open();

                    OnScreenThirdTableData.map(function (items) {
                        var oTableData = {
                            Location_name: items.Location_name,
                            Gstin: items.Gstin,
                            Address: items.Address,
                            Companycode: items.Companycode,
                            Region: items.Region,
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var Location_name = items.Location_name;
                        var oFilter1 = new sap.ui.model.Filter("Location_name", "EQ", Location_name)

                        oModel.read("/zsd_invc_dispach1", {
                            filters: [oFilter1],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        Location_name: items.Location_name,
                                        Gstin: items.Gstin,
                                        Address: items.Address,
                                        Companycode: items.Companycode,
                                        Region: items.Region,
                                    }
                                    oModel.update("/zsd_invc_dispach1(Location_name='" + encodeURIComponent(Location_name) + "')", oTableData2, {
                                        success: function (response) {
                                            busydialog.close();
                                            MessageToast.show("Data Updated Succesfully")

                                        }
                                    })
                                } else {
                                    oModel.create("/zsd_invc_dispach1", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            busydialog.close();
                                            MessageToast.show("Data Save Succesfully")

                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Save Succesfully")

                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")

                }
            },
            DeleteThirdTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_INVC_DISPACH1_PRJ_SRVC");
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {


                    var oTableModel = this.getView().getModel("oThirdTableDataModel");
                    var aTableArr = oTableModel.getProperty("/aThirdTableData");
                    var aNewArr = [];

                    var tb = this.getView().byId("Third_Table");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        oModel.remove("/zsd_invc_dispach1(Location_name='" + encodeURIComponent(data.Location_name) + "')", {
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
                        var Location_name = item.Location_name;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (Location_name === item.Location_name) {
                                iIndex = index;
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })

                    oTableModel.setProperty("/aThirdTableData", aTableArr)
                } else if (aSelectedIndex.length < 1) {

                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast One Row")
                } else {
                    oBusyDialog.close();
                    MessageBox.error("You can delete by selecting only one row")
                }
            },








            AddForthTableData: function () {
                var TableModel = this.getView().getModel("oForthTableDataModel");
                var aTableArr = TableModel.getProperty("/aForthTableData")

                var obj = {
                    CompanyCode: "",
                    CustomerAccountGroup: "",
                    BranchName: "",
                    AccountNumber: "",
                    IfscCode: "",
                    Other: "",
                    Division: "",
                    Statecode: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aForthTableData", aTableArr);

            },
            CallForthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_INVOICE_BANK_SERVICE");
                var TableModel = this.getView().getModel("oForthTableDataModel");
                var aTableArr = TableModel.getProperty("/aForthTableData")
                var aNewArr = [];
                oModel.read("/ZSD_INVOICE_BANK_CDS", {
                    // filters: [oFilter1, oFilter2, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var obj = {
                                    "CompanyCode": items.CompanyCode,
                                    "CustomerAccountGroup": items.CustomerAccountGroup,
                                    "BranchName": items.BranchName,
                                    "AccountNumber": items.AccountNumber,
                                    "IfscCode": items.IfscCode,
                                    "Other": items.Other,
                                    "Division": items.Division,
                                    "Statecode": items.Statecode,

                                }
                                aTableArr.push(obj);
                            })
                            this.getView().getModel("oForthTableDataModel").setProperty("/aForthTableData", aTableArr)
                        }
                        // this.AddSingleRowInFirstTableData();
                    }.bind(this),
                })



            },
            SaveForthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_INVOICE_BANK_SERVICE");
                var OnScreenFirstTableData = this.getView().getModel("oForthTableDataModel").getProperty("/aForthTableData");
                var aNewArr = [];
                if (OnScreenFirstTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        title: "Saving Data",
                        text: "Please Wait"
                    });
                    busydialog.open();

                    OnScreenFirstTableData.map(function (items) {
                        var oTableData = {
                            CompanyCode: items.CompanyCode,
                            CustomerAccountGroup: items.CustomerAccountGroup,
                            BranchName: items.BranchName,
                            AccountNumber: items.AccountNumber,
                            IfscCode: items.IfscCode,
                            Other: items.Other,
                            Division: items.Division,
                            Statecode: items.Statecode,
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var CompanyCode = items.CompanyCode;
                        var CustomerAccountGroup = items.CustomerAccountGroup;
                        var BranchName = items.BranchName;
                        var AccountNumber = items.AccountNumber;
                        var IfscCode = items.IfscCode;
                        var Other = items.Other;
                        var Division = items.Division;
                        var Statecode = items.Statecode;
                        var oFilter1 = new sap.ui.model.Filter("CompanyCode", "EQ", CompanyCode)
                        var oFilter2 = new sap.ui.model.Filter("CustomerAccountGroup", "EQ", CustomerAccountGroup)
                        var oFilter7 = new sap.ui.model.Filter("Division", "EQ", Division)
                        var oFilter8 = new sap.ui.model.Filter("Statecode", "EQ", Statecode)
                        // var oFilter3 = new sap.ui.model.Filter("BranchName", "EQ", BranchName)
                        // var oFilter4 = new sap.ui.model.Filter("AccountNumber", "EQ", AccountNumber)
                        // var oFilter5 = new sap.ui.model.Filter("IfscCode", "EQ", IfscCode)
                        // var oFilter6 = new sap.ui.model.Filter("Other", "EQ", Other)

                        oModel.read("/ZSD_INVOICE_BANK_CDS", {
                            filters: [oFilter1, oFilter2, oFilter7, oFilter8],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        CompanyCode: items.CompanyCode,
                                        CustomerAccountGroup: items.CustomerAccountGroup,
                                        BranchName: items.BranchName,
                                        AccountNumber: items.AccountNumber,
                                        IfscCode: items.IfscCode,
                                        Other: items.Other,
                                        Division: items.Division,
                                        Statecode: items.Statecode,

                                    }
                                    oModel.update("/ZSD_INVOICE_BANK_CDS(CompanyCode='" + encodeURIComponent(CompanyCode) + "',CustomerAccountGroup='" + encodeURIComponent(CustomerAccountGroup) + "',Division='" + encodeURIComponent(Division) + "',Statecode='" + encodeURIComponent(Statecode) + "')", oTableData2, {
                                        success: function (response) {
                                            busydialog.close();
                                            MessageToast.show("Data Updated Succesfully")
                                        }
                                    })
                                } else {
                                    oModel.create("/ZSD_INVOICE_BANK_CDS", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            busydialog.close();
                                            MessageToast.show("Data Saved Succesfully")
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Saved Succesfully")
                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")
                }
            },
            DeleteForthTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSD_INVOICE_BANK_SERVICE");
                // var OnScreenFirstTableData = this.getView().getModel("oForthTableDataModel").getProperty("/aForthTableData");
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {
                    var oTableModel = this.getView().getModel("oForthTableDataModel");
                    var aTableArr = oTableModel.getProperty("/aForthTableData");
                    var aNewArr = [];

                    var tb = this.getView().byId("Forth_Table");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        oModel.remove("/ZSD_INVOICE_BANK_CDS(CompanyCode='" + encodeURIComponent(data.CompanyCode) + "',CustomerAccountGroup='" + encodeURIComponent(data.CustomerAccountGroup) + "',Division='" + encodeURIComponent(data.Division) + "',Statecode='" + encodeURIComponent(data.Statecode) + "')", {
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
                        var CompanyCode = item.CompanyCode;
                        var CustomerAccountGroup = item.CustomerAccountGroup;
                        var Division = item.Division;
                        var Statecode = item.Statecode;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (CompanyCode === item.CompanyCode && CustomerAccountGroup === item.CustomerAccountGroup && Division === item.Division && Statecode === item.Statecode) {
                                iIndex = index;
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })

                    oTableModel.setProperty("/aForthTableData", aTableArr)
                }
                else if (aSelectedIndex.length < 1) {

                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast One Row")
                } else {
                    oBusyDialog.close();
                    MessageBox.error("You can delete by selecting only one row")
                }
            },
            
            csvJSON: function (csv) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableModel = this.getView().getModel('oForthTableDataModel');
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
                oTableModel.setProperty("/aForthTableData", data);
                this.getView().byId('Forth_Table').setVisibleRowCount(data);
                oBusyDialog.close();

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









            AddFifthTableData: function () {
                var TableModel = this.getView().getModel("oFifthTableDataModel");
                var aTableArr = TableModel.getProperty("/aFifthTableData")

                var obj = {
                    material_code: "",
                    plant: "",
                    customer_region_code: "",
                    lic_no: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aFifthTableData", aTableArr);

            },
            SaveFifthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLICENSE_SERVICE");
                var OnScreenFirstTableData = this.getView().getModel("oFifthTableDataModel").getProperty("/aFifthTableData");
                var aNewArr = [];
                if (OnScreenFirstTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        title: "Saving Data",
                        text: "Please Wait"
                    });
                    busydialog.open();

                    OnScreenFirstTableData.map(function (items) {

                        var validupto = items.valid_upto;
                        var oDate1 = new Date(validupto);
                        var validupto1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                        var validupto2 = validupto1.toISOString().slice(0, 16);

                        var oTableData = {
                            MaterialCode: items.MaterialCode,
                            Companycode: items.Companycode,
                            Plant: items.Plant,
                            CustomerRegionCode: items.CustomerRegionCode,
                            LicNo: items.LicNo,
                            ValidUpto: validupto2
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var MaterialCode = items.MaterialCode;
                        var Companycode = items.Companycode;
                        var CustomerRegionCode = items.CustomerRegionCode

                        var oFilter = new sap.ui.model.Filter("MaterialCode", "EQ", encodeURIComponent(MaterialCode))
                        var oFilter1 = new sap.ui.model.Filter("Companycode", "EQ", items.Companycode)
                        var oFilter2 = new sap.ui.model.Filter("CustomerRegionCode", "EQ", items.CustomerRegionCode)

                        oModel.read("/ZLICENSE_CDS", {
                            filters: [oFilter, oFilter1, oFilter2],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        MaterialCode: items.MaterialCode,
                                        Companycode: items.Companycode,
                                        Plant: items.Plant,
                                        CustomerRegionCode: items.CustomerRegionCode,
                                        LicNo: items.LicNo,
                                        ValidUpto: items.ValidUpto
                                    }
                                    oModel.update("/ZLICENSE_CDS(MaterialCode='" + MaterialCode + "',Companycode='" + Companycode + "',CustomerRegionCode='" + CustomerRegionCode + "')", oTableData2, {
                                        success: function (response) {
                                            busydialog.close();
                                            MessageToast.show("Data Updated Succesfully")
                                        }.bind(this), error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data was not updated")
                                        }.bind(this)
                                    })
                                } else {
                                    oModel.create("/ZLICENSE_CDS", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            busydialog.close();
                                            MessageToast.show("Data Saved Succesfully")
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Saved Succesfully")
                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")

                }
            },

            CallFifthTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLICENSE_SERVICE");
                var TableModel = this.getView().getModel("oFifthTableDataModel");
                var aTableArr = TableModel.getProperty("/aFifthTableData")
                var aNewArr = [];
                oModel.read("/ZLICENSE_CDS", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    // filters: [oFilter1, oFilter2, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {
                            oresponse.results.map(function (items) {
                                var validupto = items.ValidUpto
                                var oDate = new Date(validupto)
                                var validupto1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                                var validupto2 = validupto1.toISOString().slice(0, 10);

                                var obj = {
                                    "MaterialCode": items.MaterialCode,
                                    "Companycode": items.Companycode,
                                    "Plant": items.Plant,
                                    "CustomerRegionCode": items.CustomerRegionCode,
                                    "LicNo": items.LicNo,
                                    "valid_upto": validupto2
                                }
                                aTableArr.push(obj);
                            })
                            aTableArr.sort(function (a, b) {
                                return a.Companycode - b.Companycode;
                            })
                            this.getView().getModel("oFifthTableDataModel").setProperty("/aFifthTableData", aTableArr)
                        }
                        // this.AddSingleRowInFirstTableData();
                    }.bind(this),
                })

            },

            DeleteFifthTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLICENSE_SERVICE");
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {
                    var oTableModel = this.getView().getModel("oFifthTableDataModel");
                    var aTableArr = oTableModel.getProperty("/aFifthTableData");
                    var aNewArr = [];

                    var tb = this.getView().byId("Fifth_Table");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        oModel.remove("/ZLICENSE_CDS(MaterialCode='" + encodeURIComponent(data.MaterialCode) + "',Companycode='" + data.Companycode + "',CustomerRegionCode='" + data.CustomerRegionCode + "')", {
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
                        var MaterialCode = item.MaterialCode;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (MaterialCode === item.MaterialCode) {
                                iIndex = index;
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })

                    oTableModel.setProperty("/aFifthTableData", aTableArr)
                }
                else if (aSelectedIndex.length < 1) {

                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast One Row")
                } else {
                    oBusyDialog.close();
                    MessageBox.error("You can delete by selecting only one row")
                }
            },

            deleteFifthTable: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLICENSE_SERVICE")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oFifthTableDataModel");
                var aTableArr = oTableModel.getProperty("/aFifthTableData");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/ZLICENSE_CDS(MaterialCode='" + aTableArr[aSelectedIndex[i]].MaterialCode + "',Companycode='" + aTableArr[aSelectedIndex[i]].Companycode + "',CustomerRegionCode='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CustomerRegionCode) + "')", {
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
                    var ata = {};
                    ata = oFinalResult[j];
                    data.push(ata);
                }


                //return result; //JavaScript object
                oTableModel.setProperty("/aFifthTableData", data);
                this.getView().byId('Fifth_Table').setVisibleRowCount(data);
                oBusyDialog.close();

            },







            ExcelTemplateDownload1: sap.m.Table.prototype.exportData || function () {
                var oModel = this.getView().getModel("oFirstTableDataModel");
                var oExport = new Export({
                    exportType: new ExportTypeCSV({
                        fileExtension: "csv",
                        separatorChar: ","
                    }),
                    models: oModel,

                    rows: {
                        path: "/aFirstTableData"
                    },
                    columns: [
                        {
                            name: "Company_code",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "No1",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Terms",
                            template: {
                                content: "",
                            }
                        },
                    ]
                });
                console.log(oExport);
                oExport.saveFile().catch(function (oError) {
                }).then(function () {
                    oExport.destory();
                });
            },
            ExcelTemplateDownload2: sap.m.Table.prototype.exportData || function () {
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
                    columns: [
                        {
                            name: "Company_Det",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Company_code",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "CorporateOff",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "RegisteredOff",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Cin",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Pan",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "TelNo",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Email",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Website",
                            template: {
                                content: "",
                            }
                        },
                    ]
                });
                console.log(oExport);
                oExport.saveFile().catch(function (oError) {
                }).then(function () {
                    oExport.destory();
                });
            },
            ExcelTemplateDownload3: sap.m.Table.prototype.exportData || function () {
                var oModel = this.getView().getModel("oThirdTableDataModel");
                var oExport = new Export({
                    exportType: new ExportTypeCSV({
                        fileExtension: "csv",
                        separatorChar: ","
                    }),
                    models: oModel,

                    rows: {
                        path: "/aThirdTableData"
                    },
                    columns: [
                        {
                            name: "Location_name",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Gstin",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Address",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Companycode",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Region",
                            template: {
                                content: "",
                            }
                        },
                    ]
                });
                console.log(oExport);
                oExport.saveFile().catch(function (oError) {
                }).then(function () {
                    oExport.destory();
                });
            },
            ExcelTemplateDownload4: sap.m.Table.prototype.exportData || function () {
                var oModel = this.getView().getModel("oForthTableDataModel");
                var oExport = new Export({
                    exportType: new ExportTypeCSV({
                        fileExtension: "csv",
                        separatorChar: ","
                    }),
                    models: oModel,

                    rows: {
                        path: "/aForthTableData"
                    },
                    columns: [
                        {
                            name: "CompanyCode",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "CustomerAccountGroup",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Division",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Statecode",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "BranchName",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "AccountNumber",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "IfscCode",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Other",
                            template: {
                                content: "",
                            }
                        },
                    ]
                });
                console.log(oExport);
                oExport.saveFile().catch(function (oError) {
                }).then(function () {
                    oExport.destory();
                });
            },
            ExcelTemplateDownload5: sap.m.Table.prototype.exportData || function () {
                var oModel = this.getView().getModel("oFifthTableDataModel");
                var oExport = new Export({
                    exportType: new ExportTypeCSV({
                        fileExtension: "csv",
                        separatorChar: ","
                    }),
                    models: oModel,

                    rows: {
                        path: "/aFifthTableData"
                    },
                    columns: [
                        {
                            name: "MaterialCode",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Companycode",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "Plant",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "CustomerRegionCode",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "LicNo",
                            template: {
                                content: "",
                            }
                        },
                        {
                            name: "valid_upto",
                            template: {
                                content: "",
                            }
                        },
                    ]
                });
                console.log(oExport);
                oExport.saveFile().catch(function (oError) {
                }).then(function () {
                    oExport.destory();
                });
            },
            ExcelTableDataDownload5: function (){
                var rows = this.getView().getModel("oFifthTableDataModel").getProperty("/aFifthTableData");
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet2");

                // Save the workbook as an Excel file
                XLSX.writeFile(workbook, "Frc License Number.xlsx");
            },
        });
    });
