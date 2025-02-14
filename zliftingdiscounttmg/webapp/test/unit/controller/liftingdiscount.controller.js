/*global QUnit*/

sap.ui.define([
	"zliftingdiscounttmg/controller/liftingdiscount.controller"
], function (Controller) {
	"use strict";

	QUnit.module("liftingdiscount Controller");

	QUnit.test("I should test the liftingdiscount controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
