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
var generatorFunction =function* () { // note asterisk
	var value =yield 1 ; // waits here for „next” call
	value ; // {}
	yield 2 ;
} ;

router.get ('/generators1', function (req, res) {
	var gen =generatorFunction () ;
	console.log (JSON.stringify (gen.next ())) ; // { value: 1, done: false }
	console.log (JSON.stringify (gen.next ({}))) ; // { value: 2, done: false }
	console.log (JSON.stringify (gen.next ())) ; // { done: true }
	res.end () ;
}) ;

//-----------------------------------------------------------------------------
function* values () {
	for ( var i =0 ; i < arguments.length ; i++ ) {
		yield arguments [i] ;
	}
}

router.get ('/generators2', function (req, res) {
	var o =values (1, 2, 3) ; // => [object Generator]
	console.log (JSON.stringify (o.next ())) ; // => { value: 1, done: false }
	console.log (JSON.stringify (o.next ())) ; // => { value: 2, done: false }
	console.log (JSON.stringify (o.next ())) ; // => { value: 3, done: false }
	console.log (JSON.stringify (o.next ())) ; // => { done: true }
	res.end () ;
}) ;

//-----------------------------------------------------------------------------
function getX () {
	return (
		Q.delay (1000)
			.thenResolve (1)
	) ;
}
function getY () {
	return (
		Q.delay (100)
			.thenResolve (2)
	) ;
}
function getZ () {
	return (
		Q.delay (500)
			.thenResolve (3)
	) ;
}

router.get ('/generators3', function (req, res) {
	var xP =getX () ;
	var yP =getY () ;
	var zP =getZ () ;
	Q.all ([ xP, yP, zP ]).spread (function (x, y, z) {
		console.log (x + y + z) ;
	}) ;
	res.end () ;
}) ;

router.get ('/generators3b', function (req, res) {
	var t =Q.async (function* () {
		var x =yield getX () ;
		var y =yield getY () ;
		var z =yield getZ () ;
		return (x + y + z) ;
	}) ;
	t ().then (function (value) {
		console.log (value) ;
	}) ;
	res.end () ;
}) ;

module.exports =router ;
