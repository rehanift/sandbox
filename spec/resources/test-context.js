(function(runtime_data){
    var _data = [];
    var sandbox = { 
	console: { 
	    _data: _data,
	    log: function() { 
		var i, l;
		var util = require('util');
		for ( i = 0, l = arguments.length; i < l; i++ ) {
		    _data.push( util.inspect( arguments[i] ) );
		}
	    }
	},
	test_method: function(){
	    return "Foo Bar";
	},
	get_runtime_data: function(){
	    return runtime_data;
	}
    };

    return sandbox;
});