angular.module('atlanaCalendar', [
    'ui.bootstrap'
]);

AppController = function() {
	obj = this;
	
	obj.tasks = [
		{
			date: new Date(),
			name:'123'
		},
		{
			date: new Date(),
			name:'123'
		}
	]
	
	obj.date = new Date();
	obj.date.setHours(0,0,0,0);
	
	obj.currentMonth = obj.date.getMonth();
	obj.currentYear = obj.date.getFullYear();
	obj.currentDate = new Date(obj.currentYear, obj.currentMonth);
	
	
	obj.currentDay = function (date) {
		weekDay = date.getDay();
		return ( weekDay == 0 ? 6 : weekDay-1 );
	}
	
	obj.fillMonth = function () {
		obj.currentDate = new Date(obj.currentYear, obj.currentMonth);
		obj.days = [];
		day = new Date(obj.currentYear, obj.currentMonth);
		
		//generate before
		index = obj.currentDay(day);
		for (i = 0;i<index; i++) {
			day.setDate(day.getDate() - 1);
			
			obj.days.unshift(day.getTime());
		}
		
		day = new Date(obj.currentYear, obj.currentMonth);
		
		while (day.getMonth() == obj.currentMonth) {

			obj.days.push(day.getTime());
			
			day.setDate(day.getDate() + 1);
		}
		
		
		index = obj.currentDay(day);
		if (index > 0)
			for (i=index;i<=6; i++) {
				obj.days.push(day.getTime());

				day.setDate(day.getDate() + 1);
			}
		
	}
	
	obj.changeMonth = function(dirrection) {
		obj.currentMonth = (dirrection > 0 ? obj.currentMonth+1 : obj.currentMonth-1 );
		obj.fillMonth();
	}
	
	obj.isToday = function(time) {
		day = new Date(time);
		return (day.toDateString() == obj.date.toDateString());
	}
	
	obj.isFirst = function(time) {
		day = new Date(time);
		return (day.getDate() == 1);
	}
	
	obj.isMonth = function(time) {
		day = new Date(time);
		return (day.getMonth() != obj.currentMonth);
	}
	
	obj.days = [];
	//check weekDay of 1th
	
	obj.fillMonth();
};

////injection of dependencies
//AppController.$inject=[];

//Register main app controller function
angular.module('atlanaCalendar').controller('AppController', AppController);