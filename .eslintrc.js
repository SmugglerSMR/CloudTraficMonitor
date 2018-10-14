module.exports = {
    "env": {
        "browser": true,
		"commonjs": true,		
  		"jquery": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 5
    },
    "rules": {                
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
		],
		'no-console': 'off',
		'no-undef': 'off',
		'no-unused-vars': 'off'
    }
};