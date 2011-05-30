(function(){
    return function(results){
	var util = require('util');

	return JSON.stringify({
	    result: util.inspect(results[0]),
	    console: results[1].console._data
	});
    };
})();