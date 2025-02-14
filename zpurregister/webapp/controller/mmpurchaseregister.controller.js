sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/ui/core/date/UI5Date",
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    'sap/m/Token',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/core/UIComponent",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, library, UI5Date, Filter, JSONModel, Token, FilterOperator, Fragment, MessageToast, MessageBox, Spreadsheet, Export, ExportTypeCSV) {
        "use strict";

        return Controller.extend("zpurregister.controller.mmpurchaseregister", {
            onInit: function () {
                var oBusy = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusy.open();
                var rowCountObj = {
                    "aRowCountData": 0,
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(rowCountObj), "oRowCountModel");
                var fnValidator1 = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                this.getView().byId("CompanyCode").addValidator(fnValidator1);

                var fnValidator2 = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                this.getView().byId("Matdesc").addValidator(fnValidator2);

                var fnValidator3 = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                this.getView().byId("Supplier").addValidator(fnValidator3);

                var fnValidator4 = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                this.getView().byId("Plant").addValidator(fnValidator4);

                var fnValidator5 = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                this.getView().byId("Material").addValidator(fnValidator5);
                var fnValidator6 = function (args) {
                    var text = args.text;
                    return new Token({ key: text, text: text });
                };
                this.getView().byId("PurchaseOrder").addValidator(fnValidator6);
                var fnValidator7 = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                this.getView().byId("AccountAssignmentCategory").addValidator(fnValidator7);

                var object = {
                    "ExcelFileName": "Purchase Register Report"
                }
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(object), "oExcelFileNameModel")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oGenericModel");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel")
                this.getView().getModel("oTableItemModel").setProperty("/aTableItem", [])

                this.onReadValueHelpData("PlantValueHelp")
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEARCHHELP")
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oSupplierModel");
                oModel.read("/SUPPLIER_DATA", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oSupplierModel").setProperty("/aSupplierData", oresponse.results);
                    }.bind(this)
                })

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEARCHHELP")
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oCompanyCodeModel");
                oModel.read("/companycode", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oCompanyCodeModel").setProperty("/aCompanyCodeData", oresponse.results);
                    }.bind(this)
                })

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEARCHHELP")
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oMaterialModel");
                oModel.read("/Materialgroup", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oMaterialModel").setProperty("/aMaterialData", oresponse.results);
                    }.bind(this)
                })

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEARCHHELP")
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oPlantModel");
                oModel.read("/plant_data", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oPlantModel").setProperty("/aPlantData", oresponse.results);
                    }.bind(this)
                })

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSEARCHHELP")
                this.getView().setModel(new sap.ui.model.json.JSONModel, "oPurchaseOrderModel");
                oModel.read("/purchase_order_data", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oPurchaseOrderModel").setProperty("/aPurchaseOrderData", oresponse.results);
                        oBusy.close();
                    }.bind(this)
                })
            },

            onReadValueHelpData: function (sTypeName) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_PURCHASE_REGISTER_BIN")

                var sPath = "";
                var oGenericModel = this.getView().getModel("oGenericModel");
                if (sTypeName === 'PlantValueHelp') {
                    sPath = "/pur_reg";
                    oModel.read(sPath, {
                        async: true,
                        urlParameters: {
                            "$top": "5000"
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
                    sPath = "/Zmm_dl_PJ0";
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


            GetTableData_1: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Fetching"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_PURCHASE_REGISTER_BIN")
                var oTableModel = this.getView().getModel("oTableItemModel")
                // var aTableArr = oTableModel.getProperty("/aTableItem")
                var aTableArr = [];


                var Supplier = this.getView().byId("Supplier").getTokens().map(function (oToken) {
                    return oToken.getText();
                });;
                var CompanyCode = this.getView().byId("CompanyCode").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PurchaseOrder = this.getView().byId("PurchaseOrder").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Matdesc = this.getView().byId("Matdesc").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Plant = this.getView().byId("Plant").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Material = this.getView().byId("Material").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PODate = this.getView().byId("PODate").getValue();
                var GrnDate = this.getView().byId("GrnDate").getValue();
                var MiroDate = this.getView().byId("MiroDate").getValue();
                var AccountAssignmentCategory = this.getView().byId("AccountAssignmentCategory").getValue();
                var aFilters_aNewArr = [];
                if (CompanyCode.length != 0 || MiroDate != "" || Supplier.length != 0 || PurchaseOrder.length != 0 || Matdesc.length != 0 || Plant.length != 0 || PODate != "" || Material.length != 0 || GrnDate != "" || AccountAssignmentCategory.length != 0) {
                    if (CompanyCode.length != 0) {
                        CompanyCode.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("companycode", "EQ", item))
                        })
                    }
                    if (MiroDate != "") {
                        var FromMiroDate = MiroDate.split(" - ")[0];
                        var ToMiroDate = MiroDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "invoice_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromMiroDate,
                            value2: ToMiroDate
                        }))
                    }
                    if (AccountAssignmentCategory.length != 0) {
                        AccountAssignmentCategory.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("AccountAssignmentCategory", "EQ", item))
                        })
                    }
                    if (Supplier.length != 0) {
                        Supplier.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("supplier", "EQ", item))
                        })
                    }
                    if (PurchaseOrder.length != 0) {
                        PurchaseOrder.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorder", "EQ", item))
                        })
                    }
                    if (Matdesc.length != 0) {
                        Matdesc.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderitemtext", "EQ", item))
                        })
                    }
                    if (Plant.length != 0) {
                        Plant.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("plant", "EQ", item))
                        })
                    }
                    if (PODate != "") {
                        aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderdate", "EQ", PODate))
                    }
                    if (Material.length != 0) {
                        Material.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("material", "EQ", item))
                        })
                    }
                    if (GrnDate != "") {
                        var FromGrnDate = GrnDate.split(" - ")[0];
                        var ToGrnDate = GrnDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "grn_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromGrnDate,
                            value2: ToGrnDate
                        }))
                        // aFilters_aNewArr.push(new sap.ui.model.Filter("grn_postingdate", "EQ", GrnDate))
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel")
                    oModel.read("/pur_reg", {
                        filters: [aFilters_aNewArr],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
                                var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                var obj = {
                                    "purchaseorder": items.purchaseorder,
                                    "purchaseordertype": items.purchaseordertype,
                                    "createdbyuser": items.createdbyuser,
                                    "creationdate": creationDate,
                                    "purchaseorderdate": purchaseOrderDate,
                                    "companycode": items.companycode,
                                    "purchasinggroup": items.purchasinggroup,
                                    "purchasingorganization": items.purchasingorganization,
                                    "supplier": items.supplier,
                                    "purchaseorderitem": items.purchaseorderitem,
                                    "materialgroup": items.materialgroup,
                                    "productgrouptext": items.ProductGroupText,
                                    "material": items.material,
                                    "br_ncm": items.br_ncm,
                                    "grossamount": items.grossamount,
                                    "netamount": items.netamount,
                                    "netpriceamount": items.netpriceamount,
                                    "plant": items.plant,
                                    "orderquantity": items.orderquantity,
                                    "baseunit": items.BaseUnit,
                                    "purchaserequisition": items.purchaserequisition,
                                    "purchasecontract": items.purchasecontract,
                                    "purchasecontractitem": items.purchasecontractitem,
                                    "purchaseorderitemtext": items.purchaseorderitemtext,
                                    "grn_document": items.grn_document,
                                    "grn_documentyear": items.grn_documentyear,
                                    "grn_qty": items.grn_qty,
                                    "grn_amount": items.grn_amount,
                                    "grn_amountnew": items.grn_amountnew,
                                    "Other_charge": items.Other_charge,
                                    "gl_account": items.gl_account,
                                    "freight_amt": items.freight_amt,
                                    "grn_documentdate": grnDocumentDate,
                                    "storagelocation": items.storagelocation,
                                    "grn_postingdate": grnPostingDate,
                                    "grn_billoflading": items.grn_billoflading,
                                    "invoice_postingdate": invoicePostingDate,
                                    "invoice_documentdate": invoiceDocumentDate,
                                    "invoice_quantity": items.invoice_quantity,
                                    "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                    "invoice_no": items.invoice_no,
                                    "grn_referencedocument": items.grn_referencedocument,
                                    "grn_createdby": items.grn_createdby,
                                    "batch": items.batch,
                                    "invoice_amount": items.invoice_amount,
                                    "igst": items.igst,
                                    "cgst": items.cgst,
                                    "sgst": items.sgst,
                                    "ProductGroupName": items.ProductGroupName,
                                    "taxcode": items.taxcode,
                                    "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                    "supplier_name": items.supplier_name,
                                    "supplier_gstin": items.supplier_gstin,
                                    "park_post": items.park_post,
                                    "tdsamount": items.tdsamount,
                                    "businessplace": items.businessplace,
                                    "un_planned": items.un_planned,
                                }
                                aTableArr.push(obj)
                            })
                            oTableModel.setProperty("/aTableItem", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }
                else {
                    this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel")
                    oModel.read("/pur_reg", {
                        // filters: [aFilters_aNewArr],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            oBusyDialog.close();
                            oresponse.results.map(function (items) {
                                var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                var obj = {
                                    "purchaseorder": items.purchaseorder,
                                    "purchaseordertype": items.purchaseordertype,
                                    "createdbyuser": items.createdbyuser,
                                    "creationdate": creationDate,
                                    "purchaseorderdate": purchaseOrderDate,
                                    "companycode": items.companycode,
                                    "purchasinggroup": items.purchasinggroup,
                                    "purchasingorganization": items.purchasingorganization,
                                    "supplier": items.supplier,
                                    "purchaseorderitem": items.purchaseorderitem,
                                    "materialgroup": items.materialgroup,
                                    "productgrouptext": items.ProductGroupText,
                                    "material": items.material,
                                    "br_ncm": items.br_ncm,
                                    "grossamount": items.grossamount,
                                    "netamount": items.netamount,
                                    "netpriceamount": items.netpriceamount,
                                    "plant": items.plant,
                                    "orderquantity": items.orderquantity,
                                    "baseunit": items.BaseUnit,
                                    "purchaserequisition": items.purchaserequisition,
                                    "purchasecontract": items.purchasecontract,
                                    "purchasecontractitem": items.purchasecontractitem,
                                    "purchaseorderitemtext": items.purchaseorderitemtext,
                                    "grn_document": items.grn_document,
                                    "grn_documentyear": items.grn_documentyear,
                                    "grn_qty": items.grn_qty,
                                    "grn_amount": items.grn_amount,
                                    "grn_amountnew": items.grn_amountnew,
                                    "Other_charge": items.Other_charge,
                                    "gl_account": items.gl_account,
                                    "freight_amt": items.freight_amt,
                                    "grn_documentdate": grnDocumentDate,
                                    "storagelocation": items.storagelocation,
                                    "grn_postingdate": grnPostingDate,
                                    "grn_billoflading": items.grn_billoflading,
                                    "invoice_postingdate": invoicePostingDate,
                                    "invoice_documentdate": invoiceDocumentDate,
                                    "invoice_quantity": items.invoice_quantity,
                                    "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                    "invoice_no": items.invoice_no,
                                    "grn_referencedocument": items.grn_referencedocument,
                                    "grn_createdby": items.grn_createdby,
                                    "batch": items.batch,
                                    "invoice_amount": items.invoice_amount,
                                    "igst": items.igst,
                                    "cgst": items.cgst,
                                    "sgst": items.sgst,
                                    "ProductGroupName": items.ProductGroupName,
                                    "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                    "taxcode": items.taxcode,
                                    "supplier_name": items.supplier_name,
                                    "supplier_gstin": items.supplier_gstin,
                                    "park_post": items.park_post,
                                    "tdsamount": items.tdsamount,
                                    "businessplace": items.businessplace,
                                    "un_planned": items.un_planned,

                                }
                                aTableArr.push(obj)
                            })
                            oTableModel.setProperty("/aTableItem", aTableArr)
                            oBusyDialog.close();
                        }.bind(this)
                    })
                }




            },

            GetTableData22: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Fetching"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_PURCHASE_REGISTER_BIN")
                var oTableModel = this.getView().getModel("oTableItemModel")
                var oRowCountModel = this.getView().getModel("oRowCountModel")
                oTableModel.setProperty("/aTableItem",[])
                var aTableArr = [];
                var top = 5000;
                var skip = 0;
                var aNewArr = [];

                var Supplier = this.getView().byId("Supplier").getTokens().map(function (oToken) {
                    return oToken.getText();
                });;
                var CompanyCode = this.getView().byId("CompanyCode").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PurchaseOrder = this.getView().byId("PurchaseOrder").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Matdesc = this.getView().byId("Matdesc").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Plant = this.getView().byId("Plant").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Material = this.getView().byId("Material").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                
                var AccountAssignmentCategory = this.getView().byId("AccountAssignmentCategory").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PODate = this.getView().byId("PODate").getValue();
                var GrnDate = this.getView().byId("GrnDate").getValue();
                var MiroDate = this.getView().byId("MiroDate").getValue();
                // var AccountAssignmentCategory = this.getView().byId("AccountAssignmentCategory").getTokens();
                var aFilters_aNewArr = [];
                if (CompanyCode.length != 0 || MiroDate != "" || Supplier.length != 0 || PurchaseOrder.length != 0 || Matdesc.length != 0 || Plant.length != 0 || PODate != "" || Material.length != 0 || GrnDate != "" || AccountAssignmentCategory.length != 0) {
                    if (CompanyCode.length != 0) {
                        CompanyCode.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("companycode", "EQ", item))
                        })
                    }
                    if (MiroDate != "") {
                        var FromMiroDate = MiroDate.split(" - ")[0];
                        var ToMiroDate = MiroDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "invoice_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromMiroDate,
                            value2: ToMiroDate
                        }))
                    }
                    if (AccountAssignmentCategory.length != 0) {
                        AccountAssignmentCategory.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("AccountAssignmentCategory", "EQ", item))
                        })
                    }
                    if (Supplier.length != 0) {
                        Supplier.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("supplier", "EQ", item))
                        })
                    }
                    if (PurchaseOrder.length != 0) {
                        PurchaseOrder.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorder", "EQ", item))
                        })
                    }
                    if (Matdesc.length != 0) {
                        Matdesc.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderitemtext", "EQ", item))
                        })
                    }
                    if (Plant.length != 0) {
                        Plant.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("plant", "EQ", item))
                        })
                    }
                    if (PODate != "") {
                        aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderdate", "EQ", PODate))
                    }
                    if (Material.length != 0) {
                        Material.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("material", "EQ", item))
                        })
                    }
                    if (GrnDate != "") {
                        var FromGrnDate = GrnDate.split(" - ")[0];
                        var ToGrnDate = GrnDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "grn_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromGrnDate,
                            value2: ToGrnDate
                        }))
                        // aFilters_aNewArr.push(new sap.ui.model.Filter("grn_postingdate", "EQ", GrnDate))
                    }
                    function readData(skip) {
                        oModel.read("/pur_reg", {
                            filters: [aFilters_aNewArr],
                            urlParameters: {
                                "$top": "5000",
                                "$skip": skip
                            },
                            success: function (oData, response) {
                                var lastValue = 0;
                                if (oData.results.length > 0) {
                                    lastValue = oData.results[0].tottal_data;
                                } else {
                                    lastValue = skip;
                                }
                                if (skip < lastValue) {
                                    oData.results.map(function (items) {
                                        var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                        var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                        var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                        var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                        var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                        var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                        var obj = {
                                            "purchaseorder": items.purchaseorder,
                                            "purchaseordertype": items.purchaseordertype,
                                            "createdbyuser": items.createdbyuser,
                                            "creationdate": creationDate,
                                            "purchaseorderdate": purchaseOrderDate,
                                            "companycode": items.companycode,
                                            "purchasinggroup": items.purchasinggroup,
                                            "purchasingorganization": items.purchasingorganization,
                                            "supplier": items.supplier,
                                            "purchaseorderitem": items.purchaseorderitem,
                                            "materialgroup": items.materialgroup,
                                            "productgrouptext": items.ProductGroupText,
                                            "material": items.material,
                                            "br_ncm": items.br_ncm,
                                            "grossamount": items.grossamount,
                                            "netamount": items.netamount,
                                            "netpriceamount": items.netpriceamount,
                                            "plant": items.plant,
                                            "orderquantity": items.orderquantity,
                                            "baseunit": items.BaseUnit,
                                            "purchaserequisition": items.purchaserequisition,
                                            "purchasecontract": items.purchasecontract,
                                            "purchasecontractitem": items.purchasecontractitem,
                                            "purchaseorderitemtext": items.purchaseorderitemtext,
                                            "grn_document": items.grn_document,
                                            "grn_documentyear": items.grn_documentyear,
                                            "grn_qty": items.grn_qty,
                                            "grn_amount": items.grn_amount,
                                            "grn_amountnew": items.grn_amountnew,
                                            "Other_charge": items.Other_charge,
                                            "gl_account": items.gl_account,
                                            "freight_amt": items.freight_amt,
                                            "grn_documentdate": grnDocumentDate,
                                            "storagelocation": items.storagelocation,
                                            "grn_postingdate": grnPostingDate,
                                            "grn_billoflading": items.grn_billoflading,
                                            "invoice_postingdate": invoicePostingDate,
                                            "invoice_documentdate": invoiceDocumentDate,
                                            "invoice_quantity": items.invoice_quantity,
                                            "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                            "invoice_no": items.invoice_no,
                                            "grn_referencedocument": items.grn_referencedocument,
                                            "grn_createdby": items.grn_createdby,
                                            "batch": items.batch,
                                            "invoice_amount": items.invoice_amount,
                                            "igst": items.igst,
                                            "cgst": items.cgst,
                                            "sgst": items.sgst,
                                            "ProductGroupName": items.ProductGroupName,
                                            "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                            "taxcode": items.taxcode,
                                            "supplier_name": items.supplier_name,
                                            "supplier_gstin": items.supplier_gstin,
                                            "park_post": items.park_post,
                                            "tdsamount": items.tdsamount,
                                            "businessplace": items.businessplace,
                                            "un_planned": items.un_planned,

                                        }
                                        aTableArr.push(obj)
                                    })
                                    readData(skip + 5000);
                                } else {
                                    oTableModel.setProperty("/aTableItem", aTableArr);
                                    oRowCountModel.setProperty("/aRowCountData", aTableArr.length);
                                    oBusyDialog.close();
                                }
                            },
                            error: function (error) {
                                console.error("Error reading data:", error);
                            }
                        });
                    }
                    readData(skip);
                }
                else {
                    function readData(skip) {
                        oModel.read("/pur_reg", {
                            urlParameters: {
                                "$top": "5000",
                                "$skip": skip
                            },
                            success: function (oData, response) {
                                var lastValue = 0;
                                if (oData.results.length > 0) {
                                    lastValue = oData.results[0].tottal_data;
                                } else {
                                    lastValue = skip;
                                }
                                if (skip < lastValue) {
                                    oData.results.map(function (items) {
                                        var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                        var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                        var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                        var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                        var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                        var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                        var obj = {
                                            "purchaseorder": items.purchaseorder,
                                            "purchaseordertype": items.purchaseordertype,
                                            "createdbyuser": items.createdbyuser,
                                            "creationdate": creationDate,
                                            "purchaseorderdate": purchaseOrderDate,
                                            "companycode": items.companycode,
                                            "purchasinggroup": items.purchasinggroup,
                                            "purchasingorganization": items.purchasingorganization,
                                            "supplier": items.supplier,
                                            "purchaseorderitem": items.purchaseorderitem,
                                            "materialgroup": items.materialgroup,
                                            "productgrouptext": items.ProductGroupText,
                                            "material": items.material,
                                            "br_ncm": items.br_ncm,
                                            "grossamount": items.grossamount,
                                            "netamount": items.netamount,
                                            "netpriceamount": items.netpriceamount,
                                            "plant": items.plant,
                                            "orderquantity": items.orderquantity,
                                            "baseunit": items.BaseUnit,
                                            "purchaserequisition": items.purchaserequisition,
                                            "purchasecontract": items.purchasecontract,
                                            "purchasecontractitem": items.purchasecontractitem,
                                            "purchaseorderitemtext": items.purchaseorderitemtext,
                                            "grn_document": items.grn_document,
                                            "grn_documentyear": items.grn_documentyear,
                                            "grn_qty": items.grn_qty,
                                            "grn_amount": items.grn_amount,
                                            "grn_amountnew": items.grn_amountnew,
                                            "Other_charge": items.Other_charge,
                                            "gl_account": items.gl_account,
                                            "freight_amt": items.freight_amt,
                                            "grn_documentdate": grnDocumentDate,
                                            "storagelocation": items.storagelocation,
                                            "grn_postingdate": grnPostingDate,
                                            "grn_billoflading": items.grn_billoflading,
                                            "invoice_postingdate": invoicePostingDate,
                                            "invoice_documentdate": invoiceDocumentDate,
                                            "invoice_quantity": items.invoice_quantity,
                                            "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                            "invoice_no": items.invoice_no,
                                            "grn_referencedocument": items.grn_referencedocument,
                                            "grn_createdby": items.grn_createdby,
                                            "batch": items.batch,
                                            "invoice_amount": items.invoice_amount,
                                            "igst": items.igst,
                                            "cgst": items.cgst,
                                            "sgst": items.sgst,
                                            "ProductGroupName": items.ProductGroupName,
                                            "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                            "taxcode": items.taxcode,
                                            "supplier_name": items.supplier_name,
                                            "supplier_gstin": items.supplier_gstin,
                                            "park_post": items.park_post,
                                            "tdsamount": items.tdsamount,
                                            "businessplace": items.businessplace,
                                            "un_planned": items.un_planned,

                                        }
                                        aTableArr.push(obj)
                                    })
                                    readData(skip + 5000);
                                } else {
                                    oTableModel.setProperty("/aTableItem", aTableArr);
                                    oRowCountModel.setProperty("/aRowCountData", aTableArr.length);
                                    oBusyDialog.close();
                                }
                            },
                            error: function (error) {
                                console.error("Error reading data:", error);
                            }
                        });
                    }
                    readData(skip);
                }
            },

            GetTableData_running: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Fetching"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_PURCHASE_REGISTER_BIN")
                var oTableModel = this.getView().getModel("oTableItemModel")
                var oRowCountModel = this.getView().getModel("oRowCountModel")
                oTableModel.setProperty("/aTableItem",[])
                var aTableArr = [];
                var top = 5000;
                var skip = 0;
                var aNewArr = [];

                var Supplier = this.getView().byId("Supplier").getTokens().map(function (oToken) {
                    return oToken.getText();
                });;
                var CompanyCode = this.getView().byId("CompanyCode").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PurchaseOrder = this.getView().byId("PurchaseOrder").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Matdesc = this.getView().byId("Matdesc").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Plant = this.getView().byId("Plant").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Material = this.getView().byId("Material").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                
                var AccountAssignmentCategory = this.getView().byId("AccountAssignmentCategory").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PODate = this.getView().byId("PODate").getValue();
                var GrnDate = this.getView().byId("GrnDate").getValue();
                var MiroDate = this.getView().byId("MiroDate").getValue();
                // var AccountAssignmentCategory = this.getView().byId("AccountAssignmentCategory").getTokens();
                var aFilters_aNewArr = [];
                if (CompanyCode.length != 0 || MiroDate != "" || Supplier.length != 0 || PurchaseOrder.length != 0 || Matdesc.length != 0 || Plant.length != 0 || PODate != "" || Material.length != 0 || GrnDate != "" || AccountAssignmentCategory.length != 0) {
                    if (CompanyCode.length != 0) {
                        CompanyCode.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("companycode", "EQ", item))
                        })
                    }
                    if (MiroDate != "") {
                        var FromMiroDate = MiroDate.split(" - ")[0];
                        var ToMiroDate = MiroDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "invoice_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromMiroDate,
                            value2: ToMiroDate
                        }))
                    }
                    if (AccountAssignmentCategory.length != 0) {
                        AccountAssignmentCategory.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("AccountAssignmentCategory", "EQ", item))
                        })
                    }
                    if (Supplier.length != 0) {
                        Supplier.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("supplier", "EQ", item))
                        })
                    }
                    if (PurchaseOrder.length != 0) {
                        PurchaseOrder.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorder", "EQ", item))
                        })
                    }
                    if (Matdesc.length != 0) {
                        Matdesc.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderitemtext", "EQ", item))
                        })
                    }
                    if (Plant.length != 0) {
                        Plant.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("plant", "EQ", item))
                        })
                    }
                    if (PODate != "") {
                        aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderdate", "EQ", PODate))
                    }
                    if (Material.length != 0) {
                        Material.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("material", "EQ", item))
                        })
                    }
                    if (GrnDate != "") {
                        var FromGrnDate = GrnDate.split(" - ")[0];
                        var ToGrnDate = GrnDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "grn_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromGrnDate,
                            value2: ToGrnDate
                        }))
                        // aFilters_aNewArr.push(new sap.ui.model.Filter("grn_postingdate", "EQ", GrnDate))
                    }
                    function readData(skip) {
                        oModel.read("/pur_reg", {
                            filters: [aFilters_aNewArr],
                            urlParameters: {
                                "$top": "5000",
                                "$skip": skip
                            },
                            success: function (oData, response) {
                                var lastValue = 0;
                                if (oData.results.length > 0) {
                                    lastValue = oData.results[0].tottal_data;
                                } else {
                                    lastValue = skip;
                                }
                                if (skip < lastValue) {
                                    oData.results.map(function (items) {
                                        var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                        var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                        var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                        var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                        var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                        var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                        var obj = {
                                            "purchaseorder": items.purchaseorder,
                                            "purchaseordertype": items.purchaseordertype,
                                            "createdbyuser": items.createdbyuser,
                                            "creationdate": creationDate,
                                            "purchaseorderdate": purchaseOrderDate,
                                            "companycode": items.companycode,
                                            "purchasinggroup": items.purchasinggroup,
                                            "purchasingorganization": items.purchasingorganization,
                                            "supplier": items.supplier,
                                            "purchaseorderitem": items.purchaseorderitem,
                                            "materialgroup": items.materialgroup,
                                            "productgrouptext": items.ProductGroupText,
                                            "material": items.material,
                                            "br_ncm": items.br_ncm,
                                            "grossamount": items.grossamount,
                                            "netamount": items.netamount,
                                            "netpriceamount": items.netpriceamount,
                                            "plant": items.plant,
                                            "orderquantity": items.orderquantity,
                                            "baseunit": items.BaseUnit,
                                            "purchaserequisition": items.purchaserequisition,
                                            "purchasecontract": items.purchasecontract,
                                            "purchasecontractitem": items.purchasecontractitem,
                                            "purchaseorderitemtext": items.purchaseorderitemtext,
                                            "grn_document": items.grn_document,
                                            "grn_documentyear": items.grn_documentyear,
                                            "grn_qty": items.grn_qty,
                                            "grn_amount": items.grn_amount,
                                            "grn_amountnew": items.grn_amountnew,
                                            "Other_charge": items.Other_charge,
                                            "gl_account": items.gl_account,
                                            "freight_amt": items.freight_amt,
                                            "grn_documentdate": grnDocumentDate,
                                            "storagelocation": items.storagelocation,
                                            "grn_postingdate": grnPostingDate,
                                            "grn_billoflading": items.grn_billoflading,
                                            "invoice_postingdate": invoicePostingDate,
                                            "invoice_documentdate": invoiceDocumentDate,
                                            "invoice_quantity": items.invoice_quantity,
                                            "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                            "invoice_no": items.invoice_no,
                                            "grn_referencedocument": items.grn_referencedocument,
                                            "grn_createdby": items.grn_createdby,
                                            "batch": items.batch,
                                            "invoice_amount": items.invoice_amount,
                                            "igst": items.igst,
                                            "cgst": items.cgst,
                                            "sgst": items.sgst,
                                            "ProductGroupName": items.ProductGroupName,
                                            "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                            "taxcode": items.taxcode,
                                            "supplier_name": items.supplier_name,
                                            "supplier_gstin": items.supplier_gstin,
                                            "park_post": items.park_post,
                                            "tdsamount": items.tdsamount,
                                            "businessplace": items.businessplace,
                                            "un_planned": items.un_planned,
                                            "GLAccountName": items.GLAccountName,
                                            "accountingdocument": items.accountingdocument,
                                            "WBSElementInternalID_2": items.WBSElementInternalID_2,
                                            "ProjectElementDescription": items.ProjectElementDescription,
                                            "MaterialDocumentHeaderText": items.MaterialDocumentHeaderText,
                                            "TotalInvoiceAMT":items.TOTAL_SUM,



                                        }
                                        aTableArr.push(obj)
                                    })
                                    readData(skip + 5000);
                                } else {
                                    oTableModel.setProperty("/aTableItem", aTableArr);
                                    oRowCountModel.setProperty("/aRowCountData", aTableArr.length);
                                    oBusyDialog.close();
                                }
                            },
                            error: function (error) {
                                console.error("Error reading data:", error);
                            }
                        });
                    }
                    readData(skip);
                }
                else {
                    function readData(skip) {
                        oModel.read("/pur_reg", {
                            urlParameters: {
                                "$top": "5000",
                                "$skip": skip
                            },
                            success: function (oData, response) {
                                var lastValue = 0;
                                if (oData.results.length > 0) {
                                    lastValue = oData.results[0].tottal_data;
                                } else {
                                    lastValue = skip;
                                }
                                if (skip < lastValue) {
                                    oData.results.map(function (items) {
                                        var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                        var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                        var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                        var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                        var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                        var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                        var obj = {
                                            "purchaseorder": items.purchaseorder,
                                            "purchaseordertype": items.purchaseordertype,
                                            "createdbyuser": items.createdbyuser,
                                            "creationdate": creationDate,
                                            "purchaseorderdate": purchaseOrderDate,
                                            "companycode": items.companycode,
                                            "purchasinggroup": items.purchasinggroup,
                                            "purchasingorganization": items.purchasingorganization,
                                            "supplier": items.supplier,
                                            "purchaseorderitem": items.purchaseorderitem,
                                            "materialgroup": items.materialgroup,
                                            "productgrouptext": items.ProductGroupText,
                                            "material": items.material,
                                            "br_ncm": items.br_ncm,
                                            "grossamount": items.grossamount,
                                            "netamount": items.netamount,
                                            "netpriceamount": items.netpriceamount,
                                            "plant": items.plant,
                                            "orderquantity": items.orderquantity,
                                            "baseunit": items.BaseUnit,
                                            "purchaserequisition": items.purchaserequisition,
                                            "purchasecontract": items.purchasecontract,
                                            "purchasecontractitem": items.purchasecontractitem,
                                            "purchaseorderitemtext": items.purchaseorderitemtext,
                                            "grn_document": items.grn_document,
                                            "grn_documentyear": items.grn_documentyear,
                                            "grn_qty": items.grn_qty,
                                            "grn_amount": items.grn_amount,
                                            "grn_amountnew": items.grn_amountnew,
                                            "Other_charge": items.Other_charge,
                                            "gl_account": items.gl_account,
                                            "freight_amt": items.freight_amt,
                                            "grn_documentdate": grnDocumentDate,
                                            "storagelocation": items.storagelocation,
                                            "grn_postingdate": grnPostingDate,
                                            "grn_billoflading": items.grn_billoflading,
                                            "invoice_postingdate": invoicePostingDate,
                                            "invoice_documentdate": invoiceDocumentDate,
                                            "invoice_quantity": items.invoice_quantity,
                                            "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                            "invoice_no": items.invoice_no,
                                            "grn_referencedocument": items.grn_referencedocument,
                                            "grn_createdby": items.grn_createdby,
                                            "batch": items.batch,
                                            "invoice_amount": items.invoice_amount,
                                            "igst": items.igst,
                                            "cgst": items.cgst,
                                            "sgst": items.sgst,
                                            "ProductGroupName": items.ProductGroupName,
                                            "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                            "taxcode": items.taxcode,
                                            "supplier_name": items.supplier_name,
                                            "supplier_gstin": items.supplier_gstin,
                                            "park_post": items.park_post,
                                            "tdsamount": items.tdsamount,
                                            "businessplace": items.businessplace,
                                            "un_planned": items.un_planned,
                                            "GLAccountName": items.GLAccountName,
                                            "accountingdocument": items.accountingdocument,
                                            "WBSElementInternalID_2": items.WBSElementInternalID_2,
                                            "ProjectElementDescription": items.ProjectElementDescription,
                                            "MaterialDocumentHeaderText": items.MaterialDocumentHeaderText,
                                            "TotalInvoiceAMT":items.TOTAL_SUM,




                                        }
                                        aTableArr.push(obj)
                                    })
                                    readData(skip + 5000);
                                } else {
                                    oTableModel.setProperty("/aTableItem", aTableArr);
                                    oRowCountModel.setProperty("/aRowCountData", aTableArr.length);
                                    oBusyDialog.close();
                                }
                            },
                            error: function (error) {
                                console.error("Error reading data:", error);
                            }
                        });
                    }
                    readData(skip);
                }
            },




            GetTableLength: function(){
                var aTableArr = this.getView().getModel("oTableItemModel").getProperty("/aTableItem")
                var obj = {
                    "aRowCountData": aTableArr.length,
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "oRowCountModel");
            },







            calculateTotal: function () {
                var TableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = TableModel.getProperty("/aTableItem");
                var aNewArr = [];
                var totalAmount = 0

                aTableArr.map(function (items) {
                    aNewArr.push(Number(items.grossamount))
                })

                aNewArr.map(function (items) {
                    totalAmount += items
                })

                var obj = {
                    "purchaseorder": "",
                    "purchaseordertype": "",
                    "creationdate": "",
                    "purchaseorderdate": "",
                    "companycode": "",
                    "purchasinggroup": "",
                    "purchasingorganization": "",
                    "supplier": "",
                    "purchaseorderitem": "",
                    "materialgroup": "",
                    "material": "",
                    "orderpriceunit": "",
                    "br_ncm": "",
                    "grossamount": parseFloat(totalAmount).toFixed(2),
                    "netamount": "",
                    "netpriceamount": "",
                    "plant": "",
                    "orderquantity": "",
                    "purchaserequisition": "",
                    "purchasecontract": "",
                    "purchasecontractitem": "",
                    "purchaseorderitemtext": "",
                    "grn_document": "",
                    "grn_documentyear": "",
                    "grn_qty": "",
                    "grn_amount": "",
                    "grn_amountnew": "",
                    "Other_charge": "",
                    "gl_account": "",
                    "freight_amt": "",
                    "grn_documentdate": "",
                    "storagelocation": "",
                    "grn_postingdate": "",
                    "grn_billoflading": "",
                    "businessplace": "",
                    "un_planned": "",
                }
                aTableArr.push(obj)

                TableModel.setProperty("/aTableItem", aTableArr);

            },

            handleValueHelp: function (oEvent) {

                var oView = this.getView();
                this._sInputId = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zpurregister.fragments.Dialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oGenericModel>plant}",
                        // info: "{oGenericModel>plant}",
                        type: "Active"
                    });
                    oValueHelpDialog.bindAggregation("items", {
                        path: 'oGenericModel>/PlantValueHelp',
                        template: oTemplate
                    });
                    oValueHelpDialog.setTitle("Select Customer");
                    oValueHelpDialog.setResizable(true);
                    oValueHelpDialog.setMultiSelect(true);
                    oValueHelpDialog.open();
                });
            },

            _handleValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var productInput = this.byId(this._sInputId);
                    productInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("plant", FilterOperator.Contains, sValue),
                    // new Filter("CustomerName", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            handleValueHelpSupplier: function (oEvent) {

                var oView = this.getView();
                this._sInputId_Supplier = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog_Supplier) {
                    this._pValueHelpDialog_Supplier = Fragment.load({
                        id: oView.getId(),
                        name: "zpurregister.fragments.SupplierDialog",
                        controller: this
                    }).then(function (oValueHelpDialog_Supplier) {
                        oView.addDependent(oValueHelpDialog_Supplier);
                        return oValueHelpDialog_Supplier;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog_Supplier.then(function (oValueHelpDialog_Supplier) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oSupplierModel>Supplier}",
                        info: "{oSupplierModel>SupplierFullName}",
                        type: "Active"
                    });
                    oValueHelpDialog_Supplier.bindAggregation("items", {
                        path: 'oSupplierModel>/aSupplierData',
                        template: oTemplate
                    });
                    oValueHelpDialog_Supplier.setTitle("Select Supplier");
                    oValueHelpDialog_Supplier.setResizable(true);
                    oValueHelpDialog_Supplier.setMultiSelect(true);
                    oValueHelpDialog_Supplier.open();
                });
            },
            _handleValueHelpSupplierClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput1 = this.getView().byId("Supplier");
                var SupplierData = this.getView().byId("Supplier").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        if (SupplierData.includes(oItem.getObject().Supplier) == false) {
                            oMultiInput1.addToken(new Token({
                                text: oItem.getObject().Supplier
                            }));
                        }
                    });
                }
            },
            onSearch_Supplier: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("Supplier", FilterOperator.Contains, sValue),
                    new Filter("SupplierFullName", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            handleValueHelpCompanyCode: function (oEvent) {

                var oView = this.getView();
                this._sInputId_CompanyCode = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog_CompanyCode) {
                    this._pValueHelpDialog_CompanyCode = Fragment.load({
                        id: oView.getId(),
                        name: "zpurregister.fragments.CompanyCodeValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog_CompanyCode) {
                        oView.addDependent(oValueHelpDialog_CompanyCode);
                        return oValueHelpDialog_CompanyCode;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog_CompanyCode.then(function (oValueHelpDialog_CompanyCode) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oCompanyCodeModel>CompanyCode}",
                        info: "{oCompanyCodeModel>CompanyCodeName}",
                        type: "Active"
                    });
                    oValueHelpDialog_CompanyCode.bindAggregation("items", {
                        path: 'oCompanyCodeModel>/aCompanyCodeData',
                        template: oTemplate
                    });
                    oValueHelpDialog_CompanyCode.setTitle("Select Company Code");
                    oValueHelpDialog_CompanyCode.setResizable(true);
                    oValueHelpDialog_CompanyCode.setMultiSelect(true);
                    oValueHelpDialog_CompanyCode.open();
                });
            },

            _handleValueHelpCompanyCodeClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput1 = this.getView().byId("CompanyCode");
                var CompanyCodeData = this.getView().byId("CompanyCode").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        if (CompanyCodeData.includes(oItem.getObject().CompanyCode) == false) {
                            oMultiInput1.addToken(new Token({
                                text: oItem.getObject().CompanyCode
                            }));
                        }
                    });
                }
            },

            onSearchCompanyCode: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("CompanyCode", FilterOperator.Contains, sValue),
                    new Filter("CompanyCodeName", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            handleValueHelpPurchaseOrder: function (oEvent) {

                var oView = this.getView();
                this._sInputId_PurchaseOrder = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog_PurchaseOrder) {
                    this._pValueHelpDialog_PurchaseOrder = Fragment.load({
                        id: oView.getId(),
                        name: "zpurregister.fragments.PurchaseOrder",
                        controller: this
                    }).then(function (oValueHelpDialog_PurchaseOrder) {
                        oView.addDependent(oValueHelpDialog_PurchaseOrder);
                        return oValueHelpDialog_PurchaseOrder;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog_PurchaseOrder.then(function (oValueHelpDialog_PurchaseOrder) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oPurchaseOrderModel>PurchaseOrder}",
                        // info: "{oGenericModel>plant}",
                        type: "Active"
                    });
                    oValueHelpDialog_PurchaseOrder.bindAggregation("items", {
                        path: 'oPurchaseOrderModel>/aPurchaseOrderData',
                        template: oTemplate
                    });
                    oValueHelpDialog_PurchaseOrder.setTitle("Select Purchase Order");
                    oValueHelpDialog_PurchaseOrder.setResizable(true);
                    oValueHelpDialog_PurchaseOrder.setMultiSelect(true);
                    oValueHelpDialog_PurchaseOrder.open();
                });
            },
            _handlePurchaseOrderValueHelpClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput1 = this.getView().byId("PurchaseOrder");
                var PurchaseOrderData = this.getView().byId("PurchaseOrder").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        if (PurchaseOrderData.includes(oItem.getObject().PurchaseOrder) == false) {
                            oMultiInput1.addToken(new Token({
                                text: oItem.getObject().PurchaseOrder
                            }));
                        }
                    });
                }
            },
            onSearchPurchaseOrder: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("PurchaseOrder", FilterOperator.Contains, sValue),
                    // new Filter("CustomerName", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            handleValueHelpMatDesc: function (oEvent) {

                var oView = this.getView();
                this._sInputId_MatDesc = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog_MatDesc) {
                    this._pValueHelpDialog_MatDesc = Fragment.load({
                        id: oView.getId(),
                        name: "zpurregister.fragments.MatdescValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog_MatDesc) {
                        oView.addDependent(oValueHelpDialog_MatDesc);
                        return oValueHelpDialog_MatDesc;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog_MatDesc.then(function (oValueHelpDialog_MatDesc) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oMaterialModel>ProductDescription}",
                        info: "{oMaterialModel>Product}",
                        type: "Active"
                    });
                    oValueHelpDialog_MatDesc.bindAggregation("items", {
                        path: 'oMaterialModel>/aMaterialData',
                        template: oTemplate
                    });
                    oValueHelpDialog_MatDesc.setTitle("Select Material Description");
                    oValueHelpDialog_MatDesc.setResizable(true);
                    oValueHelpDialog_MatDesc.setMultiSelect(true);
                    oValueHelpDialog_MatDesc.open();
                });
            },

            _handleValueHelpMatDescClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput1 = this.getView().byId("Matdesc");
                var ProductDescriptionData = this.getView().byId("Matdesc").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        if (ProductDescriptionData.includes(oItem.getObject().ProductDescription) == false) {
                            oMultiInput1.addToken(new Token({
                                text: oItem.getObject().ProductDescription
                            }));
                        }
                    });
                }
            },

            onSearchMatDesc: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("ProductDescription", FilterOperator.Contains, sValue),
                    new Filter("Product", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            handleValueHelpPlant: function (oEvent) {
                var oView = this.getView();
                this._sInputId_Plant = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog_Plant) {
                    this._pValueHelpDialog_Plant = Fragment.load({
                        id: oView.getId(),
                        name: "zpurregister.fragments.PlantValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog_Plant) {
                        oView.addDependent(oValueHelpDialog_Plant);
                        return oValueHelpDialog_Plant;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog_Plant.then(function (oValueHelpDialog_Plant) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oPlantModel>Plant}",
                        info: "{oPlantModel>PlantName}",
                        type: "Active"
                    });
                    oValueHelpDialog_Plant.bindAggregation("items", {
                        path: 'oPlantModel>/aPlantData',
                        template: oTemplate
                    });
                    oValueHelpDialog_Plant.setTitle("Select Plant");
                    oValueHelpDialog_Plant.setResizable(true);
                    oValueHelpDialog_Plant.setMultiSelect(true);
                    oValueHelpDialog_Plant.open();
                });
            },
            _handleValueHelpPlantClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput1 = this.getView().byId("Plant");
                var PlantData = this.getView().byId("Plant").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        if (PlantData.includes(oItem.getObject().Plant) == false) {
                            oMultiInput1.addToken(new Token({
                                text: oItem.getObject().Plant
                            }));
                        }
                    });
                }
            },
            onSearchPlant: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("Plant", FilterOperator.Contains, sValue),
                    new Filter("PlantName", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            handleValueHelpMaterial: function (oEvent) {

                var oView = this.getView();
                this._sInputIdMaterial = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialogMaterial) {
                    this._pValueHelpDialogMaterial = Fragment.load({
                        id: oView.getId(),
                        name: "zpurregister.fragments.MaterialValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialogMaterial) {
                        oView.addDependent(oValueHelpDialogMaterial);
                        return oValueHelpDialogMaterial;
                    });
                }

                // open value help dialog
                this._pValueHelpDialogMaterial.then(function (oValueHelpDialogMaterial) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oMaterialModel>Product}",
                        info: "{oMaterialModel>ProductDescription}",
                        type: "Active"
                    });
                    oValueHelpDialogMaterial.bindAggregation("items", {
                        path: 'oMaterialModel>/aMaterialData',
                        template: oTemplate
                    });
                    oValueHelpDialogMaterial.setTitle("Select Material");
                    oValueHelpDialogMaterial.setResizable(true);
                    oValueHelpDialogMaterial.setMultiSelect(true);
                    oValueHelpDialogMaterial.open();
                });
            },

            _handleValueHelpMaterialClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput1 = this.getView().byId("Material");
                var ProductData = this.getView().byId("Material").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        if (ProductData.includes(oItem.getObject().Product) == false) {
                            oMultiInput1.addToken(new Token({
                                text: oItem.getObject().Product
                            }));
                        }
                    });
                }
            },

            onSearchMaterial: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("Product", FilterOperator.Contains, sValue),
                    new Filter("ProductDescription", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },















            //Excel Download
            //Excel Download With HardCode FileName
            ExportExcelDownloadFunction: function () {
                // alert("Devendra Singh")
                var aCols, aTable, oSettings, oSheet;
                var FileName = "Purchase Register Report";

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
                        label: 'Contract',
                        property: 'purchasecontract',
                        width: '50'
                    },
                    {
                        label: 'Contract Item',
                        property: 'purchasecontractitem',
                        width: '50'
                    },
                    {
                        label: 'PR No.',
                        property: 'purchaserequisition',
                        width: '50'
                    },
                    {
                        label: 'Account Assignment Category',
                        property: 'AccountAssignmentCategory',
                        width: '50'
                    }, {
                        label: 'PO No.',
                        property: 'purchaseorder',
                        width: '50'
                    }, {
                        label: 'PO Item',
                        property: 'purchaseorderitem',
                        width: '50'
                    }, {
                        label: 'Po Quantity',
                        property: 'orderquantity',
                        width: '50'
                    }, {
                        label: 'Purchase Order Type',
                        property: 'purchaseordertype',
                        width: '50'
                    }, {
                        label: 'Purchase Order Date',
                        property: 'purchaseorderdate',
                        width: '50'
                    }, {
                        label: 'Company Code',
                        property: 'companycode',
                        width: '50'
                    }, {
                        label: 'Purg Group',
                        property: 'purchasinggroup',
                        width: '50'
                    }, {
                        label: 'Supplier',
                        property: 'supplier',
                        width: '50'
                    }, {
                        label: 'Supplier Name',
                        property: 'supplier_name',
                        width: '50'
                    }, {
                        label: 'Supplier GSTIN',
                        property: 'supplier_gstin',
                        width: '50'
                    }, {
                        label: 'Material',
                        property: 'material',
                        width: '50'
                    }, {
                        label: 'Material Description',
                        property: 'purchaseorderitemtext',
                        width: '50'
                    },
                    {
                        label: 'WBS Element',
                        property: 'WBSElementInternalID_2',
                        width: '50'
                    },
                    {
                        label: 'WBS Name',
                        property: 'ProjectElementDescription',
                        width: '50'
                    },
                     {
                        label: 'Net Amount',
                        property: 'netamount',
                        width: '50'
                    }, {
                        label: 'Net Price Amount',
                        property: 'netpriceamount',
                        width: '50'
                    }, {
                        label: 'Plant',
                        property: 'plant',
                        width: '50'
                    }, {
                        label: 'GRN Document',
                        property: 'grn_document',
                        width: '50'
                    },{
                        label: 'Gate Entry No.',
                        property: 'MaterialDocumentHeaderText',
                        width: '50'
                    },
                     {
                        label: 'GRN Quantity',
                        property: 'grn_qty',
                        width: '50'
                    }, {
                        label: 'Other Charge',
                        property: 'Other_charge',
                        width: '50'
                    }, {
                        label: 'GRN Amount',
                        property: 'grn_amountnew',
                        width: '50'
                    }, {
                        label: 'Total GRN Amount',
                        property: 'grn_amount',
                        width: '50'
                    }, {
                        label: 'GRN Document Date',
                        property: 'grn_documentdate',
                        width: '50'
                    }, {
                        label: 'GRN Posting Date',
                        property: 'grn_postingdate',
                        width: '50'
                    }, {
                        label: 'Storage Location',
                        property: 'storagelocation',
                        width: '50'
                    }, {
                        label: 'Bill of Lading',
                        property: 'grn_billoflading',
                        width: '50'
                    }, {
                        label: 'Invoice Posting Date',
                        property: 'invoice_postingdate',
                        width: '50'
                    }, {
                        label: 'Invoice Document Date',
                        property: 'invoice_documentdate',
                        width: '50'
                    }, {
                        label: 'Invoice Document Reference ID',
                        property: 'invoice_documentreferenceid',
                        width: '50'
                    }, {
                        label: 'MIRO No.',
                        property: 'invoice_no',
                        width: '50'
                    },
                    {
                        label: 'Journal Entry No.',
                        property: 'accountingdocument',
                        width: '50'
                    },
                     {
                        label: 'Park/Post',
                        property: 'park_post',
                        width: '50'
                    }, {
                        label: 'Invoice Quantity',
                        property: 'invoice_quantity',
                        width: '50'
                    }, {
                        label: 'Invoice Amount',
                        property: 'invoice_amount',
                        width: '50'
                    }, {
                        label: 'Tax Code',
                        property: 'taxcode',
                        width: '50'
                    }, {
                        label: 'IGST',
                        property: 'igst',
                        width: '50'
                    }, {
                        label: 'SGST',
                        property: 'sgst',
                        width: '50'
                    }, {
                        label: 'CGST',
                        property: 'cgst',
                        width: '50'
                    }, {
                        label: 'HSN',
                        property: 'br_ncm',
                        width: '50'
                    }, {
                        label: 'TDS Amount',
                        property: 'tdsamount',
                        width: '50'
                    }, {
                        label: 'Business Place',
                        property: 'businessplace',
                        width: '50'
                    }, {
                        label: 'Un Planned',
                        property: 'un_planned',
                        width: '50'
                    }, {
                        label: 'Gl Account',
                        property: 'gl_account',
                        width: '50'
                    },
                    {
                        label: 'GL Account Name',
                        property: 'GLAccountName',
                        width: '50'
                    }, {
                        label: 'Freight Amount',
                        property: 'freight_amt',
                        width: '50'
                    },];
            },

            ExportExcelas_DownloadFunction: function (oEvent) {
                // this.oDialog.open();
                // this.oDialog = sap.ui.xmlfragment("zsubsidireport.fragment.ExcelForm", this);
                if (!this.oDialog) {
                    this.loadFragment({
                        name: "zpurregister.fragments.ExcelForm"
                    }).then(function (oDialog) {
                        this.oDialog = oDialog;
                        this.oDialog.open();
                    }.bind(this))
                } else {
                    this.oDialog.open();
                }

            },

            //Export As Fragment Function
            ExportButton: function (oEvent) {
                var aCols, aTable, oSettings, oSheet;
                var FileName = this.getOwnerComponent().getModel("oExcelFileNameModel").getProperty("/ExcelFileName");
                // var FileName = prompt("Please Enter File Name", "Purchase Register Report");

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
                    this.getOwnerComponent().getModel("oExcelFileNameModel").setProperty("/ExcelFileName", "Purchase Register Report")
                }).finally(oSheet.destroy);
                this.oDialog.close();
            },
            Cancelbutton: function (oEvent) {
                this.oDialog.close();
            },




            GetTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Fetching"
                });
                oBusyDialog.open();
                
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_PURCHASE_REGISTER_BIN")
                var oTableModel = this.getView().getModel("oTableItemModel")
                var oRowCountModel = this.getView().getModel("oRowCountModel")
                oTableModel.setProperty("/aTableItem",[])
                var aTableArr = [];
                var top = 5000;
                var skip = 0;
                var aNewArr = [];

                var Supplier = this.getView().byId("Supplier").getTokens().map(function (oToken) {
                    return oToken.getText();
                });;
                var CompanyCode = this.getView().byId("CompanyCode").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PurchaseOrder = this.getView().byId("PurchaseOrder").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Matdesc = this.getView().byId("Matdesc").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Plant = this.getView().byId("Plant").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var Material = this.getView().byId("Material").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                
                var AccountAssignmentCategory = this.getView().byId("AccountAssignmentCategory").getTokens().map(function (oToken) {
                    return oToken.getText();
                });
                var PODate = this.getView().byId("PODate").getValue();
                var GrnDate = this.getView().byId("GrnDate").getValue();
                var MiroDate = this.getView().byId("MiroDate").getValue();
                // var AccountAssignmentCategory = this.getView().byId("AccountAssignmentCategory").getTokens();
                var aFilters_aNewArr = [];
                if (CompanyCode.length != 0 || MiroDate != "" || Supplier.length != 0 || PurchaseOrder.length != 0 || Matdesc.length != 0 || Plant.length != 0 || PODate != "" || Material.length != 0 || GrnDate != "" || AccountAssignmentCategory.length != 0) {
                    if (CompanyCode.length != 0) {
                        CompanyCode.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("companycode", "EQ", item))
                        })
                    }
                    
                    if (MiroDate != "") {
                        var FromMiroDate = MiroDate.split(" - ")[0];
                        var ToMiroDate = MiroDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "invoice_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromMiroDate,
                            value2: ToMiroDate
                        }))
                    }
                    if (AccountAssignmentCategory.length != 0) {
                        AccountAssignmentCategory.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("AccountAssignmentCategory", "EQ", item))
                        })
                    }
                    if (Supplier.length != 0) {
                        Supplier.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("supplier", "EQ", item))
                        })
                    }
                    if (PurchaseOrder.length != 0) {
                        PurchaseOrder.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorder", "EQ", item))
                        })
                    }
                    if (Matdesc.length != 0) {
                        Matdesc.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderitemtext", "EQ", item))
                        })
                    }
                    if (Plant.length != 0) {
                        Plant.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("plant", "EQ", item))
                        })
                    }
                    
                    if (PODate != "") {
                        aFilters_aNewArr.push(new sap.ui.model.Filter("purchaseorderdate", "EQ", PODate))
                    }
                    if (Material.length != 0) {
                        Material.map(function (item) {
                            aFilters_aNewArr.push(new sap.ui.model.Filter("material", "EQ", item))
                        })
                    }
                    if (GrnDate != "") {
                        var FromGrnDate = GrnDate.split(" - ")[0];
                        var ToGrnDate = GrnDate.split(" - ")[1];
                        aFilters_aNewArr.push(new sap.ui.model.Filter({
                            path: "grn_postingdate",
                            operator: FilterOperator.BT,
                            value1: FromGrnDate,
                            value2: ToGrnDate
                        }))
                        // aFilters_aNewArr.push(new sap.ui.model.Filter("grn_postingdate", "EQ", GrnDate))
                    }

                    // if (Plant.length === 0 ) {
                    //     oBusyDialog.close();
                    //     return MessageBox.error("Please Select Plant")
                    // }
                     
                    
                    function readData(skip) {
                        oModel.read("/pur_reg", {
                            filters: [aFilters_aNewArr],
                            urlParameters: {
                                "$top": "5000",
                                "$skip": skip
                            },
                            success: function (oData, response) {
                                var lastValue = 0;
                                if (oData.results.length > 0) {
                                    lastValue = oData.results[0].tottal_data;
                                } else {
                                    lastValue = skip;
                                }
                                
                                if (skip < lastValue) {
                                    oData.results.map(function (items) {
                                        var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                        var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                        var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                        var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                        var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                        var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                        var obj = {
                                            "purchaseorder": items.purchaseorder,
                                            "purchaseordertype": items.purchaseordertype,
                                            "createdbyuser": items.createdbyuser,
                                            "creationdate": creationDate,
                                            "purchaseorderdate": purchaseOrderDate,
                                            "companycode": items.companycode,
                                            "purchasinggroup": items.purchasinggroup,
                                            "purchasingorganization": items.purchasingorganization,
                                            "supplier": items.supplier,
                                            "purchaseorderitem": items.purchaseorderitem,
                                            "materialgroup": items.materialgroup,
                                            "productgrouptext": items.ProductGroupText,
                                            "material": items.material,
                                            "br_ncm": items.br_ncm,
                                            "grossamount": items.grossamount,
                                            "netamount": items.netamount,
                                            "netpriceamount": items.netpriceamount,
                                            "plant": items.plant,
                                            "orderquantity": items.orderquantity,
                                            "baseunit": items.BaseUnit,
                                            "purchaserequisition": items.purchaserequisition,
                                            "purchasecontract": items.purchasecontract,
                                            "purchasecontractitem": items.purchasecontractitem,
                                            "purchaseorderitemtext": items.purchaseorderitemtext,
                                            "grn_document": items.grn_document,
                                            "grn_documentyear": items.grn_documentyear,
                                            "grn_qty": items.grn_qty,
                                            "grn_amount": items.grn_amount,
                                            "grn_amountnew": items.grn_amountnew,
                                            "Other_charge": items.Other_charge,
                                            "gl_account": items.gl_account,
                                            "freight_amt": items.freight_amt,
                                            "grn_documentdate": grnDocumentDate,
                                            "storagelocation": items.storagelocation,
                                            "grn_postingdate": grnPostingDate,
                                            "grn_billoflading": items.grn_billoflading,
                                            "invoice_postingdate": invoicePostingDate,
                                            "invoice_documentdate": invoiceDocumentDate,
                                            "invoice_quantity": items.invoice_quantity,
                                            "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                            "invoice_no": items.invoice_no,
                                            "grn_referencedocument": items.grn_referencedocument,
                                            "grn_createdby": items.grn_createdby,
                                            "batch": items.batch,
                                            "invoice_amount": items.invoice_amount,
                                            "igst": items.igst,
                                            "cgst": items.cgst,
                                            "sgst": items.sgst,
                                            "ProductGroupName": items.ProductGroupName,
                                            "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                            "taxcode": items.taxcode,
                                            "supplier_name": items.supplier_name,
                                            "supplier_gstin": items.supplier_gstin,
                                            "park_post": items.park_post,
                                            "tdsamount": items.tdsamount,
                                            "businessplace": items.businessplace,
                                            "un_planned": items.un_planned,
                                            "GLAccountName": items.GLAccountName,
                                            "accountingdocument": items.accountingdocument,
                                            "WBSElementInternalID_2": items.WBSElementInternalID_2,
                                            "ProjectElementDescription": items.ProjectElementDescription,
                                            "MaterialDocumentHeaderText": items.MaterialDocumentHeaderText,
                                            "TotalInvoiceAMT":items.TOTAL_SUM,



                                        }
                                        aTableArr.push(obj)
                                    })
                                    readData(skip + 5000);
                                } else {
                                    oTableModel.setProperty("/aTableItem", aTableArr);
                                    oRowCountModel.setProperty("/aRowCountData", aTableArr.length);
                                    oBusyDialog.close();
                                }
                            },
                            error: function (error) {
                                console.error("Error reading data:", error);
                            }
                        });
                    }
                    readData(skip);
                }

               
                else {

                    function readData(skip) {
                        oModel.read("/pur_reg", {
                            urlParameters: {
                                "$top": "5000",
                                "$skip": skip
                            },
                            success: function (oData, response) {
                                var lastValue = 0;
                                if (oData.results.length > 0) {
                                    lastValue = oData.results[0].tottal_data;
                                } else {
                                    lastValue = skip;
                                }
                                if (skip < lastValue) {
                                    oData.results.map(function (items) {
                                        var creationDate = items.creationdate.slice(0, 4) + "-" + items.creationdate.slice(4, 6) + "-" + items.creationdate.slice(6, 9)
                                        var purchaseOrderDate = items.purchaseorderdate.slice(0, 4) + "-" + items.purchaseorderdate.slice(4, 6) + "-" + items.purchaseorderdate.slice(6, 9)
                                        var invoicePostingDate = items.invoice_postingdate.slice(0, 4) + "-" + items.invoice_postingdate.slice(4, 6) + "-" + items.invoice_postingdate.slice(6, 9)
                                        var invoiceDocumentDate = items.invoice_documentdate.slice(0, 4) + "-" + items.invoice_documentdate.slice(4, 6) + "-" + items.invoice_documentdate.slice(6, 9)
                                        var grnDocumentDate = items.grn_documentdate.slice(0, 4) + "-" + items.grn_documentdate.slice(4, 6) + "-" + items.grn_documentdate.slice(6, 9)
                                        var grnPostingDate = items.grn_postingdate.slice(0, 4) + "-" + items.grn_postingdate.slice(4, 6) + "-" + items.grn_postingdate.slice(6, 9)
                                        var obj = {
                                            "purchaseorder": items.purchaseorder,
                                            "purchaseordertype": items.purchaseordertype,
                                            "createdbyuser": items.createdbyuser,
                                            "creationdate": creationDate,
                                            "purchaseorderdate": purchaseOrderDate,
                                            "companycode": items.companycode,
                                            "purchasinggroup": items.purchasinggroup,
                                            "purchasingorganization": items.purchasingorganization,
                                            "supplier": items.supplier,
                                            "purchaseorderitem": items.purchaseorderitem,
                                            "materialgroup": items.materialgroup,
                                            "productgrouptext": items.ProductGroupText,
                                            "material": items.material,
                                            "br_ncm": items.br_ncm,
                                            "grossamount": items.grossamount,
                                            "netamount": items.netamount,
                                            "netpriceamount": items.netpriceamount,
                                            "plant": items.plant,
                                            "orderquantity": items.orderquantity,
                                            "baseunit": items.BaseUnit,
                                            "purchaserequisition": items.purchaserequisition,
                                            "purchasecontract": items.purchasecontract,
                                            "purchasecontractitem": items.purchasecontractitem,
                                            "purchaseorderitemtext": items.purchaseorderitemtext,
                                            "grn_document": items.grn_document,
                                            "grn_documentyear": items.grn_documentyear,
                                            "grn_qty": items.grn_qty,
                                            "grn_amount": items.grn_amount,
                                            "grn_amountnew": items.grn_amountnew,
                                            "Other_charge": items.Other_charge,
                                            "gl_account": items.gl_account,
                                            "freight_amt": items.freight_amt,
                                            "grn_documentdate": grnDocumentDate,
                                            "storagelocation": items.storagelocation,
                                            "grn_postingdate": grnPostingDate,
                                            "grn_billoflading": items.grn_billoflading,
                                            "invoice_postingdate": invoicePostingDate,
                                            "invoice_documentdate": invoiceDocumentDate,
                                            "invoice_quantity": items.invoice_quantity,
                                            "invoice_documentreferenceid": items.invoice_documentreferenceid,
                                            "invoice_no": items.invoice_no,
                                            "grn_referencedocument": items.grn_referencedocument,
                                            "grn_createdby": items.grn_createdby,
                                            "batch": items.batch,
                                            "invoice_amount": items.invoice_amount,
                                            "igst": items.igst,
                                            "cgst": items.cgst,
                                            "sgst": items.sgst,
                                            "ProductGroupName": items.ProductGroupName,
                                            "AccountAssignmentCategory": items.AccountAssignmentCategory,
                                            "taxcode": items.taxcode,
                                            "supplier_name": items.supplier_name,
                                            "supplier_gstin": items.supplier_gstin,
                                            "park_post": items.park_post,
                                            "tdsamount": items.tdsamount,
                                            "businessplace": items.businessplace,
                                            "un_planned": items.un_planned,
                                            "GLAccountName": items.GLAccountName,
                                            "accountingdocument": items.accountingdocument,
                                            "WBSElementInternalID_2": items.WBSElementInternalID_2,
                                            "ProjectElementDescription": items.ProjectElementDescription,
                                            "MaterialDocumentHeaderText": items.MaterialDocumentHeaderText,
                                            "TotalInvoiceAMT":items.TOTAL_SUM,



                                        }
                                        aTableArr.push(obj)
                                    })
                                    readData(skip + 5000);
                                } else {
                                    oTableModel.setProperty("/aTableItem", aTableArr);
                                    oRowCountModel.setProperty("/aRowCountData", aTableArr.length);
                                    oBusyDialog.close();
                                }
                            },
                            error: function (error) {
                                console.error("Error reading data:", error);
                            }
                        });
                    }
                    readData(skip);
                }
            },
        });
    });
