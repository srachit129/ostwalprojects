/*global QUnit*/

sap.ui.define([
	"zpaymentadvice/controller/PaymentAdvice.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PaymentAdvice Controller");

	QUnit.test("I should test the PaymentAdvice controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
