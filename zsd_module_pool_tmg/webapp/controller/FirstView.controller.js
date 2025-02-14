sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, Fragment, Filter, FilterOperator, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("zsdmodulepooltmg.controller.FirstView", {
            onInit: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS", "DELEAR_PORTAL", "ZuiehfdzCaFrYTAE6EijwpPFlg]gbZEGnwdNUYHc")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "CircularNumberModel")
                oModel.read("/YY1_SD_CIRCULARNUMBER", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("CircularNumberModel").setProperty("/aData", oresponse.results)
                    }.bind(this)
                })

                var obj2 = {
                    "aCircularVisibleorNot": false,
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj2), "oCircularVisibleModel");
                this.UpdateCicularNumberService();
            },
            CircularVisibleorNotFunction: function () {
                var Radio = this.byId("idActionRadioBtnGroup").getSelectedButton().getText();
                if (Radio === "Print") {
                    var obj = {
                        "aCircularVisibleorNot": true,
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "oCircularVisibleModel");
                }
                else {
                    var obj = {
                        "aCircularVisibleorNot": false,
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "oCircularVisibleModel");
                }

            },
            NextView: function () {
                var Radio = this.byId("idActionRadioBtnGroup").getSelectedButton().getText();
                if (Radio === "Quantity Discount") {
                    UIComponent.getRouterFor(this).navTo("Quantity_Discounts_Tmg");
                } else if (Radio === "Sales Rebate") {
                    UIComponent.getRouterFor(this).navTo("Sales_Rebates_Tmg");
                } else if (Radio === "Cash Discount") {
                    UIComponent.getRouterFor(this).navTo("Cash_Discount_Tmg")
                } else if (Radio === "Print") {
                    this.CallCircularPrint();
                } else if (Radio === "Update") {
                    this.UpdateCicularNumberService();
                }
            },
            CallCircularPrint: function () {
                var CircularNumber = this.getView().byId("CircularNumber").getValue();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                if (CircularNumber != "") {

                    oBusyDialog.open();
                    // https://my405122.s4hana.cloud.sap:443/sap/bc/http/sap/ZPRICE_CIRCULAR?sap-client=080 
                    var url1 = "/sap/bc/http/sap/ZPRICE_CIRCULAR?sap-client=080";
                    var url2 = "&CircularNumber=";
                    var url3 = url2 + CircularNumber;
                    var url = url1 + url3;
                    $.ajax({
                        url: url,
                        type: "GET",
                        success: function (result) {
                            if (result.slice(0, 5) === "ERROR") {
                                oBusyDialog.close();
                                MessageBox.error(result);
                            } else {
                                var decodedPdfContent = atob(result);
                                var byteArray = new Uint8Array(decodedPdfContent.length);
                                for (var i = 0; i < decodedPdfContent.length; i++) {
                                    byteArray[i] = decodedPdfContent.charCodeAt(i);
                                }
                                var blob = new Blob([byteArray.buffer], {
                                    type: 'application/pdf'
                                });
                                var _pdfurl = URL.createObjectURL(blob);

                                if (!this._PDFViewer) {
                                    this._PDFViewer = new sap.m.PDFViewer({
                                        width: "auto",
                                        source: _pdfurl
                                    });
                                    jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                                } else {
                                    this._PDFViewer = new sap.m.PDFViewer({
                                        width: "auto",
                                        source: _pdfurl
                                    });
                                    jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                                }
                                oBusyDialog.close();
                                this._PDFViewer.open();
                            }

                        }.bind(this),
                        error() {
                            oBusyDialog.close();
                        }
                    });
                }
                else {
                    MessageBox.show("Circular Number is Mandatory Field", {
                        title: "Warning!!!",
                        icon: MessageBox.Icon.ERROR
                    });
                }
            },
            UpdateCicularNumberService: function () {
                var oPanel = this.getView().byId("Panel1");
                oPanel.setVisible(false);
                var oBusy = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusy.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS")
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCIRCULAR_BINDING")
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oTableDataModel");
                var aNewArr = [];
                oModel.read("/YY1_SD_CIRCULARNUMBER", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var CircularNo = items.circular_no;
                            var Statecode = items.StateCode;

                            var CreatedDateTime = new Date(items.SAP_CreatedDateTime)
                            var CreatedDateTime1 = new Date(CreatedDateTime.getTime() - CreatedDateTime.getTimezoneOffset() * 60000);
                            var CreatedDateTime2 = CreatedDateTime1.toISOString().slice(0, 16);

                            var LastChangedDateTime = new Date(items.SAP_LastChangedDateTime)
                            var LastChangedDateTime1 = new Date(LastChangedDateTime.getTime() - LastChangedDateTime.getTimezoneOffset() * 60000);
                            var LastChangedDateTime2 = LastChangedDateTime1.toISOString().slice(0, 16);
                            var oFilter1 = new sap.ui.model.Filter("CircularNo", "EQ", CircularNo)
                            var oFilter2 = new sap.ui.model.Filter("Statecode", "EQ", Statecode)

                            oModel1.read("/ZCIRCULAR_CDS", {
                                filters: [oFilter1, oFilter2],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {
                                        var objectforUpdate = {
                                            "CircularNo": CircularNo,
                                            "Statecode": Statecode,
                                            "Description": items.SAP_Description,
                                            "CircularStatus": items.Circular_Status,
                                            "ValidTo": items.valid_to,
                                            "ValidFrom": items.valid_from,
                                            "ReleasedOn": items.released_on,
                                            "SalesZone": items.sales_zone,
                                            "SapCreateddatetime": CreatedDateTime2,
                                            "SapCreatedbyuser": items.SAP_CreatedByUser,
                                            "SapLastchangeddatetime": LastChangedDateTime2,
                                            "SapLifecyclestatus": items.SAP_LifecycleStatus,
                                        }
                                        oModel1.update("/ZCIRCULAR_CDS(CircularNo='" + encodeURIComponent(CircularNo) + "',Statecode='" + encodeURIComponent(Statecode) + "')", objectforUpdate, {
                                            success: function (oresponse) {
                                                MessageToast.show("Data Updated Successfully")
                                                oBusy.close();
                                                oPanel.setVisible(true);
                                            }.bind(this),
                                            error: function () {
                                                MessageToast.show("Data not updated")
                                                oBusy.close();
                                                oPanel.setVisible(true);
                                            }.bind(this)
                                        })
                                    } else {
                                        var objectforCreate = {
                                            "CircularNo": CircularNo,
                                            "Statecode": Statecode,
                                            "Description": items.SAP_Description,
                                            "CircularStatus": items.Circular_Status,
                                            "ValidTo": items.valid_to,
                                            "ValidFrom": items.valid_from,
                                            "ReleasedOn": items.released_on,
                                            "SalesZone": items.sales_zone,
                                            "SapCreateddatetime": CreatedDateTime2,
                                            "SapCreatedbyuser": items.SAP_CreatedByUser,
                                            "SapLastchangeddatetime": LastChangedDateTime2,
                                            "SapLifecyclestatus": items.SAP_LifecycleStatus,
                                        }
                                        oModel1.create("/ZCIRCULAR_CDS", objectforCreate, {
                                            success: function (oresponse) {
                                                MessageToast.show("Data Saved Successfully")
                                                oBusy.close();
                                                oPanel.setVisible(true);
                                            }.bind(this),
                                            error: function (oresponse) {
                                                MessageToast.show("Data not saved")
                                                oPanel.setVisible(true);
                                                oBusy.close();
                                            }.bind(this)
                                        })
                                    }
                                }
                            })

                            // aNewArr.push(obj)
                        }.bind(this))
                        // oBusy.close();
                        console.log(aNewArr)
                        // this.getView().getModel("oTableDataModel").setProperty("/aTableData", oresponse.results);
                    }.bind(this)
                })
            },
            PanelVisibleorNotFunction: function () {
                var obj1 = {
                    "aPanelVisibleorNot": true,
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj1), "oPanelVisibleModel");
            },
















            
            handleValueHelpCircularNumber: function (oEvent) {

                var oView = this.getView();
                this._sInputId1 = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog1) {
                    this._pValueHelpDialog1 = Fragment.load({
                        id: oView.getId(),
                        name: "zsdmodulepooltmg.fragments.CircularNumberDialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog1.then(function (oValueHelpDialog) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{CircularNumberModel>circular_no}",
                        description: "{CircularNumberModel>SAP_Description}",
                        type: "Active"
                    });
                    oValueHelpDialog.bindAggregation("items", {
                        path: 'CircularNumberModel>/aData',
                        template: oTemplate
                    });
                    oValueHelpDialog.setTitle("Select Circular Number");
                    oValueHelpDialog.setResizable(true);
                    // oValueHelpDialog.setMultiSelect(true);
                    oValueHelpDialog.open();
                });
            },
            _handleValueHelpCircularNumberClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var productInput = this.byId(this._sInputId1);
                    productInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },
            onSearch_CircularNumber: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("circular_no", FilterOperator.Contains, sValue),
                    new Filter("SAP_Description", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
        });
    });
