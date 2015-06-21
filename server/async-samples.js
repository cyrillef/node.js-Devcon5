//
// Copyright (c) Autodesk, Inc. All rights reserved
//
// Node.js server workflow
// by Cyrille Fauvel - Autodesk Developer Network (ADN)
// January 2015
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
//
var express =require ('express') ;
var request =require ('request') ;
var moment =require ('moment') ;
//var async =require ('async') ;
var fs =require ('fs') ;

var router =express.Router () ;

//-----------------------------------------------------------------------------
var asyncFunction =function (args, callback) {
	setTimeout (function (args) {
		callback (null) ;
		//callback (new Error ('error')) ;
	}) ;
} ;

router.get ('/test1', function (req, res) {
	asyncFunction ({}, function (err) {
		if ( err )
			console.log (err) ;

	}) ;
	res.end () ;
}) ;

//-----------------------------------------------------------------------------
// Terms(40) - 2015-06-16T08:07:04+02:00
// fibonacci_sync(40) callback
// Returning(40): 0.003
// fibonacci_sync(40) exiting
// Exiting(40): 0.003

var fibonacci_sync_call =function (num, callback) {
	callback (null, num) ;
} ;

var fibonacci_sync_impl =function (input, callback) {
	var am =[] ;
	var handleIterationResult =function (err, result) {
		if ( err ) {
			callback (err) ;
			return ;
		}
		if ( am.length < 2)
			am.push (1) ;
		else
			am.push (am [am.length - 2] + am [am.length - 1]) ;
		if ( am.length === input.length )
			callback (null, am) ;
	} ;
	input.forEach (function (num) {
		fibonacci_sync_call (num, handleIterationResult) ;
	}) ;
} ;

