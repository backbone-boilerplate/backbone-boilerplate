var packageManager = {
    "packages": [
        {
            "name": "backbone",
            "location": "../components/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone.layoutmanager",
            "location": "../components/layoutmanager",
            "main": "backbone.layoutmanager.js"
        },
        {
            "name": "jquery",
            "location": "../components/jquery",
            "main": "jquery.js"
        },
        {
            "name": "lodash",
            "location": "../components/lodash",
            "main": "./lodash.js"
        }
    ],
    "version": "0.2.11",
    "shim": {
        "backbone": {
            "deps": [
                "jquery",
                "lodash"
            ],
            "exports": "Backbone"
        },
        "backbone.layoutmanager": {
            "deps": [
                "jquery",
                "backbone",
                "lodash"
            ],
            "exports": "Backbone.LayoutManager"
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: packageManager.packages, shim: packageManager.shim});
}
else {
    var require = {packages: packageManager.packages, shim: packageManager.shim};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = packageManager;
}
