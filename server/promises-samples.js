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
var Q =require ('q') ;
var fs =require ('fs') ;

var router =express.Router () ;

//-----------------------------------------------------------------------------
function anasyncOperation (callback) {
	setTimeout (function () { callback (null, 1) ; }, 0) ;
}

var exampleFct =function () {
	var defer =Q.defer () ;

	anasyncOperation (function (err, data) {
		if ( err )
			defer.reject (new Error ('Error message')) ;
		else
			defer.resolve (data) ;
	}) ;

	return (defer.promise) ;
} ;

//-----------------------------------------------------------------------------
function examples () {
	return (
		exampleFct ()
			.then (function (data) {})
			.fail (function (err) {})
	) ;

	exampleFct ()
		.then (function (data) {})
		.fail (function (err) {})
		.done () ;
}

//-----------------------------------------------------------------------------
var function1 =function () {
	return (
		function2 ()
			.then (function (data) { // function3
				return (process3 (data)) ;
			})
			.then (function (data) { // function4
				return (process4 (data)) ;
			})
			.then (function (data) { // function5
				return (process5 (data)) ;
			})
			.then (function (results) {
				res.status (200).send () ;
			})
			.fail (function (err) {
				return (res.status (500).send (err)) ;
			})
	) ;
} ;

//-----------------------------------------------------------------------------
router.get ('/promises', function (req, res) {
	res.end () ;
}) ;

module.exports =router ;
