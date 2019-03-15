$(document).ready(function() {
	var $dvUpload = $('#fileuploader');
	var drawed = false;
	function isCanvasBlank(canvas) {
	    var ctx = canvas.getContext('2d');
	    var data = ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height).data;
	    return !Array.prototype.some.call(data, function(p){return p>0;});
	}
	
	$('#btnClear').off('click').on('click', function() {drawed = false;});
	
	
	$('#smoothed').signaturePad({
		drawOnly:true, 
		drawBezierCurves:true, 
		lineTop:200, 
		penWidth : 5,
		bgColour : 'transparent',
		onDrawEnd: function() {
			drawed = true;
		}
	});
	 
//	 $('#fileuploader').uploadFile({
//		 fileName: 'sign'
//	 });
	 
	window.regSignature = function(win) {
		 /*$dvUpload.uploadFile({
			 url: '/reg/signature',
			 fileName: 'sign'
		 });*/
		 
		var canvas = document.getElementById('canvasSign');
		var signData = canvas.toDataURL();
		
		if(!drawed) {
			common.showExtMsg({
				msg: '서명해 주세요',
				type: 'alert'
			});
			return;
		}
		
		common.ajaxExt({
			url: '/reg/signature',
			method: 'POST',
			params: {
				sign: signData
			},
			loadmask: {
				msg: '싸인등록중 입니다.'
			},
			success: function(jo) {
				common.showExtMsg({
					type: 'alert',
					msg: '등록되었습니다.',
					icon: parent.Ext.MessageBox.INFO,
					callback: function() {
						win.close();
					}
				});
			}
		});
	
	}

});