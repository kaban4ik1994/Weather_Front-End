controllers.controller('HomeController', ['$scope', '$rootScope', '$location', '$interval',
    'weatherService', 'geotargetingService', 'weatherStorageService', 'locationStorageService',
    function ($scope, $rootScope, $location, $interval,
        weatherService, geotargetingService, weatherStorageService, locationStorageService) {

        var weatherAdapter = new WeatherAdapter();
        var geotargetingAdapter = new GeotargetingAdapter();

        function updateWeather() {
            var cacheWeather = weatherStorageService.getWeatherData();
            var nowDate = moment().format("YYYY-MM-DD");
            cacheWeather.watherForFiveDays.forEach(function (element) {
                if (moment(nowDate).isSame(element.date)) {
                    element.partsOfDay.forEach(function (value) {
                        var currentHour = moment().hour();
                        if (currentHour >= value.dateTime && currentHour < value.dateTime + 3 && $scope.weatherData) {
                            $scope.weatherData.temp = value.dateTemp;
                            $scope.weatherData.iconUrl = value.dateIconUrl;
                            $scope.weatherData.pressure = value.datePressure;
                            $scope.weatherData.humidity = value.dateHumidity;
                        }
                    });
                }
            });
        }

        $scope.timeIsNow = Date.now();

        function successGetPosition(pos) {
            var requestParametersToWeatherApi = {
                longitude: pos.coords.longitude,
                latitude: pos.coords.latitude,
                numOfDays: 5
            };

            weatherService.get(requestParametersToWeatherApi, function (response) {
                $scope.weatherData = weatherAdapter.request(response);
                weatherStorageService.clearWeatherStorage();
                weatherStorageService.saveWeatherData($scope.weatherData);
            }, function () {
                $scope.weatherData = weatherStorageService.getWeatherData();
            });

            var requestParametersToGeotargetingApi = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };

            geotargetingService.get(requestParametersToGeotargetingApi, function (response) {
                $scope.locationData = geotargetingAdapter.request(response);
                locationStorageService.clearLocationStorage();
                locationStorageService.saveLocationData($scope.locationData);
            }, function () {
                $scope.locationData = locationStorageService.getLocationData();
            });
        }

        function errorGetPosition(err) {
            $scope.locationData = locationStorageService.getLocationData();
            $scope.weatherData = weatherStorageService.getWeatherData();
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }

        function start() {
            if (window.navigator.onLine) {
                navigator.geolocation.getCurrentPosition(successGetPosition, errorGetPosition);
            } else {
                $scope.weatherData = weatherStorageService.getWeatherData();
                $scope.locationData = locationStorageService.getLocationData();
            }
        }

        start();

        $interval(start, 300 * 1000);
        $interval(updateWeather, 30 * 1000);
    }
]);