$(document).ready(function() {
	var datascource = {
		id: 'orgchart', // It's a optional property which will be used as id attribute of node
		// and data-parent attribute, which contains the id of the parent node
		collapsed: false, // By default, the children nodes of current node is hidden.
		//className: 'team1', // It's a optional property which will be used as className attribute of node.
		position: '대표이사',
		team: 'imwon',
		leader: 'N',
		name: '이석우',
		  //'relationship': relationshipValue, // Note: when you activate ondemand loading nodes feature,
		  // you should use json datsource (local or remote) and set this property.
		  // This property implies that whether this node has parent node, siblings nodes or children nodes.
		  // relationshipValue is a string composed of three "0/1" identifier.
		  // First character stands for wether current node has parent node;
		  // Scond character stands for wether current node has siblings nodes;
		  // Third character stands for wether current node has children node.
		children: [ // The property stands for nested nodes.
		    { position: '전무', name: '유명소', 'relationship': '111', team: 'imwon', leader: 'N',
		    	children: [
		    	   {position: '부장', name: '전진석', 'relationship': '101', team: 'team1', leader: 'Y',
		    		   children: [
		    		       {position: '대리', name: '이은지', 'relationship': '101', team: 'team1', leader: 'N',
		    		    	  children: [{position: '사원', name: '이지훈', 'relationship': '101', team: 'team1', leader: 'N'}]   
		    		       }
		    		   ]
		    	   },
		    	   {position: '부장', name: '김나영', 'relationship': '101', team: 'team2', leader: 'Y',
		    		   children: [
		    		       {position: '대리', name: '서현민', 'relationship': '101', team: 'team2', leader: 'N',
		    		    	  children: [{position: '사원', name: '유남규', 'relationship': '100', team: 'team2', leader: 'N'}]   
		    		       }       
		    		   ]   
		    	   }
		    		
		    	] },
		    { position: '상무', name: '김진기', 'relationship': '111', team: 'imwon', leader: 'N',
		        children: [
		           {position: '차장', name: '송남이', 'relationship': '101', team: 'team3', leader: 'Y',
		        	   children: [
		        	       {position: '대리', name: '박승석', 'relationship': '101', team: 'team3', leader: 'N',
	        	    		   children: [
	        	    		       {position: '사원', name: '이지혜', 'relationship': '101', team: 'team3', leader: 'N',
	        	    		    	   children: [{position: '사원', name: '이가영', relationship: '100', team: 'team3', leader: 'N'}]
	        	    		       }
	        	    		   ]
		        	       }
		        	   ]   
		           },
		           {position: '과장', name: '박미혜', 'relationship': '101', team: 'team4', leader: 'Y',
		        	   children: [{position: '사원', name: '강상훈', 'relationship': '101', team: 'team4', leader: 'N',
		        		  children: [{position: '사원', name: '정다운', 'relationship': '100', team: 'team4', leader: 'N'}] 
		        	   }]   
		           }
		      ]
		    },
		    {position: '이사', name: '한승철', 'relationship': '110', team: 'imwon', leader: 'N',
		       children: [{position: '차장', name: '남궁지현', 'relationship': '101', team: 'team5', leader: 'Y',
		    	   children: [{position: '대리', name: '김성재', 'relationship': '101', team: 'team5', leader: 'N',
		    		  children: [{position: '사원', name: '김현호', 'relationship': '100', team: 'team5', leader: 'N'}]   
		    	   }]   
		       }, {position: '과장', name: '박민지', 'relationship': '101', team: 'team6', leader: 'Y',
		    	   children: [{position: '사원', name: '김유석', 'relationship': '101', team: 'team6', leader: 'N', 
		    		   children:[{position: '사원', name: '김지혜', 'relationship': '100', team: 'team6', leader: 'N'}]
		    	   }]   
		       }]	
		    },
		    {position: '', name: '&nbsp', relationship: '110', team: 'imwon', leader: 'N',
		    	children: [{position: '주임', name: '김정아', 'relationship': '101', team: 'design', leader: 'Y'}]	
			},
		    {position: '실장', name: '박화숙', 'relationship': '110', team: 'imwon', leader: 'N'},
		    
		  ],
	};
	
	function nodeTemplate(data) {
		var v = '';
		if(data.team == 'imwon') {
			return '<div class="imwon">' + data.name + '</div>';
		}
		else {
			if(data.leader == 'Y') {
				return '<span class="' + data.team + '_title">' + getTeamName(data.team) + '</span><div style="height: 10px;"></div>' +
					   '<div class="' + data.team + '">' + data.name + '</div>';
			}
			else {
				return '<div class="' + data.team + '">' + data.name + '</div>';
			}
		}
	}
	
	function getTeamName(team) {
		var t = '';
		switch(team) {
		case 'team1':
			t = '계획1팀';
			break;
		case 'team2':
			t = '계획2팀';
			break;
		case 'team3':
			t = '계획3팀';
			break;
		case 'team4':
			t = '계획4팀';
			break;
		case 'team5':
			t = '계획5팀';
			break;
		case 'team6':
			t = '계획6팀';
			break;
		case 'ebiz':
			t = 'e-biz팀';
			break;
		case 'design':
			t = '디자인팀';
			break;
		default :
			t = '';
			break;
				
		}
		
		return t;
	}
	
	$('#chart-container').orgchart({
		data : datascource,
		nodeTitle: 'position',
		nodeContent: 'name',
		parentNodeSymbol: '',
		nodeTemplate: nodeTemplate,
		toggleSiblingsResp: false,
	});
});