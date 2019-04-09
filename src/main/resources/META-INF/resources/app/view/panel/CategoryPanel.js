Ext.define('Drpnd.view.panel.CategoryPanel', {
	 extend      : 'Ext.tree.Panel'
    ,alias       : 'widget.categorypanel'
    //,uses        : ['Hotplace.util.Constants']
    ,title       : '카테고리'
    ,initComponent : function() {
    	var addedCategoryMap = {};
    	var teamList = Ext.getBody().getAttribute('data-team');
    	var mygyeoljaeCount = Ext.getBody().getAttribute('data-gyeoljae-count');
    	var teamJson = teamList ? Ext.decode(teamList) : '';
    	var treeItems = [{
    		text: '조직도', leaf : true, cate : 'system', id: 'system-list', iconCls: 'icon-organization'
    	}, {
    		text: '회사행사', leaf : true, cate : 'company', id: 'company-event', iconCls: 'icon-company-calendar'
    	}, {
    		text: '문서보관', expand: true, iconCls : 'tree-expand',
    		children: [{
    			text: '일반문서', leaf : true, cate : 'docs', id : 'docs-normal', iconCls: 'icon-docs'
    		}]
    	}];
    	
    	if(teamJson) {
    		var len = teamJson.length;
    		
    		if(len > 0) {
    			var item = {
    				text: '팀목록',
    				expand: true,
    				iconCls : 'tree-expand',
    				children: []
    			}
    			
    			for(var i=0; i<len; i++) {
    				item.children.push({
    					text: '<span style="color:' + teamJson[i].teamFontColor + ';background:' + teamJson[i].teamBackColor + ';">' + teamJson[i].teamName + '</span>',
    					leaf: true,
    					cate: 'team',
    					iconCls: 'icon-team'
    				});
        		}
    			
    			treeItems.push(item);
    		}
    	}
    	
    	treeItems.push({
			 text: '통계', expand: true, iconCls : 'tree-expand'
			,children : [{
				text: '야근', leaf : true, cate : 'statistics', id : 'statistics-overwork', iconCls: 'icon-bars-chart'
			}]
    	});
    	
    	treeItems.push({
    		 tabText: '결재', text: '결재(<span id="spTreeMyGyeoljae" style="color:#ff0000;">' + mygyeoljaeCount + '</span>)', leaf : true, cate : 'gyeoljae', id: 'gyeoljae', iconCls: 'icon-approve'
    	});
    	
    	treeItems.push({
	   		 text: '프로젝트', leaf : true, cate : 'project', id: 'project', iconCls: 'icon-project'
	   	});
    	
    	Ext.apply(this, {
    		 store : Ext.create('Ext.data.TreeStore', {
    	    	 root : {
    	    		  expanded : true
					 ,children : treeItems
    	    	 }
    	    })
    	    ,rootVisible : false
    	    ,isAttachedCategory : function(id) {
     	 	   return addedCategoryMap[id] != null;
     	    }
     	    ,addCategoryInTab : function(id) {
     	    	addedCategoryMap[id] = 'Y';
     	    }
     	    ,rmCategoryInTab : function(id) {
     	    	delete addedCategoryMap[id];
     	    }
     	    ,rmAllInTab : function() {
     	    	//addedCategoryMap = {};
     	    	addedCategoryMap = {};
     	    	addedCategoryMap['cate-main-panel'] = 'Y';
     	    }
    	    ,listeners : {
    	    	itemexpand : function(n, opt) {
    	    		n.set('iconCls', 'tree-expand');
    	    	}
    	       ,itemcollapse : function(n, opt) {
    	    	   n.set('iconCls', 'tree-collapse');
    	       },
    	       afterrender: function(tree) {
    	    	   tree.expandAll();
    	       }
    	    }
    	});

    	this.callParent(arguments);
    },
    /*updateTreeView : function(tree, fn) {
        var view = tree.getView();
        view.getStore().loadRecords(fn(tree.getRootNode()));
        view.refresh();
    },
    collapseAll : function(tree) {
        this.updateTreeView(tree, function(root) {
            root.cascadeBy(function(node) {
                if (!node.isRoot() || tree.rootVisible) {
                    node.data.expanded = false;
                }
            });
            return tree.rootVisible ? [root] : root.childNodes;
        });
    },
    expandAll : function(tree) {
        this.updateTreeView(tree, function(root) {
            var nodes = [];
            root.cascadeBy(function(node) {
                if (!node.isRoot() || tree.rootVisible) {
                    node.data.expanded = true;
                    nodes.push(node);
                }
            });
            return nodes;
        });
    }*/
});