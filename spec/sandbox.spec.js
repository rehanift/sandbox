/* ------------------------------ INIT ------------------------------ */
var Sandbox = require( '../lib/sandbox' )
  , sb = new Sandbox()

/* ------------------------------ Tests ------------------------------ */
exports['it should execute basic javascript'] = function( test ) {
  sb.run( '1 + 1', function( output ) {
    test.equal( output.result, '2' )
    test.finish()
  })
}

exports['it should gracefully handle syntax errors'] = function( test ) {
  sb.run( 'hi )there', function( output ) {
    test.equal( output.result, "'SyntaxError: Unexpected token )'" )
    test.finish()
  })
}

exports['it should effectively prevent code from accessing node'] = function( test ) {
  sb.run( 'process.platform', function( output ) {
    test.equal( output.result, "'ReferenceError: process is not defined'" )
    test.finish()
  })
}

exports['it should effectively prevent code from circumventing the sandbox'] = function( test ) {
  sb.run( "var sys=require('sys'); sys.puts('Up in your fridge')", function( output ) {
    test.equal( output.result, "'ReferenceError: require is not defined'" )
    test.finish()
  })
}

exports['it should timeout on infinite loops'] = function( test ) {
  sb.run( 'while ( true ) {}', function( output ) {
    test.equal( output.result, "TimeoutError" )
    test.finish()
  })
}

exports['it should allow console output via `console.log`'] = function( test ) {
  sb.run( 'console.log(7); 42', function( output ) {
    test.equal( output.result, "42" )
    test.equal( output.console[0], "7" )
    test.finish()
  })
}

exports['it should allow console output via `print`'] = function( test ) {
  sb.run( 'print(7); 42', function( output ) {
    test.equal( output.result, "42" )
    test.equal( output.console[0], "7" )
    test.finish()
  })
}

exports['it should maintain the order of sync. console output'] = function( test ) {
  sb.run( 'console.log("first"); console.log("second"); 42', function( output ) {
    test.equal( output.result, "42" )
    test.equal( output.console[0], "'first'" )
    test.equal( output.console[1], "'second'" )
    test.finish()
  })
}

exports['it should allow for a user-defined global context to be specified at runtime'] = function( test ) {
    var fs = require('fs'),
	path = require('path');
    var sb = new Sandbox({
	context: fs.readFileSync(path.join(__dirname, "resources", "test-context.js"), "utf-8")
    });
    sb.run('console.log(test_method());', function( output ){
	test.equal(output.console[0], "'Foo Bar'");
	test.finish();
    });
};

exports['it should allow for a user-defined results applier to be specified at runtime'] = function( test ) {
    var fs = require('fs'),
	path = require('path');
    var sb = new Sandbox({
	applier: fs.readFileSync(path.join(__dirname, "resources", "test-applier.js"), "utf-8")
    });
    sb.run('foo = "bar";', function( output ){
	test.equal(output.foo, "'bar'");
	test.finish();
    });
};

exports['it should allow for runtime data to be injected into the user-defined global context'] = function( test ) {
    var fs = require('fs'),
	path = require('path');
    var sb = new Sandbox({
	context: fs.readFileSync(path.join(__dirname, "resources", "test-context.js"), "utf-8"),
	runtime_data: {
	    hello: "world"
	}
    });
    sb.run('console.log(get_runtime_data());', function( output ){
	test.equal(output.console[0], "{ hello: 'world' }");
	test.finish();
    });
};

/* ------------------------------ GO GO GO ------------------------------ */
if ( module == require.main )
  require( 'async_testing' ).run( __filename, process.ARGV )

