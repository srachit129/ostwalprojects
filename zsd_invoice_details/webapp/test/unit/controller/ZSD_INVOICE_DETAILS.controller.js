/*global QUnit*/

sap.ui.define([
	"zsd_invoice_details/controller/ZSD_INVOICE_DETAILS.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ZSD_INVOICE_DETAILS Controller");

	QUnit.test("I should test the ZSD_INVOICE_DETAILS controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
