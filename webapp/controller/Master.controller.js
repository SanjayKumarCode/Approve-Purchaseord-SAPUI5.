sap.ui.define(
    [
      "./Base.controller",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator"
    ],
    function(BaseController,Filter, FilterOperator) {
      "use strict";
  
      return BaseController.extend("com.example.approvepurchaseord.controller.Master", {
        onInit() {
          BaseController.prototype.onInit.call(this);
          this._oRouter.getRoute("master").attachPatternMatched(this.onViewPatternMatched, this);
          this._fetchRequestListData();
        },
        onViewPatternMatched: function () {
            this._oAppModel.updateBindings(true);
        },
        onRefresh:function(){
            this._fetchRequestListData();
        },
        _fetchRequestListData: function () {
         
            if (this._oComponent._oBackendModelAPI) {
  
              this._oComponent._oBackendModelAPI
                .getRequestList()
                .then(this.onRequestLoaded.bind(this))
                .catch(this.onRequestLoadFailed.bind(this));
            }
          },
          onRequestLoaded: function () {
            this._postProcessInitialDataLoad(true);
          },
  
          onRequestLoadFailed: function (oResponse) {
            this._postProcessInitialDataLoad(false);
          },
          _postProcessInitialDataLoad: function () {
            var aRequest =
              this._oAppModel.getProperty("/REQUEST_LIST") || [];
          },
          onListItemPress:function(oEvent){
            var oNextUIState =sap.f.LayoutType.TwoColumnsBeginExpanded;
            var oListItem =sap.ui.getCore().byId(oEvent.getParameter("id")).getBindingContext('app').sPath;
                if (oListItem) {
                    var index = oListItem.split("/")[2];
                } 
                this._showDetail(oNextUIState, index);
          },
          _showDetail: function(oNextUIState, oItem){
            this.getRouter().navTo("detail", {layout: oNextUIState, 
              NOTIFICATION_ID: oItem});
          },  
          onRequestApprove:function(){
            sap.m.MessageToast.show("Requests Approved");
          },
          onRequestReject:function(){
            sap.m.MessageToast.show("Requests Rejected");
          },
          onExit: function () {
            this._oComponent._oBackendModelAPI.abortAllRequests();
          },   handleSearch: function (evt) {
            // create model filter
            var filters = [];
            var query = evt.getParameter("query");
            if (query && query.length > 0) {
                filters.push(new Filter({
                    path: "ProductId",
                    operator: FilterOperator.Contains,
                    value1: query
                }));
            }
    
            // update list binding
            var list = this.getView().byId("idProductsTable");
            var binding = list.getBinding("items");
            binding.filter(filters);
        },  
        
        //  for Search 
        handleSearch: function (evt) {
          // create model filter
          var filters = [];
          var query = evt.getParameter("query");
          if (query && query.length > 0) {
              filters.push(new Filter({
                  path: "TESTING_PRICE",
                  operator: FilterOperator.Contains,
                  value1: query
              }));
          }
  
          // update list binding
          var list = this.getView().byId("idProductsTable");
          var binding = list.getBinding("items");
          binding.filter(filters);
      },
          
      });
    }
  );
  