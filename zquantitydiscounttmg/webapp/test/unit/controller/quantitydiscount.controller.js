/*global QUnit*/

sap.ui.define([
	"zquantitydiscounttmg/controller/quantitydiscount.controller"
], function (Controller) {
	"use strict";

	QUnit.module("quantitydiscount Controller");

	QUnit.test("I should test the quantitydiscount controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
