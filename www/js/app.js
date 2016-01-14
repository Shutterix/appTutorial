// Ionic appTutorial App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'appTutorial' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'appTutorial.controllers' is found in controllers.js
angular.module('appTutorial', ['ionic', 'firebase', 'angular-md5', 'appTutorial.controllers', 'appTutorial.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
        resolve: {
                authData: function(Auth){
                    return Auth.$getAuth();
                },       
                item: function(ItemService){
                    return ItemService.getItem()
                }                
        }  
})

  .state('app.channels', {
    url: '/submenu',
    views: {
      'subMenuContent': {
        templateUrl: 'templates/channels.html',
        controller: 'ChannelsCtrl as channelsCtrl'        
      }
    },
    resolve: {
        channels: function (Channels){
        return Channels.$loaded();
        },
        profile: function ($state, Auth, Users){
        return Auth.$requireAuth().then(function(auth){
            return Users.getProfile(auth.uid).$loaded().then(function (profile){
            if(profile.displayName){
                return profile;
            } else {
                $state.go('app.profile');
            }
            });
        }, function(error){
            $state.go('app.login2');
        });
        }
    }    
  })
  
  .state('app.login2', {
    url: '/login2',
    views: {
      'menuContent': {
        templateUrl: 'templates/login2.html',
        controller: 'AuthCtrl as authCtrl'
      }
    },
    resolve: {
        requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
                $state.go('app.playlists');
            }, function(error){
                console.log(error);
            return;
            });
        }
    }    
  })  
  .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html',
        controller: 'AuthCtrl as authCtrl'
      }
    },
    resolve: {
        requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
                $state.go('app.playlists');
            }, function(error){
                console.log(error);
            return;
            });
        }
    }  
  })   
  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl as profileCtrl'
      }
    },
    resolve: {
        auth: function($state, Users, Auth){
            return Auth.$requireAuth().catch(function(){
                $state.go('app.login2');
            });
        },
        profile: function(Users, Auth){
            return Auth.$requireAuth().then(function(auth){
                return Users.getProfile(auth.uid).$loaded();
            });
        }
    }  
  })   
  
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }   
      }
    })
    .state('app.createchannel', {
      url: '/createchannel',
      views: {
        'menuContent': {
          templateUrl: 'templates/createchannel.html',
          controller: 'ChannelsCtrl as channelsCtrl'
        }   
      },
    resolve: {
        item: function(ItemService){
            return ItemService.getItem()
        },
        channels: function (Channels){
            return Channels.$loaded();
        },
        profile: function ($state, Auth, Users){
            return Auth.$requireAuth().then(function(auth){
                return Users.getProfile(auth.uid).$loaded().then(function (profile){
                    if(profile.displayName){
                        return profile;
                    } else {
                        $state.go('app.profile');
                    }
                });
            }, function(error){
                $state.go('app.login2');
            });
            }            
        }
    })
    .state('app.messages', {
        url: '/messages/:channelId',
        views: {
            'menuContent': {
            templateUrl: 'templates/messages.html',
            controller: 'MessagesCtrl as messagesCtrl'
            }
        },           
        resolve: {
        channels: function (Channels){
            return Channels.$loaded();
        },
        profile: function ($state, Auth, Users){
            return Auth.$requireAuth().then(function(auth){
                return Users.getProfile(auth.uid).$loaded().then(function (profile){
                    if(profile.displayName){
                        return profile;
                    } else {
                        $state.go('app.profile');
                    }
                });
            }, function(error){
                $state.go('app.login2');
            });
            },              
            messages: function($stateParams, Messages){
                return Messages.forChannel($stateParams.channelId).$loaded();
            },
            channelName: function($stateParams, channels){
                return channels.$getRecord($stateParams.channelId).name;
            }            
        }
    })
        
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }   
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/profile');
})
.constant('FirebaseUrl', 'https://aight.firebaseio.com/');

