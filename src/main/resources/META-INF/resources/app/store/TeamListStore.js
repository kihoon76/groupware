Ext.define('Drpnd.store.TeamListStore', {
	 extend : 'Ext.data.Store',
	 requires : ['Drpnd.util.CommonFn'],
	 config: {
		 pCode: '1'
	 },
	 proxy : {
	        type : 'ajax'
	       ,url :Drpnd.util.CommonFn.getFullUrl('code/team') //Drpnd.util.Constants.context + '/code/team'
	       ,actionMethods : 'POST'
	       ,reader : {
	           type : 'json'
	          ,root : 'datas'
	          ,totalProperty : 'total'
	       },
	       listeners: {
	    	   exception: function(proxy, response, operation, eOpts) {
	    		   console.log(response)
	    	   }
	       }
	  },
	  fields : ['teamCode', 'teamName'],
	  listeners: {
		  beforeload: function(store) {
			  store.getProxy().setExtraParam('pCode', this.getPCode()); 
		  }
	  }
	  //autoLoad : true,
});