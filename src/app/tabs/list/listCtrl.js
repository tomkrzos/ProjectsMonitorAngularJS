'use strict';

var ListCtrl = function ($scope, $filter, listConf, StaffDataService, StaffService, TeamsDataService, TeamsService) {
    var _this = this;
    _this.init($scope, $filter, listConf, StaffDataService);

    $scope.setAddButtonStatus = function () {
        return _this.setAddButtonStatus(TeamsService, StaffService, TeamsDataService);
    };

    $scope.addTeamMember = function (employeeId) {
        _this.addTeamMember(employeeId, StaffDataService, TeamsService, TeamsDataService);
    };

    $scope.setSelectedEmployee = function (employeeId) {
        _this.setSelectedEmployee(employeeId, StaffService);
    };

    $scope.setItemsPerPage = function (itemsPerPage) {
        _this.setItemsPerPage(itemsPerPage, $scope);
    };
};


ListCtrl.prototype = function () {
    var init = function ($scope, $filter, listConf, StaffDataService) {
            $scope.itemsPerPage = listConf.paginationItemsPerPage;
            $scope.maxSize = listConf.paginationMaxSize;
            $scope.boundaryLinks = listConf.showPaginationBoundaryLinks;
            $scope.sortType = listConf.defaultListSortType;
            $scope.entriesPerPage = listConf.entriesPerPage;
            $scope.currentPage = 1;
            $scope.sortReverse = false;
            $scope.searchTerm = '';

            getData(StaffDataService)
                .then(function (data) {
                    processData($scope, $filter, data);
                });
        },

        getData = function (StaffDataService) {
            return StaffDataService.getStaff();
        },

        processData = function ($scope, $filter, data) {
            $scope.totalItems = data.length;

            $scope.$watch('currentPage + searchTerm + sortReverse + itemsPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                var filteredData = $filter('filter')(data, $scope.searchTerm);
                var sortedData = $filter('orderBy')(filteredData, $scope.sortType, $scope.sortReverse);
                $scope.totalItems = sortedData.length;
                $scope.pageData = sortedData.slice(begin, end);
            });
        },

        setAddButtonStatus = function (TeamsService, StaffService, TeamsDataService) {
            var disabled = true,
                currentTeam = TeamsService.getSelectedTeam(),
                currentEmployee = StaffService.getSelectedEmployee();

            if (currentEmployee !== undefined && currentTeam !== undefined) {
                if (!TeamsDataService.isAlreadyTeamMember(currentTeam, currentEmployee)) {
                    disabled = false;
                }
            }
            return disabled;
        },

        addTeamMember = function (employeeId, StaffDataService, TeamsService, TeamsDataService) {
            var employee = StaffDataService.getEmployeeById(employeeId),
                selectedTeamId = TeamsService.getSelectedTeam();
            TeamsDataService.addTeamMember(selectedTeamId, employee);
        },

        setSelectedEmployee = function (employeeId, StaffService) {
            StaffService.setSelectedEmployee(employeeId);
        },

        setItemsPerPage = function (itemsPerPage, $scope) {
            $scope.itemsPerPage = itemsPerPage;
        };

    return {
        init: init,
        setAddButtonStatus: setAddButtonStatus,
        addTeamMember: addTeamMember,
        setSelectedEmployee: setSelectedEmployee,
        setItemsPerPage: setItemsPerPage
    };

}();

ListCtrl.$inject = ['$scope', '$filter', 'listConf', 'StaffDataService', 'StaffService', 'TeamsDataService', 'TeamsService'];

angular.module('awesome-app.tabs')
    .controller('ListCtrl', ListCtrl);
