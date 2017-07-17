module.exports = {
    "env": {
        "es6": true,
        "mocha": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "callback-return": "error", // Enforce Return After Callback
        "camelcase": "error", // Always use camelcase for variable name 
        "capitalized-comments": [
            "error", 
            "always"
        ], // Start comment with capital letter
        "dot-location": [
            "error", 
            "property"
        ], // Always use newline before dot of a member expression
        "dot-notation": [
            "error", { 
                "allowPattern": "x-access-token" 
            }
        ], // Always use dot-notation
        "linebreak-style": [
            "error",
            "windows"
        ],
        "no-console": "warn", // Check for console.log
        "no-multi-spaces": "warn", // No multiple spaces
        "no-sync": "error", // Don't use synchronous methods
        "no-undef": "warn", // Disable checking for undefined variables
        "no-unused-vars": "warn", // Check for unused variables
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};