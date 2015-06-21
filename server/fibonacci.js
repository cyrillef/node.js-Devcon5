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
var async =require ('async') ;

var router =express.Router () ;

//-----------------------------------------------------------------------------
// Terms=40 2015-06-16T08:59:54+02:00
// Exiting(40): 3.828

function fibonacci_0 (n) {
	var fn =f1 =f2 =1 ;
	for ( var i =2 ; i <= n ; i++ ) {
		fn =f1 + f2 ;
		f2 =f1 ;
		f1 =fn ;
	}
	return (fn) ;
}

function fibonacci_1 (n) {
	return (n < 3 ? 1 : fibonacci_1 (n - 2) + fibonacci_1 (n - 1)) ;
}

router.get ('/fibonacci', function (req, res) {
	var terms =req.query.terms || 40 ;
	var m =moment () ;
	console.log ('Terms=' + terms + ' ' + m.format ()) ;
	res.json ({ 'fibonacci': fibonacci_1 (terms) }) ;
	console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

//-----------------------------------------------------------------------------
// http://ivan.themworks.com/fibonacci-sequence-calculator-with-memoization/
var a =[], fibonacci_opt =function (n) {
	if ( n < 1 )
		return (-1) ;
	else if ( n < 3 )
		return (1) ;
	else if ( a [n] )
		return (a [n]) ;
	else {
		var x =fibonacci_opt (n - 1) + fibonacci_opt (n - 2)  ;
		a [n] =x ;
		return (x) ;
	}
}

router.get ('/fibonacciopt', function (req, res) {
	var terms =req.query.terms || 40 ;
	var m =moment () ;
	console.log ('Terms=' + terms + ' ' + m.format ()) ;
	res.json ({ 'fibonacci': fibonacci_opt (terms) }) ;
	console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

//-----------------------------------------------------------------------------
function fibonacci (n, m, res) {
	var am =[] ;
	async.whilst (
		function () {
			return (n - am.length != 0) ;
		},
		function (callback) {
			//console.log ('fibonacci compute') ;
			am.push (am.length < 2 ? 1 : am [am.length - 2] + am [am.length - 1]) ;
			callback (null) ;
			//setTimeout (callback, 1000) ;
		},
		function (err) {
			console.log ('fibonacci(' + n + ') callback') ;
			res.json ({ 'fibonacci': am [n - 1] }) ;
			console.log ('Returning(' + n + '): ' + moment ().diff (m, 'seconds', true)) ;
		}
	) ;
	console.log ('fibonacci(' + n + ') exiting') ;
}

router.get ('/fibonacciasync', function (req, res) {
	var terms =req.query.terms || 40 ;
	var m =moment () ;
	console.log ('Terms(' + terms + ') - ' + m.format ()) ;
	fibonacci (terms, m, res) ;
	console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

//-----------------------------------------------------------------------------
function fibonacci_slow (n, m, res) {
	var am =[] ;
	async.whilst (
		function () {
			return n - am.length != 0 ;
		},
		function (callback) {
			//console.log ('fibonacci compute') ;
			am.push (am.length < 2 ? 1 : am [am.length - 2] + am [am.length - 1]) ;
			//callback (null) ;
			setTimeout (callback, 1000) ; // get me slow
		},
		function (err) {
			console.log ('fibonaccislow(' + n + ') callback') ;
			res.json ({ 'fibonacci': am [n - 1] }) ;
			console.log ('Returning(' + n + '): ' + moment ().diff (m, 'seconds', true)) ;
		}
	) ;
	console.log ('fibonaccislow(' + n + ') exiting') ;
}

router.get ('/fibonacciasyncslow', function (req, res) {
	var terms =req.query.terms || 40 ;
	var m =moment () ;
	console.log ('Terms(' + terms + ') - ' + m.format ()) ;
	fibonacci_slow (terms, m, res) ;
	console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

module.exports =router ;
