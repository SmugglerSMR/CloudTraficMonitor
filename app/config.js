// Setting up default configurations with hoistname, API keys for local/global
var cfg = {
	'local':{
		HOST: 'localhost',
		PORT: '3000',
		DEFAULT_COOKIES_DOMAIN: '',		
		WEBCAMS: {
			appKey: 'umj4LLmXrnmshs0aRT86MMosAlHIp1WhH0Njsnz8WgKzEQEAyb'	
		},
		GOOGLE_MAPS_KEY: 'AIzaSyBXQROV5YMCERGIIuwxrmaZbBl_Wm4Dy5U'
	},
	'global':{
		HOST: '',
		PORT: '3000',
		DEFAULT_COOKIES_DOMAIN: 'cab432-sadykov-planner.com',		
		WEBCAMS: {
			appKey: 'umj4LLmXrnmshs0aRT86MMosAlHIp1WhH0Njsnz8WgKzEQEAyb'	
		},
		GOOGLE_MAPS_KEY: 'AIzaSyBXQROV5YMCERGIIuwxrmaZbBl_Wm4Dy5U'
	}

};

var runEnv = process.env.NODE_ENV || process.argv[2];

if( runEnv in cfg ){
	// apply config for current environment

	var envCfg = cfg[ runEnv ];

	for( var k in envCfg ){
		module.exports[k] = envCfg[k];
	}
}

module.exports.extend = function(conf){
    function _extend(dest, source){
      for(var k in source){
        if(typeof source[k] == 'object' &&
             typeof dest[k] == 'object')
          _extend(dest[k], source[k]);        
        else
          dest[k] = source[k];
        
      }
    }  
    _extend(this, conf);  
};

module.exports._b = function ( v ) {
	if( typeof v == 'boolean' ) return v;
	if( v == 'true' ) return true;
	return false;
};