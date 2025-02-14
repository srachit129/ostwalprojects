/*global QUnit*/

sap.ui.define([
	"zmm_60/controller/First_View.controller"
], function (Controller) {
	"use strict";

	QUnit.module("First_View Controller");

	QUnit.test("I should test the First_View controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
