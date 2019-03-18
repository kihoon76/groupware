Ext.define('Drpnd.store.WeekendStatisticListStore',  {
	extend: 'Ext.data.Store',
	requires: ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	proxy: {
		type: 'ajax'
	   ,url: Drpnd.util.Constants.context + '/statistic/overwork/weekend'
	   ,actionMethods: 'POST'
	   ,reader: {
		   type: 'json'
	      ,root: 'datas'
	   }
	   ,listeners: {
		   exception: function(proxy, response, operation, eOpts) {
			   Drpnd.util.CommonFn.redirectStoreAjax(response);
		   }
	   },
	},
	fields : [
	          'teamName', 
	          'teamTotal', 
	          'teamTotal_tips', 
	          'teamLeader',
	          'teamLeader_tips',
	          'sawon1', 
	          'sawon1_tips', 
	          'sawon2',
	          'sawon2_tips', 
	          'sawon3', 
	          'sawon3_tips', 
	          'sawon4', 
	          'sawon4_tips', 
	          'sawon5',
	          'sawon5_tips'],
	autoLoad : false
});