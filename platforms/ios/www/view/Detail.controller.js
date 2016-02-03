sap.ui.controller('sap.ui.apouni.view.Detail', {
  onInit: function () {
    var oView = this.getView()

    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function (oEvent) {
      // when detail navigation occurs, update the binding context
      if (oEvent.getParameter('name') === 'dealer') {
        var sProductPath = '/' + oEvent.getParameter('arguments').product

        oView.bindElement(sProductPath)

        // Check that the product specified actually was found
        oView.getElementBinding().attachEventOnce('dataReceived', jQuery.proxy(function () {
          var oData = oView.getModel().getData(sProductPath)
          if (!oData) {
            sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
              currentView: oView,
              targetViewName: 'sap.ui.apouni.view.NotFound',
              targetViewType: 'XML'
            })
          }
        }, this))


        // Make sure the master is here
        var oIconTabBar = oView.byId('idIconTabBar')

        // Which tab?
        var sTabKey = oEvent.getParameter('arguments').tab || 'dealer'
        if (oIconTabBar.getSelectedKey() !== sTabKey) {
          oIconTabBar.setSelectedKey(sTabKey)
        }

        var dealerId = oEvent.getParameter('arguments').product.replace('DealerSet(', '').replace(')', ''),
          filter = new sap.ui.model.Filter('Dealer', sap.ui.model.FilterOperator.EQ, dealerId)

        if (oIconTabBar.getSelectedKey() === 'vehicle') {
          oView.byId('vehTable').getBinding('items').filter([filter])
        }
      }
    }, this)

  },

  onNavBack: function () {
    // This is only relevant when running on phone devices
    sap.ui.core.UIComponent.getRouterFor(this).myNavBack('main')
  },

  onDetailSelect: function (oEvent) {
    sap.ui.core.UIComponent.getRouterFor(this).navTo('dealer', {
      product: oEvent.getSource().getBindingContext().getPath().slice(1),
      tab: oEvent.getParameter('selectedKey')
    }, true)
  },

  onBackSelect: function () {
    sap.ui.core.UIComponent.getRouterFor(this).navTo('main')
  },
  
  onFavoriteSelect: function (oView) {
    var oData = this.getView().getModel()
   
  }
})
