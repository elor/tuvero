({
    appDir: "..",
    baseUrl: "scripts",
    dir: "../../boules-build",
    optimize: "uglify2",
    modules: [
        {
            name: 'common'
        },
        {
            name: "main",
            exclude: ['common']
        },
        {
            name: "test",
            exclude: ['common']
        },
    ],
    findNestedDependencies: true,
    removeCombined: true,
    preserveLicenseComments: false,
    fileExclusionRegExp: /^\.|\.(svg|xcf|sh)$|^build\.js$/,
    mainConfigFile: "../scripts/config.js",
})
