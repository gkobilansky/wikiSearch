 (function () {
     'use strict';

     var app = angular.module('myApp', ['ngSanitize', 'autocomplete']);

     app.factory('wikiOpen', function ($http) {

         var wikiOpen = {
             get: function (search) {
                 return $http.jsonp('http://en.wikipedia.org//w/api.php?action=opensearch&format=json&search=' + search + '&suggest=&format=json&callback=JSON_CALLBACK');
             }
         };

         return wikiOpen;
     });

     app.factory('wikiTitle', function ($http) {

         var wikiTitle = {
             get: function (search) {
                 return $http.jsonp('http://en.wikipedia.org/w/api.php?titles=' + search + '&rawcontinue= true&action=query&format=json&prop=pageimages|info|extracts&inprop=url&exintro&callback=JSON_CALLBACK');
             }
         };

         return wikiTitle;
     });

     app.controller('WikiController', function ($scope, wikiTitle, wikiOpen) {

         $scope.updateWiki = function () {

             wikiOpen.get($scope.search).then(function (data) {
                 $scope.wikiResults = data.data;
                 console.log($scope.wikiResults);
                 $scope.change;
             });
         }

         $scope.fetch = function (typed) {

             wikiTitle.get(typed).then(function (data) {
                 $scope.wikiData = data.data;
                 console.log($scope.wikiData)
                 var pages = $scope.wikiData.query.pages;
                 console.log(pages);

                 if (!pages.hasOwnProperty(-1)) {

                     for (var prop in pages) {

                         $scope.wikiData.thumbnail = pages[prop].thumbnail ? pages[prop].thumbnail.source : 'https://unsplash.it/50/33';
                         $scope.wikiData.title = pages[prop].title;
                         $scope.wikiData.url = pages[prop].canonicalurl;
                         $scope.wikiData.extract = pages[prop].extract;

                     }

                 } else {
                     $scope.wikiData.thumbnail = 'http://img3.wikia.nocookie.net/__cb20070608122549/starwars/images/c/c8/Counterparts.jpg';
                     $scope.wikiData.title = 'This is not the page you are looking for';
                     $scope.wikiData.url = pages[-1].canonicalurl;
                 }

             });
         }

     });



 }());