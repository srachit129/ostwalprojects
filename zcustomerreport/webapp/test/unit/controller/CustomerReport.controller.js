/*global QUnit*/

sap.ui.define([
	"zcustomerreport/controller/CustomerReport.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CustomerReport Controller");

	QUnit.test("I should test the CustomerReport controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
