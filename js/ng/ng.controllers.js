function AdvancedWeather() {

    function roundValue(value) {
        return Math.round(value);
    }

    function convertKmphToMps(value) {
        return Math.round(value / 3.6 * 10) / 10;
    }

    function getPartOfDay(data) {
        return {
            dateTemp: roundValue(data.tempC),
            dateHumidity: data.humidity,
            datePressure: data.pressure,
            dateIconUrl: data.weatherIconUrl[0].value,
            dateWindSpeed: convertKmphToMps(data.windspeedKmph),
            dateWindGust: convertKmphToMps(data.WindGustKmph),
            dateTime: data.time / 100
        };
    }

    function getPartsOfDay(data) {
        var result = [];
        data.forEach(function (element) {
            result.push(getPartOfDay(element));
        });
        return result;
    }

    function getWatherForAllDays(data) {
        var result = [];
        data.forEach(function (element) {
            result.push({
                date: element.date,
                partsOfDay: getPartsOfDay(element.hourly)
            });
        });
        return result;
    }

    this.roundValue = roundValue;
    this.convertKmphToMps = convertKmphToMps;
    this.getPartOfDay = getPartOfDay;
    this.getPartsOfDay = getPartsOfDay;
    this.getWatherForAllDays = getWatherForAllDays;
};

function WeatherAdapter() {

    var weather = new AdvancedWeather();

    return {
        request: function (dataRequest) {
            return {
                temp: weather.roundValue(dataRequest.data.current_condition[0].temp_C),
                humidity: dataRequest.data.current_condition[0].humidity,
                pressure: dataRequest.data.current_condition[0].pressure,
                iconUrl: dataRequest.data.current_condition[0].weatherIconUrl[0].value,
                date: dataRequest.data.weather[0].date,
                observation_time: dataRequest.data.current_condition[0].observation_time,
                weatherDescription: dataRequest.data.current_condition[0].weatherDesc[0].value,
                sync_time: Date.now(),
                watherForFiveDays: weather.getWatherForAllDays(dataRequest.data.weather),
                partsOfDay: weather.getPartsOfDay(dataRequest.data.weather[0].hourly)
            };
        }
    };
}
function AdvancedGeotargeting() {
    this.getLocationFromResponse = function (value) {
        var location;
        angular.forEach(value.results, function (result) {
            if ($.inArray("locality", result.types) > -1 && $.inArray("political", result.types) > -1 && result.types.length <= 2) {
                location = result.formatted_address;
            }
        });
        return location;
    };
}

function GeotargetingAdapter() {

    var geotargeting = new AdvancedGeotargeting();

    return {
        request: function (dataRequest) {
            return {
                location: geotargeting.getLocationFromResponse(dataRequest),
                sync_time: Date.now()
            };
        }
    };
}

var controllers = angular.module('app.controllers', []);