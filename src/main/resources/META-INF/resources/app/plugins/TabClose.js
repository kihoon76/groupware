Ext.define('Drpnd.plugins.TabClose', {
	uses : ['Drpnd.util.GlobalObj'],
	init : function(tp) {
		tp.on('afterrender', function(t){
			var closeMenu = Drpnd.util.GlobalObj.tabCloseMenu;
			var tabBar    = t.getTabBar();
			var tbarId    = tabBar.getId();
			var categoryPanel = Ext.getCmp('app-category');
			var clickedTabIndex = -1;

			closeMenu.on('click', function(menu, item) {
	    		switch(item.itemId) {
	    		case 'currentClose' :
	    			getRemoveEl(clickedTabIndex);
	    			break;
	    		case 'closeAll' :
	    			//tp.removeAll();
	    			removeAll();
	    			categoryPanel.rmAllInTab();
	    			break;
	    		case 'closeOthers' :
	    			removeOthers(clickedTabIndex);
	    			break;
	    		}
			});


			var getIndex = function(id) {
				var tabsEm = Ext.query('div[id=' + tbarId + '] em');
				var len = tabsEm.length;
				var idx = -1;
				var id = id.substr(0, id.lastIndexOf('-'));

				for(var i = 0; i < len; i++) {
					if(tabsEm[i].id == id + '-btnWrap') {
						idx = i;
						break;
					}
				}

				return idx;
			};

			var removeOthers = function(currentIndex) {
				var els = [];
				for(var x = 2, count = tp.items.getCount(); x < count; x++) {
					if(x != currentIndex) els.push(tp.items.getAt(x));
				}

				for(var r = 0, l = els.length; r < l; r++) {
					tp.remove(els[r]);
				}
			};

			var getRemoveEl = function(idx) {
				tp.remove(tp.items.getAt(idx));
			};
			
			var removeAll = function() {
				var len = tp.items.getCount();
				if(len > 2) {
					for(var t=len-1; t>=2; t--) {
						getRemoveEl(t);
					}
				}
			}

			t.getTabBar().getEl().on('contextmenu', function(e, h){
				e.preventDefault();
				//탭이외의 부분을 우클릭시 무시
				//A : 닫기버튼 영역
				if(h.nodeName == 'DIV' || h.nodeName == 'A') return false;

				clickedTabIndex = getIndex(h.id);
				
				if(clickedTabIndex <= 1) return;
				closeMenu.showAt(e.getXY());
			});
		});
	}
});