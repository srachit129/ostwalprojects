/*global QUnit*/

sap.ui.define([
	"zpayment_request/controller/paymentrequest.controller"
], function (Controller) {
	"use strict";

	QUnit.module("paymentrequest Controller");

	QUnit.test("I should test the paymentrequest controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
