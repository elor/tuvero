{
    appDir: "..",
    baseUrl: "scripts",
    dir: "../../boules-build",
//    optimize: "uglify2",
    optimize: "none",
    modules: [
        {
            name: 'common'
        },
        {
            name: "config",
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
}
