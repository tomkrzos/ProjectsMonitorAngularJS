'use strict';

angular.module('awesome-app.tabs')
    .factory('SearchService', function (TeamMemberModel, TeamMemberCollection, teamsConf, TeamsService, TeamsDataService) {

        var tagsObjects = [];

        var searchService = {

            getTagsObjects: function () {
                return tagsObjects;
            },

            loadTagsObjects: function () {
                if (TeamsService.getSelectedTeam() !== undefined) {
                    var selectedTeamMembers = TeamsDataService.getTeamMembers(TeamsService.getSelectedTeam());
                    tagsObjects = selectedTeamMembers.slice(0);
                }
                return tagsObjects;
            },

            addTagObject: function (tagObject) {
                if (tagObject instanceof TeamMemberModel) {
                    tagsObjects.push(tagObject);
                }
            },

            removeTagObject: function (tagObjectId) {
                for (var i = 0; i < tagsObjects.length; i++) {
                    if (tagsObjects[i].id === tagObjectId) {
                        tagsObjects.splice(i, 1);
                        break;
                    }
                }
            },

            refresh: function (tagObjects) {
                if (tagObjects.length <= teamsConf.teamMembersLimit) {
                    var selectedTeamId = TeamsService.getSelectedTeam(),
                        newTeamMembers = [];

                    for (var i = 0; i < tagObjects.length; i++) {
                        var currentTagObject = tagObjects[i];
                        var addedEmployee = new TeamMemberModel(currentTagObject.id, currentTagObject.name, currentTagObject.age, currentTagObject.grade, currentTagObject.job);
                        newTeamMembers.push(addedEmployee);
                    }

                    TeamsDataService.getTeam(selectedTeamId).setMembers(newTeamMembers);

                }
            }

        };

        return searchService;

    });