Ext.define('Drpnd.store.PagingSize', {
	 extend   : 'Ext.data.Store'
    ,fields   : ['name', 'value']
    ,data     : [
         {'name' : '10', 'value' : '10'}
        ,{'name' : '20', 'value' : '20'}
        ,{'name' : '30', 'value' : '30'}
        ,{'name' : '40', 'value' : '40'}
        ,{'name' : '50', 'value' : '50'}
        ,{'name' : '100', 'value' : '100'}
    ]
});