/*global QUnit*/

sap.ui.define([
	"zpayment_approval/controller/paymentapproval.controller"
], function (Controller) {
	"use strict";

	QUnit.module("paymentapproval Controller");

	QUnit.test("I should test the paymentapproval controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
