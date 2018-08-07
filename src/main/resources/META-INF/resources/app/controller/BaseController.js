Ext.define('Drpnd.controller.BaseController', {
	extend : 'Ext.app.Controller'
   ,init   : function() {
	   this.control({
		   'categorypanel' : {
			   itemclick : this.onItemClick
   			}
   		});
   }
   ,onLaunch : function() {
	   this.contentPanel  = Ext.getCmp('app-contents');
	   this.categoryPanel = Ext.getCmp('app-category');
   }
   ,addContentTabPanel : function(id, title, cont, closable, tbar) {
	   var conf = {
			 id    : id + '-panel'
			,title : title
			,layout   : 'fit'
			,closable : (closable == undefined) ? true : closable
	   };

	   if(Ext.isString(cont)) {
		   conf.items = [{
			   autoScroll : true
			  ,html : cont
		   }];
	   }
	   else {
		   conf.items = [cont];
	   }

	   if(Ext.isArray(tbar)) {
		  conf.tbar = tbar;
	   };

	   (this.contentPanel  || Ext.getCmp('app-contents')).add(Ext.create('Ext.panel.Panel',conf));
	   (this.contentPanel  || Ext.getCmp('app-contents')).setActiveTab(id + '-panel');
	   (this.categoryPanel || Ext.getCmp('app-category')).addCategoryInTab(id);
   }
   ,addResultTabPanel : function(title, cont) {
	   this.resultPanel.removeAll();

	   var conf = {
			 id    : 'result-panel'
			,title : title
			,layout   : 'fit'
			,closable : false
	   };

	   if(Ext.isString(cont)) {
		   conf.items = [{
			   autoScroll : true
			  ,html : cont
		   }];
	   }
	   else {
		   conf.items = [cont];
	   }

	   this.resultPanel.add(Ext.create('Ext.panel.Panel',conf));
	   this.resultPanel.setActiveTab(0);
	   this.resultPanel.expand(true);
   }
});