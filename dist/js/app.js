angular.module('atlanaCalendar', [
    'ui.bootstrap',
	'ngStorage'
]);

AppController = function($scope, $localStorage, $uibModal) {
	app = this;
	
	app.tasks = [];
	
	app.init = function() {
		$scope.$watch("app.currentDate", function() {
			app.fillMonth();
		}, true);
		
		app.setToday();
		
		
		tasks = [];
		
		tasks[1537218000000] = [{
			time: '16:33',
			title: 'My new event 1',
			description: '123123'
		},
		{
			title: 'My new event 3',
			description: '123123'
		}
		];
		tasks[1537304400000] = [{
			title: 'My new event 2',
			description: '123123'
		}];

		app.tasks = $localStorage.$default(tasks);
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
		app.days = {};
		day = new Date(app.currentDate);
		
		//before part
		index = app.currentDay(day);
		for (i = 0;i<index; i++) {
			day.setDate(day.getDate() - 1);
			app.insertDays(day.getTime());
		}
		//middle part
		day = new Date(app.currentDate);
		while (day.getMonth() == app.currentMonth()) {
			app.insertDays(day.getTime());
			day.setDate(day.getDate() + 1);
		}
		//after part
		index = app.currentDay(day);
		if (index > 0)
			for (i=index;i<=6; i++) {
				app.insertDays(day.getTime());
				day.setDate(day.getDate() + 1);
			}
	};
	
	app.insertDays = function (index) {
		app.days[index] = (typeof app.tasks[index] == 'undefined' ? [] : app.tasks[index]);
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
	
	///-----
	
	app.modalAdd = function () {
		console.log('add');
		$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title-bottom',
			ariaDescribedBy: 'modal-body-bottom',
			templateUrl: 'tpls/modalAdd.html',
			size: 'md',
			controller: function($scope) {
				$scope.name = 'bottom';  
			},
			controllerAs: "modalAdd"
		}).result.then(function (data) {
			console.log(data)
		});
	}
	
	///-----
	app.init();
};

//injection of dependencies
AppController.$inject=["$scope", "$localStorage", "$uibModal"];

//Register main app controller function
angular.module('atlanaCalendar').controller('AppController', AppController);