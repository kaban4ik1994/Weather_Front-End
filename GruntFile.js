module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                force: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    $: true,
                    console: true
                }
            },
            '<%= pkg.name %>': {
                src: ['js/ng/**/*.js']
            }
        },
        concat: {
            dist: {
                src: [
                    'js/libs/jquery-2.0.2.min.js',
                    'js/libs/jquery.cookie.js',
                    'js/libs/jquery-ui-1.10.3.min.js',
                    'js/libs/bootstrap/bootstrap.min.js',
                    'js/globalVaribale.js',
                    'js/libs/angular/angular.js',
                    'js/libs/angular/angular-route.js',
                    'js/libs/angular/angular-animate.js',
                    'js/libs/angular/resource.js',
                    'js/libs/angular/ui-bootstrap-custom-tpls-0.11.0.js',
                    'js/libs/angular/angular-local-storage.min.js',
                    'js/libs/angular-block-ui/angular-block-ui.min.js',
                    'js/ng/ng.app.js',
                    'js/ng/ng.controllers.js',
                    'js/ng/controllers/homeController.js',
                    'js/ng/controllers/weatherAppController.js',
                    'js/ng/controllers/weatherOnController.js',
                    'js/ng/ng.directives.js',
                    'js/ng/directives/currentTimeDirective.js',
                    'js/ng/services/geotargetingService.js',
                    'js/ng/ng.service.js',
                    'js/ng/services/locationStorageService.js',
                    'js/ng/services/weatherService.js',
                    'js/ng/services/weatherStorageService.js'
                ],
                dest: 'build.js'
            }
        },
        uglify: {
            build: {
                src: 'build.js',
                dest: 'build.min.js'
            }
        },
        cssmin: {
            files: {
                src: ['css/bootstrap.min.css', 'css/index.css', 'css/angular-block-ui.min.css'],
                dest: 'style.min.css'
            }
        },
        watch: {
            scripts: {
                files: ['js/**/*.js'],
                tasks: ['jshint', 'concat', 'uglify', 'removelogging']
            },
            css: {
                files: ['css/**/*.css'],
                tasks: ['cssmin']
            }
        },
        removelogging: {
            files: {
                src: 'build.min.js',
                dest: 'build.clean.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-remove-logging');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin', 'removelogging', 'watch']);
};