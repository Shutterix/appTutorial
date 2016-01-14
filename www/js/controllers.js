angular.module('appTutorial.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Auth, $state, $ionicHistory, $window, Users, item, authData) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
    var appCtrl = this;
    $scope.profile = authData;


    // ugly hack to load channels in menu    
    //$state.go('app.channels');
    
  // Form data for the login modal
  $scope.loginData = {};
  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  
  // Open the login modal
  $scope.logout = function() {
    Auth.$unauth();
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
        
    $state.go('app.login2');
    // Find a different way?                          
    $window.location.reload(true);    
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('HomeCtrl', function($scope, $stateParams, item) {
    console.log(item);
    $scope.item = item;
    this.item = item;
})

.controller('AuthCtrl', function($stateParams, Auth, $state, $ionicHistory, $window) {

    var authCtrl = this;

    authCtrl.user = {
        email: '',
        password: ''
    };
    
    authCtrl.login = function (){
    console.log("inloggen");        
        Auth.$authWithPassword(authCtrl.user).then(function (auth){
         
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        

        $state.go('app.profile')  
        // Find a different way?                          
        $window.location.reload(true);
        }, function (error){
            authCtrl.error = error;
        });
    }; 
       
    authCtrl.register = function (){
        Auth.$createUser(authCtrl.user).then(function (user){
            authCtrl.login();
        }, function (error){
            authCtrl.error = error;
        });
    };   
})
.controller('ProfileCtrl', function($state, md5, auth, Users, profile) {
    var profileCtrl = this;
    profileCtrl.profile = profile;
    profileCtrl.getGravatar = Users.getGravatar;     
    profileCtrl.email = auth.password.email;
    profileCtrl.updateProfile = function(){
        profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
        profileCtrl.profile.$save();
    }
    
})
.controller('ChannelsCtrl', function($state, Auth, Users, profile, channels){
    var channelsCtrl = this;
    channelsCtrl.profile = profile;
    channelsCtrl.channels = channels;    
    
    console.log(channelsCtrl.channels);
    
    channelsCtrl.getDisplayName = Users.getDisplayName;
    
    channelsCtrl.newChannel = {
    name: ''
    };       
    
    channelsCtrl.createChannel = function(){
    channelsCtrl.channels.$add(channelsCtrl.newChannel).then(function(){
        channelsCtrl.newChannel = {
        name: ''
        };
    });
    };    
  })
  
  .controller('MessagesCtrl', function(Users, profile, channelName, messages){
    var messagesCtrl = this;

    messagesCtrl.messages = messages;
    messagesCtrl.channelName = channelName;
    messagesCtrl.getDisplayName = Users.getDisplayName;   
    messagesCtrl.getGravatar = Users.getGravatar; 
           
    messagesCtrl.message = '';    
    
    messagesCtrl.sendMessage = function (){
    if(messagesCtrl.message.length > 0){
        messagesCtrl.messages.$add({
        uid: profile.$id,
        body: messagesCtrl.message,
        timestamp: Firebase.ServerValue.TIMESTAMP
        }).then(function (){
        messagesCtrl.message = '';
        });
    }
    };  
    
  }) 
  
  
  
 // DIRECTIVES!  
.directive('channelsMenu', [function(){
 return {
      restrict: 'AE',
      template: '<ion-item ng-repeat="item in channels" ng-class="{active: isChannelActive(item.$id)}"menu-close href="#/app/messages/{{item.$id}}"><i class="{{item.iconClass}}"></i> {{item.name}} <span ng-show="{{item.count > 0}}" class="badge badge-assertive">{{item.count}}</span></ion-item>',
      controller: ['$scope', '$state','$stateParams', 'Auth','Users','$firebaseArray','FirebaseUrl', function ($scope, $state, $stateParams, Auth, Users, $firebaseArray, FirebaseUrl) {


        var ref = new Firebase(FirebaseUrl+'channels');
        var channels = $firebaseArray(ref);  
       
        $scope.channels = channels;
        $scope.isChannelActive = function(id) {
          return id == $stateParams.channelId;
        };      
      }]
    };
}])



.directive('messagesMenu', [function(){
 return {
      restrict: 'AE',
      template: '<ion-item ng-repeat="item in messages" ng-class="{active: isMessageActive(item.root)}"menu-close href="#/app.{{item.state}}"><i class="icon {{item.iconClass}}"></i> {{item.title}} <span ng-show="{{item.count > 0}}" class="badge badge-assertive">{{item.count}}</span></ion-item>',
      controller: ['$scope', '$state', function ($scope, $state) {
        $scope.messages = [{
            title: 'Coen',
              state: 'statistics',
              root: 'statistics',
              count: 4,              
            iconClass: 'ion-chatbubble-working'
          }, {
              title: 'Frank',
                state: 'videos.list',
                root: 'videos',
                count: 0,                
            iconClass: 'ion-chatbubble-working'
          }, {
              title: 'Jelle',
                state: 'articles',
                root: 'articles',
                count: 0,                
            iconClass: 'ion-chatbubble-working'                  
        }];

        $scope.isMessageActive = function(root) {
          return $state.includes(root);
        };
      }]
    };
}]);

