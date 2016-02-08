'use strict';

angular.module('fooApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('foo', {
                parent: 'entity',
                url: '/foos',
                data: {
                    authorities: ['foo.admin'],
                    pageTitle: 'fooApp.foo.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/foo/foos.html',
                        controller: 'FooController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('foo');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('foo.detail', {
                parent: 'entity',
                url: '/foo/{id}',
                data: {
                    authorities: ['foo.admin'],
                    pageTitle: 'fooApp.foo.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/foo/foo-detail.html',
                        controller: 'FooDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('foo');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Foo', function($stateParams, Foo) {
                        return Foo.get({id : $stateParams.id});
                    }]
                }
            })
            .state('foo.new', {
                parent: 'foo',
                url: '/new',
                data: {
                    authorities: ['foo.admin'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/foo/foo-dialog.html',
                        controller: 'FooDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    aaa: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('foo', null, { reload: true });
                    }, function() {
                        $state.go('foo');
                    })
                }]
            })
            .state('foo.edit', {
                parent: 'foo',
                url: '/{id}/edit',
                data: {
                    authorities: ['foo.admin'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/foo/foo-dialog.html',
                        controller: 'FooDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Foo', function(Foo) {
                                return Foo.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('foo', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('foo.delete', {
                parent: 'foo',
                url: '/{id}/delete',
                data: {
                    authorities: ['foo.admin'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/foo/foo-delete-dialog.html',
                        controller: 'FooDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Foo', function(Foo) {
                                return Foo.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('foo', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
