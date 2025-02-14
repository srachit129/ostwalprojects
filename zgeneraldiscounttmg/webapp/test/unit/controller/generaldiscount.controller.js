/*global QUnit*/

sap.ui.define([
	"zgeneraldiscounttmg/controller/generaldiscount.controller"
], function (Controller) {
	"use strict";

	QUnit.module("generaldiscount Controller");

	QUnit.test("I should test the generaldiscount controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
