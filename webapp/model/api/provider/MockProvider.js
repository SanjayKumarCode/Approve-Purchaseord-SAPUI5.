// @ts-nocheck
/* eslint-disable @sap/ui5-jsdocs/no-jsdoc */
sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	var sMockdataPath = jQuery.sap.getModulePath("com.example.approvepurchaseord") + "/model/api/mockdata/";

	var aDataSets = [
		"purchaseorder"		
	];

	var oSimulateError = {
		getRequestList: false
	};

	return UI5Object.extend("com.example.approvepurchaseord.model.api.provider.MockProvider", {
		_iDelay: 1000,
		_oData: {},
		_oInitialDataLoadPromise: {},

		constructor: function () {
            this._sUserName = "DUMMY_USER";
			this._oInitialDataLoadPromise = Promise.all(this._getDataLoadPromises());
		},

		_getDataLoadPromises: function () {
			return aDataSets.map(
				function (sDataSet) {
					return new Promise(
						function (resolve) {
							$.getJSON(
								sMockdataPath + sDataSet + ".json",
								function (oJson) {
									this._oData[sDataSet] = oJson;
									resolve();
								}.bind(this)
							);
						}.bind(this)
					);
				}.bind(this)
			);
		},

		_onDataReady: function () {
			return new Promise(
				function (resolve) {
					this._oInitialDataLoadPromise.then(
						function () {
							setTimeout(
								function () {
									resolve();
								}.bind(this),
								this._iDelay
							);
						}.bind(this)
					);
				}.bind(this)
			);
		},
		getRequestList:function(){
			var aRequestList;
			var oPromise = new Promise(
				function (resolve, reject) {
					this._onDataReady().then(
						function () { 	
								resolve(this._oData.purchaseorder);							
						}.bind(this)
					);
				}.bind(this)
			);
			oPromise.abort = function () {};
			return oPromise;
		},
		getRequestDetail:function(sEAItemPath, sID){
			var aRequestDetail;
			debugger;
			var oPromise = new Promise(
				function (resolve, reject) {
					this._onDataReady().then(
						function () { 
							debugger;
								// STANDARD EXECUTION
								this._oData.purchaseorder = this._oData.purchaseorder.find(
									function (oRequestDetailItem){
										return (
											oRequestDetailItem.NOTIFICATION_ID === sID
										);
									});
								resolve(this._oData.purchaseorder);							
						}.bind(this)
					);
				}.bind(this)
			);
			oPromise.abort = function () {};
			return oPromise;
		}
       
    });
});