function fibonacci_sync (terms, m, res) {
	var arr =Array.apply (null, { length: terms }).map (function (x, i) { return (i + 1) ; }) ;
	fibonacci_sync_impl (arr, function (err, results) {
		if ( err ) {
			console.error (err) ;
			return ;
		}
		console.log ('fibonacci_sync(' + terms + ') callback') ;
		res.json ({ 'fibonacci': results [terms - 1] + results [terms - 2] }) ;
		console.log ('Returning(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
	}) ;
	console.log ('fibonacci_sync(' + terms + ') exiting') ;
}

router.get ('/fibonaccia_sync_impl', function (req, res) {
	var terms =req.query.terms || 40 ;
	var m =moment () ;
	console.log ('Terms(' + terms + ') - ' + m.format ()) ;
	fibonacci_sync (terms, m, res) ;
	console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

//-----------------------------------------------------------------------------
// Terms(40) - 2015-06-16T08:10:31+02:00
// fibonacci_async2(40) exiting
// Exiting(40): 0.003
// fibonacci_async2(40) callback
// Returning(40): 0.007

var fibonacci_async_call =function (num, callback) {
	//callback (null, num) ;
	setTimeout (function () { callback (null, num) ; }, 0) ;
} ;

var fibonacci_async_impl =function (input, callback) {
	var am =[] ;
	var handleIterationResult =function (err, result) {
		if ( err ) {
			callback (err) ;
			return ;
		}
		if ( am.length < 2)
			am.push (1) ;
		else
			am.push (am [am.length - 2] + am [am.length - 1]) ;
		if ( am.length === input.length )
			callback (null, am) ;
	} ;
	input.forEach (function (num) {
		fibonacci_async_call (num, handleIterationResult) ;
	}) ;
} ;

function fibonacci_async2 (terms, m, res) {
	var arr =Array.apply (null, { length: terms }).map (function (x, i) { return (i + 1) ; }) ;
	fibonacci_async_impl (arr, function (err, results) {
		if ( err ) {
			console.error (err) ;
			return ;
		}
		console.log ('fibonacci_async2(' + terms + ') callback') ;
		res.json ({ 'fibonacci': results [terms - 1] + results [terms - 2] }) ;
		console.log ('Returning(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
	}) ;
	console.log ('fibonacci_async2(' + terms + ') exiting') ;
}

router.get ('/fibonaccia_async_impl', function (req, res) {
	var terms =req.query.terms || 40 ;
	var m =moment () ;
	console.log ('Terms(' + terms + ') - ' + m.format ()) ;
	fibonacci_async2 (terms, m, res) ;
	console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

//-----------------------------------------------------------------------------
/*var fetchResultFromDb =function (callback) {
 db.fetch (function (err, result) {
 if ( err )
 return (callback (err)) ;
 serializeResult (result, function (err, result) {
 if ( err )
 return (callback (err)) ;
 callback (null, result) ;
 }) ;
 }) ;
 } ;

 fetchResultFromDb (function (err, results) {
 if ( err )
 return (console.error (err)) ;

 }) ;
 */

//-----------------------------------------------------------------------------
var function1 =function (callback) {
	function2 (function (err, results) {
		if ( err ) {
			callback (err);
			return ;
		}
		function3 (results, function (err, results) {
			if ( err ) {
				callback (err) ;
				return ;
			}
			function4 (results, function (err, results) {
				if ( err ) {
					callback (err) ;
					return ;
				}
				function5 (results, function (err, results) {
					// ...
				}) ;
			}) ;
		}) ;
	}) ;
} ;

// Easier to read
var function1 =function (callback) {

	function2 (onFunction2) ;

	function onFunction2 (err2, results2) {
		if ( err2 )
			return (callback (err2)) ;
		function3 (results2, onFunction3) ;
	}

	function onFunction3 (err3, results3) {
		if ( err3 )
			return (callback (err3)) ;
		function4 (results3, onFunction4) ;
	}

	function onFunction4 (err4, results4) {
		if ( err4 )
			return (callback (err4)) ;
		function5 (results4, onFunction5) ;
	}

	function onFunction5 (err5, results5) {
		// ...
	}

} ;

// Even easier with the async library
var function1 =function () {
	async.waterfall ([
		function (callback) { // function2
			process2 (data, function (err, data) {
				callback (err, data) ;
			}) ;
		},
		function (data, callback) { // function3
			process3 (data, function (err, data) {
				callback (err, data) ;
			}) ;
		},
		function (data, callback) { // function4
			process4 (data, function (err, data) {
				callback (err, data) ;
			}) ;
		},
		function (data, callback) { // function5
			process5(data, function (err, data) {
				callback (err, data) ;
			}) ;
		}
	], function (err, results) {
		if ( err )
			return (res.status (500).send (err)) ;
		res.status (200).send () ;
	}) ;
} ;

/*
Instead of:
	function1 // lots of code
		function2 // lots of code
			function3 // lots of code
				function4 // lots of code
					function4 // lots of code

Aim for:
	function function1 (arg1, arg2, callback) { // top-level code }
	function function2 (arg1, arg2, callback) { // top-level code }
	function function3 (arg1, arg2, callback) { // top-level code }
	function function4 (arg1, arg2, callback) { // top-level code }
	function function5 (arg1, arg2, callback) { // top-level code }
	function businessLogic () { // uses the above to get the work done }
*/

function function2 (callback) {
	process2 (data, function (err, data) {
		callback (err, data) ;
	}) ;
}
function function3 (data, callback) { // function3
	process3 (data, function (err, data) {
		callback (err, data) ;
	}) ;
}
function function4 (data, callback) { // function4
	process4 (data, function (err, data) {
		callback (err, data) ;
	}) ;
}
function function5 (data, callback) { // function5
	process5(data, function (err, data) {
		callback (err, data) ;
	}) ;
}

var function1 =function (callback) {
	async.waterfall ([
		function2,
		function3,
		function4,
		function5
	], function (err, results) {
		if ( err )
			return (res.status (500).send (err)) ;
		res.status (200).send () ;
	}) ;
} ;

// Got parameters? use function factory
function function2Factory (theMagicVarRef) {
	return (function /*function2*/ (callback) {
		process2 (data, function (err, data) {
			theMagicVarRef++ ;
			callback (err, data) ;
		}) ;
	}) ;
}

var function1 =function (callback) {
	var theMagicVar =0 ;
	async.waterfall ([
		function2Factory (theMagicVar),
		function3,
		function4,
		function5
	], function (err, results) {
		if ( err )
			return (res.status (500).send (err)) ;
		res.status (200).send () ;
	}) ;
} ;

module.exports =router ;
