sandbox = { 
    console: { 
	_data: [],
	log: function() { 
	    var i, l;
	    var util = require('util');
            for ( i = 0, l = arguments.length; i < l; i++ ) {
		sandbox.console._data.push( util.inspect( arguments[i] ) );
	    }
	}
    },
    print: function(data) {
	sandbox.console.log.call(this, data);
    }
};