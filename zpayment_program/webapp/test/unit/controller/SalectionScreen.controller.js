/*global QUnit*/

sap.ui.define([
	"zpayment_program/controller/SalectionScreen.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SalectionScreen Controller");

	QUnit.test("I should test the SalectionScreen controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
