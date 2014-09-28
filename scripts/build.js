({
    appDir: "..",
    baseUrl: "scripts",
    dir: "../../boules-build",
    optimize: "uglify2",
    modules: [
        {
            name: "ui/main",
        },
        {
            name: "test",
        },
    ],
    //    findNestedDependencies: true,
    removeCombined: true,
    fileExclusionRegExp: /^\.|\.(svg|xcf|sh)$/,
})
