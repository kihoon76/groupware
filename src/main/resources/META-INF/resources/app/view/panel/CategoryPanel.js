Ext.define('Drpnd.view.panel.CategoryPanel', {
	 extend      : 'Ext.tree.Panel'
    ,alias       : 'widget.categorypanel'
    //,uses        : ['Hotplace.util.Constants']
    ,title       : '카테고리'
    ,initComponent : function() {
    	var addedCategoryMap = {};
    	var teamList = Ext.getBody().getAttribute('data-team');
    	var teamJson = teamList ? Ext.decode(teamList) : '';
    	var treeItems = [{
			 text: '근태관리', expand: true, iconCls : 'tree-expand'
			,children : [{
				text: '근태리스트', leaf : true, cate : 'guntae', id : 'cate-guntae-list'
			}]
    	},{
			 text: '사원관리', expand: true, iconCls : 'tree-expand'
			,children : [{
				text: '사원리스트', leaf : true, cate : 'sawon', id : 'cate-sawon-list'
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
    					cate: 'team'
    				});
        		}
    			
    			treeItems.push(item);
    		}
    	}
    	
    	Ext.apply(this, {
    		 store : Ext.create('Ext.data.TreeStore', {
    	    	 root : {
    	    		  expanded : true
					 ,children : treeItems/*[{
						 text: '근태관리', expand: true, iconCls : 'tree-expand'
						,children : [{
							text: '근태리스트', leaf : true, cate : 'guntae', id : 'cate-guntae-list'
						}]
					 }, {
						 text: '<span style="color:red; background:#0000ff;">사원관리</span>', expand: true, iconCls : 'tree-expand'
						,children : [{
							text: '사원리스트', leaf : true, cate : 'sawon', id : 'cate-sawon-list'
						}]
					 }, {
						 text: '팀목록', expand: true, iconCls : 'tree-expand'
						,children : [{
							text: '사원리스트', leaf : true, cate : 'sawon', id : 'cate-sawon-list'
						}]
					 }]*/
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
    	    	   console.log(n)
    	    	   n.set('iconCls', 'tree-collapse');
    	       }
    	    }
    	});

    	this.callParent(arguments);
    }
});