Ext.define('Drpnd.view.panel.OverworkChartPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.overworkpanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var CommonFn = Drpnd.util.CommonFn;
		var dateObj = new Date();
		var currentYear = dateObj.getFullYear();
		var currentMonth = dateObj.getMonth();
		var yearNumField = null;
		var comboSel = null;
		var comboMonth = null;
		var teams = Ext.getBody().getAttribute('data-team');
		
		try {
			var teams = Ext.JSON.decode(teams);
		}
		catch(e) {}
		
		function getTeamColor(teamName) {
			if(teams) {
				var len = teams.length;
				for(var i=0; i<len; i++) {
					if(teamName == teams[i].teamName) {
						return teams[i].teamBackColor;
					}
				}
			} 
			
			return '';
		}
		
		var overworkStore = Ext.create('Drpnd.store.StatisticListStore');
		overworkStore.load({
			params: {
				searchYear: currentYear,
				searchMonth: currentMonth + 1
			}
		});
		
		function search() {
			var type = comboSel.getValue();
			var searchYear = yearNumField.getValue();
			
			if(type == 'm') {
				chart1.setVisible(true);
				chart2.setVisible(false);
				
				var searchMonth = comboMonth.getValue();
				
				overworkStore.load({
					params: {
						searchYear: searchYear,
						searchMonth: searchMonth
					}
				});
			}
			else if(type == 'tm') {
				chart1.setVisible(false);
				chart2.setVisible(true);
				
				tmOverworkStore.load({
					params: {
						searchYear: searchYear
					}
				});
			}
		}
		
		var chart1 = Ext.create('Ext.chart.Chart', {
			xtype: 'chart',
			width: 1000,
		    height: 800,
			animate: true,
			shadow: true,
			store: overworkStore,
			legend: {
				position: 'right'
			},
			axes: [{
				type: 'Numeric',
				position: 'bottom',
				fields: ['teamTotal', 'teamLeader', 'sawon1', 'sawon2', 'sawon3', 'sawon4'],
				minimum: 0,
				label: {
                    renderer: Ext.util.Format.numberRenderer('0,0')
                },
                grid: true,
                title: '야근시간(분)'
			},{
                type: 'Category',
                position: 'left',
                fields: ['teamName'],
                title: '도시계획부 팀'
            }],
            series: [{
                type: 'bar',
                axis: 'bottom',
                xField: 'teamName',
                tips: {
                    trackMouse: true,
                    width: 300,
                    height: 50,
                    renderer: function(storeItem, item) {
                    	var yField = item.yField;
                    	this.setTitle(storeItem.data[yField + '_tips']);
                    }
                },
                label: {
                	display: 'insideEnd',
                    field: ['teamTotal', 'teamLeader', 'sawon1', 'sawon2', 'sawon3', 'sawon4'],
                    renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horizontal',
                    color: '#333',
                    'text-anchor': 'middle'
                },
                yField: ['teamTotal', 'teamLeader', 'sawon1', 'sawon2', 'sawon3', 'sawon4'],
                title: ['팀별 총야근시간', '팀장', '팀원1', '팀원2', '팀원3', '팀원4'],
            }]
			
		});
		
		var tmOverworkStore = Ext.create('Drpnd.store.TeamMonthStatisticListStore');
		
		/*tmOverworkStore.load({
			params: {
				searchYear: currentYear
			}
		});*/
		
		Ext.chart.theme.myTheme = Ext.extend(Ext.chart.theme.Base, {
		    constructor: function(config) {
		        Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({      
		            //colors: ['#000000','#006400', '#9932cc','#CD0000','#0000ff','#FFD700','#828282'],
		            colors: [getTeamColor('계획1팀'), getTeamColor('계획2팀'), getTeamColor('계획3팀'), getTeamColor('계획4팀'), getTeamColor('계획5팀'), getTeamColor('계획6팀'), getTeamColor('e-biz팀')]
		        }, config));
		    }
		});
		
		var chart2 = Ext.create('Ext.chart.Chart',{
            xtype: 'chart',
            width: 1000,
		    height: 800,
		    theme: 'myTheme',
            animate: true,
            shadow: true,
            store: tmOverworkStore,
            hidden: true,
            legend: {
                position: 'right'
            },
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: [ '계획1팀', 
            	          '계획2팀', 
            	          '계획3팀',
            	          '계획4팀',
            	          '계획5팀',
            	          '계획6팀',
            	          'e-biz팀'],
                title: '야근시간(분)',
                grid: true,
                label: {
                    renderer: function(v) {
                        return v;//String(v).replace(/(.)00000$/, '.$1M');
                    }
                }
            }, {
                type: 'Category',
                position: 'left',
                fields: ['month'],
                title: false
            }],
            series: [{
                type: 'bar',
                axis: 'bottom',
                gutter: 80,
                xField: 'month',
                yField: ['계획1팀', 
           	          '계획2팀', 
        	          '계획3팀',
        	          '계획4팀',
        	          '계획5팀',
        	          '계획6팀',
        	          'e-biz팀'],
                stacked: true,
                tips: {
                    trackMouse: true,
                    width: 300,
                    height: 30,
                    renderer: function(storeItem, item) {
//                    	console.log(storeItem);
//                    	console.log(item);
                    	var timeMin = item.value[1];
                    	var timeHour = '0';
                    	
                    	if(timeMin > 0) {
                    		if(timeMin >= 60) {
                    			timeHour = parseInt(timeMin/60) + '시간 ' + (timeMin%60) + '분';
                    		}
                    		else {
                    			timeHour = timeMin + '분';
                    		}
                    	}
                    	
                        this.setTitle('[' + item.yField + '][' + item.value[0] + ']-' + item.value[1] + '/' + timeHour);
                    }
                },
            }]
        });
		
		var searchComboStore = Ext.create('Ext.data.Store', {
			 fields: ['name', 'value']
		});
		
		Ext.apply(this, {
			autoScroll: true,
			tbar:[{
				xtype: 'numberfield',
				value: currentYear,
				width: 100,
				editable: false,
				listeners: {
					afterrender: function(num) {
						yearNumField = num;
					}
				}
			},'년',{
				xtype: 'combobox',
				queryMode: 'local',
		    	displayField: 'name',
		    	valueField: 'value',
		    	editable: false,
		    	store: Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					data: [{name:'월간통계', value: 'm'}, {name:'팀별월간통계', value: 'tm'}, ]
				}),
				value: 'm',
				listeners: {
					afterrender: function(combo) {
						comboSel = combo;
					},
					change: function(c, nV) {
						if(nV == 'm') {
							comboMonth.setVisible(true);
						}
						else {
							comboMonth.setVisible(false);
						}
					}
				}
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
				value:currentMonth + 1,
				listeners: {
					afterrender: function(combo) {
						comboMonth = combo;
					}
				}
			},{
				xtype: 'button',
				iconCls: 'icon-search',
				text: '검색',
				listeners: {
					click: function(btn) {
						search();
					}
				}
			},{
				xtype: 'datefield',
				format: 'Y-m-d',
				editable: false,
				hidden: true
			}],
			items:[chart1, chart2]
		});
		
		this.callParent(arguments);
	}
});