sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        'sap/m/MessageToast',
        "sap/m/MessageBox",
    ],
    function (BaseController, UIComponent, JSONModel, MessageToast, MessageBox) {
        "use strict";

        return BaseController.extend("zinvoice.controller.InvoiceDetails", {
            onInit() {

                // this.getView().setModel(oModel, "view1");
                this.getView().setModel(new JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

                UIComponent.getRouterFor(this).getRoute('InvoiceDetails').attachPatternMatched(this._onRouteMatch, this);
            },
            _onRouteMatch: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                // this.getView().setModel(new JSONModel(), "oTableItemModel");
                // this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
                var oSettingObject = {
                    "editable": true,
                    "buttonVisible": true,
                    "buttonIrn": "Generate IRN",
                    "buttonEway": "Generate EwayBill & IRN",
                    "setEditable": true
                };
                this.getView().setModel(new JSONModel(oSettingObject), "oGenericModel");


                if (oCommonModel.getProperty('/displayObject').Action === "Generate") {
                    this.onReadData();
                    this.getView().getModel("oGenericModel").setProperty("/buttonVisible", true);
                } else if (oCommonModel.getProperty('/displayObject').Action === "Display") {
                    this.onReadData();

                    this.getView().getModel("oGenericModel").setProperty("/buttonVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/setEditable", false);


                } else if (oCommonModel.getProperty('/displayObject').Action === 'Cancel') {
                    this.onReadData();
                    this.getView().getModel("oGenericModel").setProperty("/buttonIrn", "Cancel IRN");
                    this.getView().getModel("oGenericModel").setProperty("/buttonEway", "Cancel EwayBill & IRN");
                    this.getView().getModel("oGenericModel").setProperty("/setEditable", false);
                    this.getView().setModel("oGenericModel").setProperty("/buttonVisible", true);
                }

            },

            onReadData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableArr = oTableModel.getProperty("/aTableItem")
                // var oModel = this.getView().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YINVOICE_DATA_BILLING");
                var billdoc = oCommonModel.getProperty('/invoiceObject').BillDoc;
                var idcode = oCommonModel.getProperty('/displayObject').idCode;
                var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", billdoc);

                // var aFilters = billdoc.map(function (value) {
                //     return new sap.ui.model.Filter("BillingDocument", "EQ", value)
                // })

                // var oFilter = new sap.ui.model.Filter({
                //     filters: aFilters,
                //     and: false
                // });

                if (aTableArr.length > 0) {
                    var aTableArr = [];
                    oTableModel.setProperty("/aTableItem", aTableArr);
                    oModel.read("/YEINVOICE_CDSS", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            oBusyDialog.close();
                            var oNewResponseArr = [];

                            // this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");
                            console.log(oresponse);
                            if (oresponse.results.length > 0) {
                                // oTableModel.setProperty("/aTableItem", oresponse.results);

                                oresponse.results.map(function (items) {

                                    if (items.ShippingType === "01") {
                                        var shippingType = "Road"
                                    } else if (items.ShippingType === "03") {
                                        shippingType = "Rail"
                                    } else if (items.ShippingType === "04") {
                                        shippingType = "Sea"
                                    } else if (items.ShippingType === "05") {
                                        shippingType = "Air"
                                    }

                                    var obj = {
                                        "AckNo": items.AckNo,
                                        "AckDate": items.AckDate,
                                        "IrnStatus": items.IrnStatus,
                                        "Irn": items.Irn,
                                        "Ebillno": items.Ebillno,
                                        "EgenDat": items.EgenDat,
                                        "Status": items.Status,
                                        "BillingDocument": items.BillingDocument,
                                        "BillingDocumentItem": items.BillingDocumentItem,
                                        "BILLTOPARTY": items.BILLTOPARTY,
                                        "CustomerName": items.CustomerName,
                                        "billinggstin": items.billinggstin,
                                        "Region": items.Region,
                                        "CityName": items.CityName,
                                        "PostalCode": items.PostalCode,
                                        "SHIPTONAME": items.SHIPTONAME,
                                        "SHIPTOCITY": items.SHIPTOCITY,
                                        "SHIPTOREGION": items.SHIPTOREGION,
                                        "BillingQuantity": items.BillingQuantity,
                                        "BillingQuantityUnit": items.BillingQuantityUnit,
                                        "Assesmentvalue_inGst": items.Assesmentvalue_inGst,
                                        "Assesmentvalue_inIgst": parseFloat(items.Assesmentvalue_inIgst).toFixed(2),
                                        "TaxAmount": items.TaxAmount,
                                        "PostalCode": items.PostalCode,
                                        "billinggstin": items.billinggstin,
                                        "Material": items.Material,
                                        "MaterialDescription": items.MaterialDescription,
                                        "Hsncode": items.Hsncode,
                                        "BillingQuantityUnit": items.BillingQuantityUnit,
                                        "vehicle_no": items.vehicle_no,
                                        "transportdoc_no": items.transportdoc_no,
                                        "TRANSPORTERNAME": items.TRANSPORTERNAME_new,
                                        "TRANSID": items.TRANSID_new,
                                        "Distance": "0",
                                        "Shippingtype": shippingType
                                    }
                                    aTableArr.push(obj)
                                })

                                oTableModel.setProperty("/aTableItem", aTableArr);

                                if (oresponse.results[0].Assesmentvalue_inGst === "0.000000000") {
                                    oTableModel.setProperty('/buttonVisible', false);
                                }
                            }
                        }.bind(this),
                        error: function () {
                            oBusyDialog.close();
                        }.bind(this),
                    })
                } else {
                    oModel.read("/YEINVOICE_CDSS", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            oBusyDialog.close();
                            var oNewResponseArr = [];

                            // this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");
                            console.log(oresponse);
                            if (oresponse.results.length > 0) {
                                // oTableModel.setProperty("/aTableItem", oresponse.results);

                                oresponse.results.map(function (items) {
                                    if (items.ShippingType === "01") {
                                        var shippingType = "Road"
                                    } else if (items.ShippingType === "03") {
                                        shippingType = "Rail"
                                    } else if (items.ShippingType === "04") {
                                        shippingType = "Sea"
                                    } else if (items.ShippingType === "05") {
                                        shippingType = "Air"
                                    }
                                    var obj = {
                                        "AckNo": items.AckNo,
                                        "AckDate": items.AckDate,
                                        "IrnStatus": items.IrnStatus,
                                        "Irn": items.Irn,
                                        "Ebillno": items.Ebillno,
                                        "EgenDat": items.EgenDat,
                                        "Status": items.Status,
                                        "BillingDocument": items.BillingDocument,
                                        "BillingDocumentItem": items.BillingDocumentItem,
                                        "BILLTOPARTY": items.BILLTOPARTY,
                                        "CustomerName": items.CustomerName,
                                        "billinggstin": items.billinggstin,
                                        "Region": items.Region,
                                        "CityName": items.CityName,
                                        "PostalCode": items.PostalCode,
                                        "SHIPTONAME": items.SHIPTONAME,
                                        "SHIPTOCITY": items.SHIPTOCITY,
                                        "SHIPTOREGION": items.SHIPTOREGION,
                                        "BillingQuantity": items.BillingQuantity,
                                        "BillingQuantityUnit": items.BillingQuantityUnit,
                                        "Assesmentvalue_inGst": items.Assesmentvalue_inGst,
                                        "Assesmentvalue_inIgst": parseFloat(items.Assesmentvalue_inIgst).toFixed(2),
                                        "TaxAmount": items.TaxAmount,
                                        "PostalCode": items.PostalCode,
                                        "billinggstin": items.billinggstin,
                                        "Material": items.Material,
                                        "MaterialDescription": items.MaterialDescription,
                                        "Hsncode": items.Hsncode,
                                        "BillingQuantityUnit": items.BillingQuantityUnit,
                                        "vehicle_no": items.vehicle_no,
                                        "transportdoc_no": items.transportdoc_no,
                                        "TRANSPORTERNAME": items.TRANSPORTERNAME_new,
                                        "TRANSID": items.TRANSID_new,
                                        "Distance": "0",
                                        "Shippingtype": shippingType
                                    }
                                    aTableArr.push(obj)
                                })

                                oTableModel.setProperty("/aTableItem", aTableArr);

                                if (oresponse.results[0].Assesmentvalue_inGst === "0.000000000") {
                                    oTableModel.setProperty('/buttonVisible', false);
                                }
                            }
                        }.bind(this),
                        error: function () {
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }

            },

            generateEwayBillIrn: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var tableModel = oTableModel.getProperty('/aTableItem');

                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel");
                var invoiceValue = oCommonModel.getProperty("/invoiceObject").InvoiceType;
                var documentnumber = oCommonModel.getProperty("/invoiceObject").BillDoc

                var billingdoc = tableModel[0].BillingDocument;
                var eway = tableModel[0].Ebillno;
                var transportname = tableModel[0].TRANSPORTERNAME;
                var transdoc = tableModel[0].transportdoc_no;
                var vehiclenum = tableModel[0].vehicle_no;
                var transid = tableModel[0].TRANSID;
                var distance = tableModel[0].Distance;

                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=6&transportdoc=&transportid=&vehiclenumber=";
                // https://my405122.s4hana.cloud.sap/sap/bc/http/sap/zcl_yeinv_http?sap-client=080
                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?Irn=X";
                var url2 = "&invoice=";
                var url3 = "&transporter=";
                var url4 = "&DISTANCE=";
                var url5 = "&transportdoc=";
                var url6 = "&transportid=";
                var url7 = "&vehiclenumber=";
                var url8 = "&invoiceType="


                var url9 = url2 + billingdoc;
                var url10 = url3 + transportname;
                var url11 = url4 + distance;
                var url12 = url5 + transdoc;
                var url13 = url6 + transid;
                var url14 = url7 + vehiclenum;
                var url15 = url8 + invoiceValue;


                var url = url1 + url9 + url10 + url11 + url12 + url13 + url14 + url15;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {

                        console.log(result)
                        oBusyDialog.close();
                        MessageBox.show(result, {
                            title: "Message",
                            emphasizedAction: MessageBox.Action.YES
                        });

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                });


            },

            generateIRN: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Generating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var tableModel = oTableModel.getProperty('/aTableItem');


                var billingdoc = tableModel[0].BillingDocument;
                var eway = tableModel[0].Ebillno;
                var transportname = tableModel[0].TRANSPORTERNAME;
                var transdoc = tableModel[0].TransDocNo;
                var vehiclenum = tableModel[0].VEHICLENUMBER;
                var transid = tableModel[0].TRANSID;
                var distance = tableModel[0].Distance;

                // url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600";
                // https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600&transportdoc=&transportid=&vehiclenumber=
                var irn = "x";

                var url1 = "/sap/bc/http/sap/yeinv_http?Irn=X";
                var url2 = "&eway=";
                var url3 = "&invoice=";
                var url4 = "&transporter=";
                var url5 = "&DISTANCE=";
                var url6 = "&transportdoc=";
                var url7 = "&transportid=";
                var url8 = "&vehiclenumber=";


                var url8 = url2 + eway;
                var url9 = url3 + billingdoc;
                var url10 = url4 + transportname;
                var url11 = url5 + distance;
                var url12 = url6 + transdoc;
                var url13 = url7 + transid;
                var url14 = url8 + vehiclenum;



                var url = url1 + url8 + url9 + url10 + url11 + url12 + url13 + url14;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {

                        console.log(result)
                        oBusyDialog.close();
                        MessageBox.show(result, {
                            title: "Message",
                            emphasizedAction: MessageBox.Action.YES
                        });

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                });

            },

            generateEwayBill: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Generating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var tableModel = oTableModel.getProperty('/aTableItem');

                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel");
                var invoiceValue = oCommonModel.getProperty("/invoiceObject").InvoiceType;


                var billingdoc = tableModel[0].BillingDocument;
                var eway = tableModel[0].Ebillno;
                var transportname = tableModel[0].TRANSPORTERNAME;
                var transdoc = tableModel[0].transportdoc_no;
                var vehiclenum = tableModel[0].vehicle_no;
                var transid = tableModel[0].TRANSID;
                var distance = tableModel[0].Distance;

                // url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600";
                // https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600&transportdoc=&transportid=&vehiclenumber=
                var irn = "x";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?Eway=X";
                var url2 = "&eway=";
                var url3 = "&invoice=";
                var url4 = "&transporter=";
                var url5 = "&DISTANCE=";
                var url6 = "&transportdoc=";
                var url7 = "&transportid=";
                var url8 = "&vehiclenumber=";
                var url9 = "&invoiceType="


                var url10 = url2 + eway;
                var url11 = url3 + billingdoc;
                var url12 = url4 + transportname;
                var url13 = url5 + distance;
                var url14 = url6 + transdoc;
                var url15 = url7 + transid;
                var url16 = url8 + vehiclenum;
                var url17 = url9 + invoiceValue;



                var url = url1 + url10 + url11 + url12 + url13 + url14 + url15 + url16 + url17;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {

                        console.log(result)
                        oBusyDialog.close();
                        MessageBox.show(result, {
                            title: "Message",
                            emphasizedAction: MessageBox.Action.YES
                        });

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                });

            },

            onGet: function () {
                var oTableModel = this.getView().getModel('oTableItemModel');
                var tableModel = oTableModel.getProperty('/aTableItem');
                console.log(tableModel);

                var billingdoc = tableModel[0].BillingDocument;
                var transportname = tableModel[0].TRANSPORTERNAME;
                var transdoc = tableModel[0].TransDocNo;
                var vehiclenum = tableModel[0].VEHICLENUMBER;
                var transid = tableModel[0].TRANSID;

                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=X&transporterid=X";
                var url1 = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?";
                var url2 = "Irn=X";
                var url3 = "&eway=X";
                var url4 = "&invoice=";
                var url5 = "&transporter=";
                var url6 = "&transporterid=";

                var url7 = url4 + billingdoc;
                var url8 = url5 + transportname;
                var url9 = url6 + transid;

                var url = url1 + url2 + url3 + url7 + url8 + url9;
            }

        });
    }
);
