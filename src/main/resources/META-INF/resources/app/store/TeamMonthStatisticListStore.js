Ext.define('Drpnd.store.TeamMonthStatisticListStore',  {
	extend: 'Ext.data.Store',
	requires: ['Drpnd.util.Constants', 'Drpnd.util.CommonFn'],
	proxy: {
		type: 'ajax'
	   ,url: Drpnd.util.Constants.context + '/statistic/overwork/teammonth'
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
	          'month', 
	          '계획1팀', 
	          '계획2팀', 
	          '계획3팀',
	          '계획4팀',
	          '계획5팀',
	          '계획6팀',
	          'e-biz팀',
	          '디자인팀'
	       ],
	autoLoad : false
});