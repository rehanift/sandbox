// sandbox.js - Rudimentary JS sandbox
// Gianni Chiappetta - gf3.ca - 2010
// Rehan Iftikhar - anarrayofbytes.com - 2011

/*------------------------- INIT -------------------------*/
var fs = require( 'fs' )
  , path = require( 'path' )
  , spawn = require( 'child_process' ).spawn;

/*------------------------- Sandbox -------------------------*/
function Sandbox( options ) {
  ( this.options = options || {} ).__proto__ = Sandbox.options;
  
  this.run = function( code, hollaback ) {
    // Any vars in da house?
    var timer
      , stdout = { value : "" }
      , stderr = { value : "" }
      , child = spawn( this.options.node, [this.options.shovel] )
      , streamAccumulator = function(incoming_data, data_holder){
	  if ( !!incoming_data ) {
	      data_holder.value += incoming_data;
	  }
      }
      , payload = {
	  code: code,
	  context: this.options.context,
	  applier: this.options.applier,
	  runtime_data: this.options.runtime_data
      };

    // Listen
    child.stdout.on( 'data', function(data){
	streamAccumulator(data, stdout);
    });
    child.stderr.on( 'data', function(data){
	streamAccumulator(data, stderr);	
    });
    child.on( 'exit', function( code ) {
	clearTimeout( timer );    	
	hollaback.call( this, JSON.parse( stdout.value ) );	
    });

    // Go      
    child.stdin.write( JSON.stringify(payload) );
    child.stdin.end();
    timer = setTimeout( function() {
      child.stdout.removeAllListeners('data');
      stdout.value = JSON.stringify( { result: 'TimeoutError', console: [] } );
      child.kill( 'SIGKILL' );
    }, this.options.timeout );
  };
}

// Options
Sandbox.options =
  { timeout: 500
  , node: 'node'
  , shovel: path.join( __dirname, 'shovel.js' )
  , context: fs.readFileSync(path.join( __dirname, '..', 'etc', 'contexts', 'default.js' ), 'utf-8')
  , applier: fs.readFileSync(path.join( __dirname, '..', 'etc', 'appliers', 'default.js' ), 'utf-8')
  , runtime_data: {}
  };

// Info
fs.readFile( path.join( __dirname, '..', 'package.json' ), function( err, data ) {
  if ( err )
    throw err;
  else
    Sandbox.info = JSON.parse( data );
});

/*------------------------- Export -------------------------*/
module.exports = Sandbox;