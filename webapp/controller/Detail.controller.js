sap.ui.define(
  [
    "./Base.controller",
    'sap/ui/core/Fragment',
    "sap/ui/core/syncStyleClass"
  ],
  function(BaseController, Fragment,syncStyleClass) {
    "use strict";

    return BaseController.extend("com.example.approvepurchaseord.controller.Detail", {
      onInit: function () {
        BaseController.prototype.onInit.call(this);
      var  oUploadSet = this.byId("UploadSet");
  
      
        this.getRouter().getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

       
      },
      _onDetailMatched:function(oEvent){
 
        var oArguments = oEvent.getParameter("arguments");
        this._oConfigModel.setProperty("/layout", "TwoColumnsMidExpanded");
        
        this._oAppModel.setProperty("/routing/arguments/NOTIFICATION_ID", oArguments.NOTIFICATION_ID);
        if(oArguments.NOTIFICATION_ID) {
          this._sDetailPath = "/REQUEST_LIST/"+oArguments.NOTIFICATION_ID;
          var oDetailsItems;
          var oDetailPage;
          oDetailsItems = this._oAppModel.getProperty(this._sDetailPath);
          oDetailPage = this.byId("detailPage");
          oDetailPage.bindElement({
            path: this._sDetailPath,
            model: "app"
          });
          this._oAppModel.updateBindings(true);                
           this._pEADetailData = this.loadEADetailData(oDetailsItems.NOTIFICATION_ID);
           this._pEADetailData
             .then(
                 this.onEADetailDataLoaded.bind(this))
             .catch(this.onEADetailDataFailed.bind(this));
        }
      },
      loadEADetailData:function(sID){
          var bLoaded = this._oAppModel.getProperty("/REQUEST_LIST");
          if (bLoaded) {
            return Promise.resolve(
              this._oAppModel.getProperty("/REQUEST_LIST")
            );
          } else {
            this.setBusyIndicator("page", false);
            return this._oComponent._oBackendModelAPI.getRequestDetail(this._sDetailPath,  sID);		
          }
        },
        onEADetailDataLoaded:function(aEditAssmtDetailData){
           this._oAppModel.setProperty(this._sDetailPath + "/REQUEST_LIST", oDetailsItems.RequestID)
        },
        onEADetailDataFailed:function(oResponse){
        },
         // for Accept
       onAccept: function (oEvent) {
				var oTable = this.getView().byId("idTable");
				var aSelectedItems = oTable.getSelectedItems();

				for(var i=0; i<aSelectedItems.length; i++){
					oTable.removeItem(aSelectedItems[i])
				}
			},
        // for Reject 
        onReject: function (oEvent) {
          var oTable = this.getView().byId("idTable");
          var aSelectedItems = oTable.getSelectedItems();
  
          for(var i=0; i<aSelectedItems.length; i++){
            oTable.removeItem(aSelectedItems[i])
          }
        },
        // open Dialog
onOpenPressed: function (oEvent) {
  var oView = this.getView();
  if (!this._pDialog) {
      this._pDialog = Fragment.load({
          id: oView.getId("idPersonalTable"),
          name: "com.example.approvepurchaseord.view.fragment.Forword",
          controller: this
      }).then(function(oDialog){
          oView.addDependent(oDialog);
          return oDialog;
      });
  }

  this._pDialog.then(function(oDialog){
     
      syncStyleClass("sapUiSizeCompact", oView, oDialog);
      oDialog.open();
  });
},

onClosePressed: function (oEvent) {
  this._pDialog.then(function(oDialog){
      oDialog.close();
  });
}


    });
  }
);