angular.module('atlanaCalendar', [
    'ui.bootstrap',
	'ngStorage'
]);

AppController = function($scope, $filter, $localStorage, $uibModal, focus) {
	app = this;
	
	app.data = [];
	app.search = '';
	
	app.cfg = {
		searchDescriptionLength: 65,
		searchMinLength: 3
	}
	
	app.init = function() {
		$scope.$watch("app.currentDate", function() {
			app.fillMonth();
		}, true);
		
		//demo data
		tasks = [{
			date: 1537218000000,
			time: (16*60+15)*60*1000,
			title: 'My new event with time',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id sagittis orci. Suspendisse dignissim dictum malesuada. Nullam pretium nulla id sapien fermentum faucibus. Donec sem urna, porta eu tincidunt efficitur, laoreet eu augue. Nulla eleifend iaculis ligula, in dapibus erat. Curabitur ullamcorper iaculis enim, vitae rutrum tortor efficitur ac. Nullam fermentum, est ullamcorper imperdiet dignissim, mauris sapien scelerisque est, ut pulvinar tortor felis quis augue. Donec sed quam finibus, pellentesque risus non, accumsan justo. Pellentesque metus ex, laoreet at nunc ut, convallis pretium velit. Cras tempor ligula metus, sed fermentum elit porttitor id. Mauris sed posuere sem. Quisque vulputate efficitur leo ut fermentum. Nam eu egestas turpis. Aliquam tempor est eros, id fringilla eros ullamcorper sit amet. Fusce enim libero, lacinia id odio id, malesuada feugiat lacus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
		},
		{
			date: 1537218000000,
			title: 'My new event 3',
			description: 'Morbi a tellus velit. Duis sit amet convallis nisl. Pellentesque risus velit, rhoncus vel sollicitudin eget, blandit ut orci. Etiam varius, felis eleifend rhoncus pharetra, dui nulla sagittis elit, non egestas diam orci vel dui. Proin placerat velit convallis vestibulum feugiat. Vestibulum ex nisi, faucibus eu tincidunt tincidunt, tristique vel est.'
		},
		{
			date: 1537304400000,
			title: 'My new event 2',
			description: '123123'
		}];
		app.data = $localStorage.$default({tasks: tasks});
		
		app.setToday();
	};
	
	app.currentMonth = function() {
		return app.currentDate.getMonth();
	};
//	app.currentYear = function() {
//		return app.currentDate.getFullYear();
//	};
	
	app.currentDay = function (date) {
		weekDay = date.getDay();
		return ( weekDay == 0 ? 6 : weekDay-1 );
	};
	
	app.fillMonth = function () {
		app.days = [];
		day = new Date(app.currentDate);
		
		//before part
		index = app.currentDay(day);
		day.setDate(day.getDate()-index);
		for (i=0;i<index; i++) {
			app.insertDays(day);
		}
		//middle part
		day = new Date(app.currentDate);
		while (day.getMonth() == app.currentMonth()) {
			app.insertDays(day);
		}
		//after part
		index = app.currentDay(day);
		if (index > 0)
			for (i=index;i<=6; i++) {
				app.insertDays(day);
			}
	};
	
	app.insertDays = function (day) {
		app.days.push(day.getTime());
		day.setDate(day.getDate() + 1);
	}
	
	app.setMonth = function(dirrection) {
		app.currentDate.setMonth( app.currentDate.getMonth() + (dirrection > 0 ? 1 : -1 ) );
	};
	
	app.setToday = function() {
		today = new Date();
		app.currentDate = new Date(today.getFullYear(), today.getMonth());
	};
	
	app.isToday = function(time) {
		day = new Date(time*1);
		today = new Date();
		return (day.toDateString() == today.toDateString());
	};
	
	app.isFirst = function(time) {
		day = new Date(time*1);
		return (day.getDate() == 1);
	};
	
	app.isMonth = function(time) {
		day = new Date(time*1);
		return (day.getMonth() != app.currentMonth());
	};
	
	app.doSearch = function() {
		if (app.search.length < app.cfg.searchMinLength)
			return [];
		data = $filter('filter')(app.data.tasks, {$: app.search});
		data = $filter('limitTo')(data, 10);
		return data;
		//app.data.tasks | filter:  | limitTo: 10
	}
	
	app.focusSearch = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		app.searchOpen=true;
		focus("dropdownSearch");
	}
	
	///-----
	
	app.modalAdd = function () {
		$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title-bottom',
			ariaDescribedBy: 'modal-body-bottom',
			templateUrl: 'tpls/modalAdd.html',
			size: 'md',
			controllerAs: "modalAdd"
		}).result.then(function (data) {
			if (data.form.$invalid)
				return false;
			
			data.data.date = data.data.date.getTime();
			if (typeof data.data.time != 'undefined')
				data.data.time = data.data.time.getTime();
			console.log(data.data);
			app.data.tasks.push(data.data);
		},function(){});
	}
	
	app.modalView = function (data) {
		$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title-bottom',
			ariaDescribedBy: 'modal-body-bottom',
			templateUrl: 'tpls/modalView.html',
			size: 'md',
			controller: ['$scope', '$filter', 'data', function($scope, $filter, data) {
				ctrl = this;
				ctrl.data = data;
				ctrl.edit = false;
				
				ctrl.formEdit = {};
				
				ctrl.doEdit = function() {
					ctrl.formEdit = {};
					angular.copy(ctrl.data, ctrl.formEdit);
					if (typeof ctrl.formEdit.date != 'undefined')
						ctrl.formEdit.date = new Date(data.date);
					if (typeof ctrl.formEdit.time != 'undefined')
						ctrl.formEdit.time = new Date(data.time);
					
					ctrl.edit = true;
				}
				
				ctrl.doEditCancel = function() {
					ctrl.formEdit = [];
					ctrl.edit = false;
				}
				
				ctrl.doSave = function() {
					angular.forEach(ctrl.formEdit, function(value, key) {
						switch (key) {
							case 'date':
							case 'time':
								value = value.getTime();
							break;
						}
						ctrl.data[key] = value;
					});
					
					ctrl.formEdit = [];
					ctrl.edit = false;
				}
			}],
			controllerAs: "modalView",
			resolve: {
				data: function() { return data; }
			}
		}).result.then(function (data) {
			if (data.reason == 'delete') {
				index = app.data.tasks.indexOf(data.data);
				if (index >= 0)
					app.data.tasks.splice(index, 1);
			}
		},function(){});
	};
	
	///-----
	app.init();
};

//injection of dependencies
AppController.$inject=["$scope", "$filter", "$localStorage", "$uibModal", "focus"];

//Register main app controller function
angular.module('atlanaCalendar').controller('AppController', AppController);


angular.module('atlanaCalendar').factory('focus', function($timeout, $window) {
	return function(id) {
		$timeout(function() {
			var element = $window.document.getElementById(id);
			if(element)
				element.focus();
		});
	};
})