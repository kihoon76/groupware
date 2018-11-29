Ext.Loader.setConfig({enabled: true, disableCaching: false}); // disableCaching: false _dc 제거
Ext.Loader.setPath('Ext.ux.form', '/resources/ux');

Ext.application({
    name: 'Drpnd'
   ,appFolder: '/resources/app'
   ,autoCreateViewport: true
   ,controllers : [
       'Drpnd.controller.MainController',
       //'Drpnd.controller.CalendarController'
   ]
   ,launch:function(){
	   
	 _drpndApp = this;
	   
	 //similar to jQuerys $(document).ready, fired on when application is ready
	 String.prototype.replaceAt = function(index, character) {
		 return this.substr(0, index) + character + this.substr(index+character.length);
	 };

	 Array.prototype.remove = function() {
		 var what, a = arguments, L = a.length, ax;
		 while(L && this.length) {
			 what = a[--L];
			 while((ax = this.indexOf(what)) !== -1) {
				 this.splice(ax, 1);
			 }
		 }

		 return this;
	 };

	 Array.prototype.contains = function(v) {
		 if(v == undefined) return false;
		 for(var x = 0, L = this.length; x < L; x++) {
			 if(this[x] == v) return true;
		 }

		 return false;
	 };

   }
});
