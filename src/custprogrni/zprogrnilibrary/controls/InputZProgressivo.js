sap.ui.define(['jquery.sap.global',
    "sap/ui/model/json/JSONModel",
		'./../library',
		"sap/m/Input",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/layout/form/SimpleForm",
		"sap/ui/model/resource/ResourceModel",
    'sap/ui/core/Fragment'
	],
	function(jQuery, JSONModel,library, Input, Filter, FilterOperator, SimpleForm, ResourceModel, Fragment) {
		"use strict";

    const MODEL_ENTITY = "EntityModel";
    var InputZProgressivo = Input.extend("custprogrni.zprogrnilibrary.controls.InputZProgressivo", {
			metadata: {
				library: "custprogrni.zprogrnilibrary",
				properties: {
					placeholder: {
						type: "string",
						defaultValue: ""
					},
          bukrs: { type: "string", defaultValue: "" },
          esercizio: { type: "Number", defaultValue: "" },
          amministrazione: { type: "string", defaultValue: "" },
          ragioneria: { type: "string", defaultValue: "" },
          capitolo: { type: "string", defaultValue: "" },
          oggettoSpesa: { type: "string", defaultValue: "" },
          progressivo: {type:"Number", defaultValue: "" },
          value: { type: "string", defaultValue: "" }, // progressivo ZID_NI 
          role: { type: "string", defaultValue: "" },
          fikrs:{ type: "string", defaultValue: "" },
          prctr:{ type: "string", defaultValue: "" },
          
          key:{ type: "string", defaultValue:"" },
          showValueHelp:{ type:"string", defaultValue:"true" },
          maxLength:{ type:"string", defaultValue:"20" }
				},
				aggregations: {},
				events: {},
				renderer: {
					writeInnerAttributes: function(oRm, oInput) {
						sap.m.InputRenderer.writeInnerAttributes.apply(this, arguments);
					}
				}
			},

      init: function() {
        var self=this;
				// this.bRendering = false;
				Input.prototype.init.call(this);  
        self.attachValueHelpRequest(self._libOnShowProgrDialog);  
        self.attachSubmit(self._libOnSubmitProgressivo);  
			},

      _libOnSubmitProgressivo:function(oEvent){
        var self =this;
        if(!self.getValue() || self.getValue() === null || self.getValue()===""){
          self.setValue(null);
          self.setKey(null);  
        }
      },

			renderer: function(oRm, oInput) {
				sap.m.InputRenderer.render(oRm, oInput);
			},

      onAfterRendering: function() {
        var self =this;
      },

      _libOnShowProgrDialog:function(oEvent){
        var self =this;
        var oModelJson = new JSONModel({
          PanelFilterVisible:true,
          PanelContentVisible:false,
          Bukrs:self.getBukrs() && self.getBukrs() !=="" ? self.getBukrs() : null,
          Esercizio:self.getEsercizio() && self.getEsercizio() !=="" ? self.getEsercizio() : null,
          Amministrazione: self.getAmministrazione() && self.getAmministrazione() !=="" ? self.getAmministrazione() : null,
          Ragioneria:self.getRagioneria() && self.getRagioneria() !=="" ? self.getRagioneria() : null,
          Capitolo:self.getCapitolo() && self.getCapitolo() !=="" ? self.getCapitolo() : null, 
          OggettoSpesa:self.getOggettoSpesa() && self.getOggettoSpesa() !=="" ? self.getOggettoSpesa() : null, 
          Progressivo:self.getProgressivo() && self.getProgressivo() !=="" ? self.getProgressivo() : null, 
          // Progressivo:self.getValue() && self.getValue() !=="" ? self.getValue() : null, 
          Results:[]
        });

        self._libGetViewId(self,function(callback) {
          if(!self._libProgrDialog){
            self._libProgrDialog = Fragment.load({
              id: callback.Id,
              name: "custprogrni.zprogrnilibrary._libProgrDialog",
              controller: self
            }).then(function(oDialog){
              return oDialog;
            }.bind(this));
          }  
          self._libProgrDialog.then(function(oDialog){
            oDialog.setModel(oModelJson, MODEL_ENTITY);
            oDialog.open();
          });
        });
      },

      _libOnCloseProgrDialog:function(oEvent){
        var self = this;
        self._libProgrDialog.then(function(oDialog){
          oDialog.close();
          oDialog.destroy();
          self._libProgrDialog=null;
        });
      },

      _libOnSearchProgrDialog:function(oEvent){
        var self = this,
          filters = [],  
          entity = oEvent.getSource().getParent().getModel(MODEL_ENTITY),
          model = oEvent.getSource().getParent().getModel(MODEL_ENTITY).getData();

          self._globalModelHelperHelper = new sap.ui.model.odata.v2.ODataModel({
            // serviceUrl: "/sap/opu/odata/sap/ZS4_NOTEIMPUTAZIONI_SRV/"
            serviceUrl: "/sap/opu/odata/sap/ZSS4_MATCHCODE_SRV/"
          });

          if(model.Bukrs && model.Bukrs !== "")
            filters.push(new Filter({path: "Bukrs",operator: FilterOperator.EQ,value1: model.Bukrs}));

          if(model.Esercizio && model.Esercizio !== "")
            filters.push(new Filter({path: "Gjahr",operator: FilterOperator.EQ,value1: model.Esercizio}));  
          
          if(model.Amministrazione && model.Amministrazione !== "")
            filters.push(new Filter({path: "Zamministr",operator: FilterOperator.EQ,value1: model.Amministrazione}));  

          if(model.Ragioneria && model.Ragioneria !== "")
            filters.push(new Filter({path: "ZRagioCompe",operator: FilterOperator.EQ,value1: model.Ragioneria}));  

          if(model.Progressivo && model.Progressivo !== "")
            filters.push(new Filter({path: "ZidNi",operator: FilterOperator.EQ,value1: model.Progressivo}));
          
          if(model.Capitolo && model.Capitolo !== "")
            filters.push(new Filter({path: "Zcapitolo",operator: FilterOperator.EQ,value1: model.Capitolo}));

          if(model.OggettoSpesa && model.OggettoSpesa !== "")
            filters.push(new Filter({path: "ZoggSpesa",operator: FilterOperator.Contains,value1: model.OggettoSpesa.toUpperCase()}));
          
          // console.log(self._globalModelHelperHelper);
          var oDataModel = self._globalModelHelperHelper;

          if(self._libProgrDialog){
            self._libProgrDialog.then(function(oDialog){
              
            oDialog.setBusy(true);
            self._globalModelHelperHelper.metadataLoaded().then(function() {
              oDataModel.read("/ZhfNotabozzaSet" , {
                  filters: filters,   
                  urlParameters: { 
                    AuthorityRole: self.getRole(),
                    AuthorityFikrs: self.getFikrs(),
                    AuthorityPrctr: self.getPrctr(),
                  }, 
                  success: function(data, oResponse){
                    // console.log(data);
                    entity.setProperty("/Results",data.results);
                    entity.setProperty("/PanelFilterVisible",false);
                    entity.setProperty("/PanelContentVisible",true);
                    oDialog.setBusy(false);
                },
                error: function(error){
                  oDialog.setBusy(false);
                  console.log(error);
                }
              });
            });
          });
        }  
        
      },

      _libOnConfirmProgrDialog:function(oEvent){
        var self =this;
        self._libGetViewId(self,function(callback) {
          var oView = callback.oView;
          var table = oView.byId("_libTableProgressivo");
          var selectedItem = table.getSelectedItem();
          
          var key = selectedItem.data("ZchiaveNi");
          var text = selectedItem.data("ZchiaveNi");

          self.setKey(key);  
          self.setValue(text);
          
          if(self._libProgrDialog){
            self._libProgrDialog.then(function(oDialog){
              oDialog.close();
              oDialog.destroy();
              self._libProgrDialog=null;
            });
          }
        });
      },

      _libOnBackProgrDialog:function(oEvent){
        var self = this,
          entity = oEvent.getSource().getParent().getModel(MODEL_ENTITY);
        entity.setProperty("/Results",[]);
        entity.setProperty("/PanelFilterVisible",true);
        entity.setProperty("/PanelContentVisible",false);
      },

      _libGetViewId:function(context,callback){
        var self =this;
        while (context && context.getParent) {
          var oParentControl = context.getParent();
          if (oParentControl instanceof sap.ui.core.mvc.View) {
            var viewId = oParentControl.getId();
            var oView = sap.ui.getCore().byId(viewId);
            // console.log(oView);//TODO:da canc
            callback({Id : viewId, oView: oView});
            break;
          }
          context = oParentControl;
        }
      }
    });   

    return InputZProgressivo;
  });