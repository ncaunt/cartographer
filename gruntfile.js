'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        env: {
            dev: {
                NODE_ENV: 'dev'
            }
        },
        jscs: {
            src: 'src/**/*.js',
            options: {
                config: '.jscs.json'
            }
        },
        mochacli: {
            src: ['test/**/*.js'],
            options: {
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            }
        }
    });

    grunt.registerTask('default', ['jscs', 'mochacli']);
};
