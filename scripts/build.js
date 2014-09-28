({
    appDir: "..",
    baseUrl: "scripts",
    dir: "../../boules-build",
    optimize: "uglify2",
    modules: [
        {
            name: 'common',
        },
        {
            name: "main",
            exclude: ['common'],
        },
        {
            name: "test",
            exclude: ['common'],
        },
    ],
    findNestedDependencies: true,
    removeCombined: true,
    fileExclusionRegExp: /^\.|\.(svg|xcf|sh)$|build\.js/,
})
