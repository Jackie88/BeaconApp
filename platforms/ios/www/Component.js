jQuery.sap.declare("sap.ui.apouni.Component");
jQuery.sap.require("sap.ui.core.util.MockServer"); 
jQuery.sap.require("sap.ui.apouni.Router");

sap.ui.core.UIComponent.extend("sap.ui.apouni.Component", {
	 metadata : {
	         name : "ApoUni App",
	         version : "1.0",
	 
			 rootView : "sap.ui.apouni.view.App",
			 
			 config : {
		         serviceConfig : {
		             name : "MyMockServer",
		             serviceUrl : "http://mymockserver/"
		         }
		     },
		     
		     routing: {
		    	 config : {
						routerClass : sap.ui.apouni.Router,
						viewType : "XML",
						viewPath : "sap.ui.apouni.view",
						targetAggregation : "detailPages",
						clearTarget : false
					},

					routes : [ {
						pattern : "", 
						name : "main",
						view : "Master",
						targetAggregation : "masterPages",
						targetControl : "idAppControl",
						subroutes : [ {
							pattern : "{product}/:tab:",
							name : "dealer",
							view : "Detail"
						} ]
					}, {
						name : "catchallMaster",
						view : "Master",
						targetAggregation : "masterPages",
						targetControl : "idAppControl",
						subroutes : [ {
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound"
						} ]
					} ]
		     }
	},
    
	init : function() {
		
		//get data from attributes above
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var mConfig = this.getMetadata().getConfig();

        //get service url
        var sServiceUrl = mConfig.serviceConfig.serviceUrl;
		
		// Setting Mock Server with sample data
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri : sServiceUrl,
		});
		
		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();
		
		// setting up model based on created metadata file
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		sap.ui.getCore().setModel(oModel);
		this.setModel(oModel);

		//device types
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None"
					: "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");

		//router initialization
		this.getRouter().initialize();
	},
});