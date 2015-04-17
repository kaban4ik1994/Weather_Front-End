directives.directive('passedTime', ['$interval',
    function ($interval) {
        return {
            scope: {
                from: '=from'
            },
            link: function (scope, element) {
                function updateTime() {
                    element.text(moment(scope.from).fromNow());
                }

                $interval(updateTime, 100);
            }
        };
    }]);