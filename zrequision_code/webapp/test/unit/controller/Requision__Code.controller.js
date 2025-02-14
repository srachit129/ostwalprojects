/*global QUnit*/

sap.ui.define([
	"zrequision_code/controller/Requision__Code.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Requision__Code Controller");

	QUnit.test("I should test the Requision__Code controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
