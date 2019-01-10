Ext.define('Drpnd.store.StatisticListStore',  {
	extend: 'Ext.data.Store',
	requires: ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	proxy: {
		type: 'ajax'
	   ,url: Drpnd.util.Constants.context + '/statistic/overwork'
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
	fields : ['authNum', 'authName', 'authNameKor', 'description'],
	autoLoad : false
});