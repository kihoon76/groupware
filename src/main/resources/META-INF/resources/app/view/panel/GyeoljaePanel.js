Ext.define('Drpnd.view.panel.GyeoljaePanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gyeoljaepanel',
	requires:['Drpnd.util.CommonFn'],
	initComponent: function() {
		var CommonFn = Drpnd.util.CommonFn;
		
		var itemObj = {};
		var that = this;
		
		var btnOverview = null;
		var btnReceiveBox = null;
		var btnSansinBox = null;
		var btnKeepBox = null;
		var btnNewGyeoljae = null;
		var divModGyeoljae = null;
		var activeColor = '#ccffff';
		var overviewWin = null;
		var receivedWin = null;
		var sangsinWin = null;
		var keepboxWin = null;
		var newGyeoljaeWin = null;
		var modGyeoljaeWin = null;
		
		function activeButtonCSS(activeBtn) {
			if(activeBtn == 'OVERVIEW') {
				btnOverview.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnOverview.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'RECEIVE_BOX') {
				btnReceiveBox.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnReceiveBox.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'SANGSIN_BOX') {
				btnSansinBox.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnSansinBox.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'KEEP_BOX') {
				btnKeepBox.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnKeepBox.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'NEW_GYEOLJAE') {
				btnNewGyeoljae.getEl().setStyle('background-color', activeColor);
			}
			else {
				btnNewGyeoljae.getEl().setStyle('background-color', 'transparent');
			}
			
			if(activeBtn == 'UPDATE_GYEOLJAE') {
				divModGyeoljae.setStyle('background-color', activeColor);
			}
			else {
				divModGyeoljae.setStyle('background-color', 'transparent');
			}
			
		}
		
		function clearItems() {
			var record = that.items.items;
			var recordLen = record.length;
			
			if(recordLen == 1) {
				var r = record[0];
				record.remove(r);
			}
		}
		
		function addItem(obj) {
			clearItems();
			that.add(obj);
			rerender();
		}
		
		function rerender() {
			that.update();
			that.doLayout();
		}
		
		//새결재
		function newGyeoljaeClick() {
			activeButtonCSS('NEW_GYEOLJAE');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/new', load: function(dom) {
					newGyeoljaeWin = dom.contentWindow;
					newGyeoljaeWin.setGyeoljaePanel(that);
				} });
				addItem(iframe);
			});
		}
		
		//요약
		function overviewClick(isNotSessionCheck) {
			activeButtonCSS('OVERVIEW');
			var mask = null;//new Ext.LoadMask(Ext.getBody(), {msg: '수신함을 로딩중입니다.'});
			//mask.show();
			if(isNotSessionCheck) {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/overview', load: function(dom) {
					overviewWin = dom.contentWindow; 
					overviewWin.setGyeoljaeButton(btnReceiveBox, btnSansinBox, btnKeepBox, divModGyeoljae, mask);
				} });
				addItem(iframe);
			}
			else {
				CommonFn.checkSession(function() {
					var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/overview', load: function(dom) {
						overviewWin = dom.contentWindow;
						overviewWin.setGyeoljaeButton(btnReceiveBox, btnSansinBox, btnKeepBox, divModGyeoljae, mask);
					} });
					addItem(iframe);
				});
			}
		}
		
		//수신함
		function receiveBoxClick() {
			activeButtonCSS('RECEIVE_BOX');
			var mask = null;//new Ext.LoadMask(Ext.getBody(), {msg: '수신함을 로딩중입니다.'});
			//mask.show();
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/receivedbox', load: function(dom) {
					receivedWin = dom.contentWindow;
					receivedWin.setParam(mask);
				} });
				addItem(iframe);
			});
		}
		
		//상신함
		function sangsinBoxClick() {
			activeButtonCSS('SANGSIN_BOX');
			var mask = null;//new Ext.LoadMask(Ext.getBody(), {msg: '상신함을 로딩중입니다.'});
			//mask.show();
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/sangsinbox', load: function(dom) {
					sangsinWin = dom.contentWindow;
					sangsinWin.setParam(divModGyeoljae, mask);
				} });
				addItem(iframe);
			});
		}
		
		//보관함
		function keepBoxClick() {
			activeButtonCSS('KEEP_BOX');
			var mask = null;//new Ext.LoadMask(Ext.getBody(), {msg: '보관함을 로딩중입니다.'});
			//mask.show();
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/keepbox', load: function(dom) {
					keepboxWin = dom.contentWindow;
					keepboxWin.setParam(mask);
				} });
				addItem(iframe);
			});
		}
		
		//결재수정
		function modGyeoljaeClick(sangsinNum) {
			activeButtonCSS('UPDATE_GYEOLJAE');
			CommonFn.checkSession(function() {
				var iframe = Ext.create('Drpnd.view.iframe.BaseIframe', { url: 'gyeoljae/view/mod/mysangsin/' + sangsinNum, load: function(dom) {
					modGyeoljaeWin = dom.contentWindow;
					modGyeoljaeWin.setGyeoljaeButton(that, btnSansinBox);
				} });
				addItem(iframe);
			});
		}
		
		Ext.apply(this, {
			items: itemObj,
			layout: 'fit',
			tbar: [{
				xtype: 'button',
				text: '요약',
				iconCls: 'icon-gyeoljae-overview',
				qtip: '★ 상신함,수신함 최근 5개만 요약해서 보여줍니다.<br/>★ 전체 항목이나 검색기능은 각각 보관함에서 가능합니다.',
				listeners: {
					click: function(btn) {
						overviewClick();
					},
					afterrender: function(btn) {
						btnOverview = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1,
		                    cls: 'qBodyStyle'
		                });
					}
				}
			}, '-', {
				xtype: 'button',
				text: '수신함',
				qtip: '★ 내가 결재해야 할 기안 보관함',
				iconCls: 'icon-gyeoljae-receive',
				listeners: {
					click: function() {
						receiveBoxClick();
					},
					afterrender: function(btn) {
						btnReceiveBox = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1,
		                    cls: 'qBodyStyle'
		                });
					}
				}
			}, '-', {
				xtype: 'button',
				text: '상신함',
				qtip: '★ 내가 올린 기안 보관함',
				iconCls: 'icon-gyeoljae-sangsin',
				listeners: {
					click: function() {
						sangsinBoxClick();
					},
					afterrender: function(btn) {
						btnSansinBox = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1,
		                    cls: 'qBodyStyle'
		                });
					}
					
				}
			}, '-', {
				xtype: 'button',
				text: '보관함',
				iconCls: 'icon-gyeoljae-keepbox',
				qtip: '★ 결재완료된 모든 사원의 기안 보관함',
				listeners: {
					click: function() {
						keepBoxClick();
					},
					afterrender: function(btn) {
						btnKeepBox = btn;
					},
					render: function(c) {
						Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1,
		                    cls: 'qBodyStyle'
		                });
					}
				}
			}, '-', {
				xtype: 'button',
				text: '새결재',
				iconCls: 'icon-gyeoljae-new',
				listeners: {
					click: function(btn) {
						newGyeoljaeClick();
					},
					afterrender: function(btn) {
						btnNewGyeoljae = btn;
					}
				}
			}, '-', {
				xtype: 'component',
				qtip: '★ 직접선택이 불가합니다.<br/>★ 요약 또는 상신함에서 수정버튼을 눌러주세요.',
		        renderTpl: '<div class="icon-modi" style="height:16px;font-size:12px;padding-left:23px;font-weight: normal;color:#333 !important;">결재수정</div>',
		        listeners: {
		        	render: function(c) {
		        		divModGyeoljae = c.getEl();
		        		divModGyeoljae.on({
		        			click: function(e,t,opt) {
		        				var sangsinNum = t.getAttribute('data-sangsin');
		        				
		        				if(sangsinNum != null) {
		        					t.removeAttribute('data-sangsin');
		        					modGyeoljaeClick(sangsinNum);
		        				}
		        				
		        			}
		        		});
		        		
		        		Ext.QuickTips.register({
		                    target: c.getEl(),
		                    text: c.qtip,
		                    showDelay: 1,
		                    cls: 'qBodyStyle'
		                });
		        	},
		        }
			}],
			listeners: {
				afterrender: function() {
					overviewClick();
				}
			}
		});
		
		this.callParent(arguments);
	}
});