Ext.define('Drpnd.view.panel.OverworkChartPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.overworkpanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var CommonFn = Drpnd.util.CommonFn;
		var dateObj = new Date();
		var currentYear = dateObj.getFullYear();
		var currentMonth = dateObj.getMonth();
		
		function generateData(n, floor){
	        var data = [],
	            p = (Math.random() *  11) + 1,
	            i;
	            
	        floor = (!floor && floor !== 0)? 20 : floor;
	        
	        for (i = 0; i < (n || 6); i++) {
	            data.push({
	                name: '계획' + (i + 1) + '팀',
	                data1: Math.floor(Math.max((Math.random() * 100), floor)),
	                data2: Math.floor(Math.max((Math.random() * 100), floor)),
	                data3: Math.floor(Math.max((Math.random() * 100), floor)),
	                data4: Math.floor(Math.max((Math.random() * 100), floor)),
	                data5: Math.floor(Math.max((Math.random() * 100), floor)),
	                data6: Math.floor(Math.max((Math.random() * 100), floor)),
	                data7: Math.floor(Math.max((Math.random() * 100), floor)),
	                data8: Math.floor(Math.max((Math.random() * 100), floor)),
	                data9: Math.floor(Math.max((Math.random() * 100), floor))
	            });
	        }
	        return data;
	    };
	    
		var store = Ext.create('Ext.data.JsonStore', {
			fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
	        data: generateData()
		});
		
		var chart = Ext.create('Ext.chart.Chart', {
			xtype: 'chart',
			width: 800,
		    height: 800,
			animate: true,
			shadow: true,
			store: store,
			legend: {
				position: 'right'
			},
			axes: [{
				type: 'Numeric',
				position: 'bottom',
				fields: ['data1', 'data2', 'data3', 'data4'],
				minimum: 0,
				label: {
                    renderer: Ext.util.Format.numberRenderer('0,0')
                },
                grid: true,
                title: '야근시간'
			},{
                type: 'Category',
                position: 'left',
                fields: ['name'],
                title: '도시계획부 팀'
            }],
            series: [{
                type: 'bar',
                axis: 'bottom',
                xField: 'name',
                yField: ['data1', 'data2', 'data3', 'data4']
            }]
			
		});
		
		var searchComboStore = Ext.create('Ext.data.Store', {
			 fields: ['name', 'value']
		});
		
		Ext.apply(this, {
			tbar:[{
				xtype: 'numberfield',
				value: currentYear,
				width: 100,
				editable: false
			},'년',{
				xtype: 'combobox',
				queryMode: 'local',
		    	displayField: 'name',
		    	valueField: 'value',
		    	editable: false,
		    	store: Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					data: [{name:'월간통계', value: 'm'}]
				}),
				value: 'm'
			},{
				xtype: 'combobox',
				queryMode: 'local',
				width: 100,
		    	displayField: 'name',
		    	valueField: 'value',
		    	editable: false,
		    	store: Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					data: CommonFn.getMonthComboData()
				}),
				value:currentMonth + 1
			},{
				xtype: 'button',
				iconCls: 'icon-search',
				text: '검색'
			},{
				xtype: 'datefield',
				format: 'Y-m-d',
				editable: false,
				hidden: true
			}],
			items:[chart]
		});
		
		this.callParent(arguments);
	}
});