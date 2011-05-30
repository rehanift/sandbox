(function(){
    return function(results){
	var util = require('util');

	return JSON.stringify({
	    foo: util.inspect(results[1].foo)
	});
    };
})();