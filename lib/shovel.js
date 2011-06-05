// shovel.js - Do the heavy lifting in this sandbox
// Gianni Chiappetta - gf3.ca - 2010
// Rehan Iftikhar - anarrayofbytes.com - 2011

/* ------------------------------ INIT ------------------------------ */
var util = require( 'util' )
  , payload
  , payload_raw = ''
  , code
  , applier
  , console  // any calls to console will write to stdout and cause problems for the listener
  , result
  , sandbox
  , Script
  , stdin
  , returned_data;

if ( ! ( Script = process.binding( 'evals').NodeScript ) )
  Script = process.binding('evals').Script;

/* ------------------------------ Sandbox ------------------------------ */

// Get code
stdin = process.openStdin();
stdin.on( 'data', function( data ) {
  payload_raw += data;
});
stdin.on( 'end', function(){
    payload = JSON.parse(payload_raw);
    sandbox = (eval(payload['context']))(payload['runtime_data']);
    code = payload['code'];
    applier = eval(payload['applier']);
    
    run();
});

// Run code
function run() {
    result = (function(code) {
	try {
	    returned_data = Script.runInNewContext(this.toString(), sandbox );
	}
	catch (e) {
	    returned_data =  e.name + ': ' + e.message;
	}

	return [returned_data, sandbox];
    }).call( payload['code'] );
    
    process.stdout.on( 'drain', function() {
	process.exit(0);
    });

    process.stdout.write(applier.call(this, result));
}
