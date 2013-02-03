({
    optimize: "uglify2",
    appDir: "../",
    baseUrl: "js",
    dir: "../../checksnap-ghpages",
    optimizeCss: "standard",
    cssImportIgnore: null,
    inlineText: true,
    removeCombined: true,
    fileExclusionRegExp: /(^\.|\.less$|plim\.config|package\.json|build\.txt|build\.js|tests)/,
    keepBuildDir: true,
    paths: {
        "jquery": "lib/jquery"
    },
    modules: [
        { name: "main" }
    ]
})
