/*global QUnit*/

sap.ui.define([
	"zcreditdebitnote/controller/CreditDebitNote.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CreditDebitNote Controller");

	QUnit.test("I should test the CreditDebitNote controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
