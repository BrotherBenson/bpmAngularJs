angular
	.module('app', [])
	.component('bpmComponent', {
		bindings: {
			bpm: '='
		},
		controller: function($scope) {
			$scope.bpm = 0;
			$scope.clickCount = 0;

			// create an array to house click objects.
			$scope.clicks = [];

			// default options, room for selector.
			$scope.config = {
				'accuracy': 2
			};

			// create an array to house intervals.
			$scope.intervals = [];

			// handler for the click action.
			$scope.onClick = function(){
				$scope.clickCount++;

				var click = {
					'time': new Date()
				};

				var clicklabel = "start click #" + $scope.clickCount;
				
				if ($scope.clickCount == 1){
					// on first click, nothing to calculate.
					$scope.addClick(click);
				}
				else {
					// otherwise, calculate the bpm and add it.
					$scope.addClick(click);

					var inputs = $scope.initializeCalculatorInputs();
					var interval = $scope.calculateInterval(inputs);
					$scope.intervals.push(interval);
					$scope.bpm = $scope.calculateAverageBpm();
					
				}

				var clicklabel = "end click #" + $scope.clickCount;
			};
	
			// adds a click object to $scope.clicks.
			$scope.addClick = function(click){
				$scope.clicks.push(click);
			};

			// initializes inputs for the calculation of an interval.
			$scope.initializeCalculatorInputs = function(){
				var lastTwo = _.last($scope.clicks, 2);
				if (lastTwo.length != 2){
					console.log('calculateBpm() error: ', inputs.clicks);
				}
				
				// create an inputs object with the last two clicks, then f - first, and s - second
				var inputs = {};
				inputs.clicks = _.last($scope.clicks, 2);
				inputs.f = _.first(inputs.clicks).time;
				inputs.s = _.last(inputs.clicks).time;

				return inputs;
			};

			// calculates the amount of time between two times.
			$scope.calculateInterval = function(inputs){
				return inputs.s - inputs.f;
			};

			// calculate bpm based on the average amount of time betweeen two clicks.
			$scope.calculateAverageBpm = function(){
				var averageInterval = $scope.calculateAverageInterval();
				if (averageInterval === 0 || averageInterval == null || averageInterval == undefined){
					console.log('calculateAverageBpm is missing interval');
				}
				var minute = 60000;
				return (minute/averageInterval).toFixed(2);
			};

			$scope.calculateAverageInterval = function(){
				var intervals = $scope.intervals;

				if (intervals.length === 0){
					console.log('calculateAverage() error: intervals:', intervals);
					return 0;
				}

				var total = _.reduce(intervals, function(memo, num) { return memo + num;}, 0);
				
				var average = (total / intervals.length);
				return average;
			}
		},
		template: ["<button ng-click='onClick()'>Click here.</button>",
			"<span>{{bpm}}</span>"
		].join('')
	});

document.addEventListener('DOMContentLoaded', function () {
	angular.bootstrap(document, ['app']);
});