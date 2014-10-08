/**
 * AngularJS fixed header scrollable table directive
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.0.0
 */
(function () {
    angular.module('anguFixedHeaderTable', [])
    .directive('fixedHeader', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                tableHeight: '@'
            },
            link: function ($scope, $elem, $attrs, $ctrl) {
                // wait for content to load into table
                $scope.$watch(function () { return $elem.find("tbody").is(':visible'); },
                    function (newValue, oldValue) {
                        if (newValue === true) {
                            // reset display styles so column widths are correct when measured below
                            $elem.find('thead, tbody, tfoot').css('display', '');

                            // wrap in $timeout to give table a chance to finish rendering
                            $timeout(function () {
                                // set widths of columns
                                $elem.find('th').each(function (i, thElem) {
                                    thElem = $(thElem);
                                    var tdElems = $elem.find('tbody tr:first td:nth-child(' + (i + 1) + ')');
                                    var tfElems = $elem.find('tfoot tr:first td:nth-child(' + (i + 1) + ')');

                                    var columnWidth = tdElems.width();
                                    thElem.width(columnWidth);
                                    tdElems.width(columnWidth);
                                    tfElems.width(columnWidth);
                                });

                                // set css styles on thead and tbody
                                $elem.find('thead, tfoot').css({
                                    'display': 'block',
                                });

                                $elem.find('tbody').css({
                                    'display': 'block',
                                    'height': $scope.tableHeight || '400px',
                                    'overflow': 'auto'
                                });

                                // reduce width of last column by width of scrollbar
                                var scrollBarWidth = $elem.find('thead').width() - $elem.find('tbody')[0].clientWidth;
                                if (scrollBarWidth > 0) {
                                    // for some reason trimming the width by 2px lines everything up better
                                    scrollBarWidth -= 2;
                                    $elem.find('tbody tr:first td:last-child').each(function (i, elem) {
                                        $(elem).width($(elem).width() - scrollBarWidth);
                                    });
                                }
                            });
                        }
                    });
            }
        };
    }]);
})();