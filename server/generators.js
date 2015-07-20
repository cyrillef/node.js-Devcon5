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
var async =require ('async') ;
var moment =require ('moment') ;

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

//-----------------------------------------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators

function* fibonacciGenerator () {
    var fn1 =1 ;
    var fn2 =1 ;
    while ( true ) {
        var current =fn2 ;
        fn2 =fn1 ;
        fn1 =fn1 + current ;
        var reset =yield current ;
        if ( reset ) {
            fn1 =1 ;
            fn2 =1 ;
        }
    }
}

function fibonacci (n, cb) {
/*    if ( n > 78 ) {
        if ( cb )
            return (cb ('Result will exceed a int64 limit!', null)) ;
        return (new Promise (function (resolve, reject) { reject (new Error ('Result will exceed a int64 limit!')) ; })) ;
    }
    var sequence =fibonacciGenerator () ;
    for ( var i =0 ; i < n - 1 ; i++ )
        sequence.next () ;
    if ( cb )
        return (cb (null, sequence.next ().value)) ;
    return (new Promise (function (resolve, reject) { resolve (sequence.next ().value) ; })) ;
*/
    if ( n > 78 ) {
        if ( cb )
            return (cb ('Result will exceed a int64 limit!', null)) ;
        return (new Promise (function (resolve, reject) { reject (new Error ('Result will exceed a int64 limit!')) ; })) ;
    }
    var sequence =fibonacciGenerator () ;
    var promisePool =Array.apply (null, Array (n - 1)).map (function (val, index) {
        return (
            new Promise (function (resolve, reject) {
                //process.nextTick (function () {
                //    setTimeout (
                //        function () {
                          resolve (sequence.next ().value) ;
                //        },
                //        100
                //    ) ;
                //}) ;
            })
        ) ;
    }) ;
    return (Promise.all (promisePool)
        .then (function (data) {
            if ( cb )
                return (cb (null, sequence.next ().value)) ;
            return (sequence.next ().value) ;
        })
        .catch (function (err) {
            if ( cb )
                return (cb (err, null)) ;
            return (new Promise (function (resolve, reject) { reject (new Error ('An Error occured!')) })) ;
        })
    ) ;
}

router.get ('/fibonaccigenerators', function (req, res) {
    var terms =req.query.terms || 40 ;
    var m =moment () ;
    console.log ('Terms(' + terms + ') - ' + m.format ()) ;
    fibonacci (terms, function (err, result) {
        if ( err )
            return (res.json ({ 'error': err })) ;
        res.json ({ 'fibonacci': result }) ;
        console.log ('Returning(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
    }) ;
    console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

//-----------------------------------------------------------------------------
function request (url) {
    // this is where we're hiding the asynchronicity,
    // away from the main code of our generator
    // `it.next(..)` is the generator's iterator-resume
    // call
    //makeAjaxCall( url, function(response){
    //    it.next( response );
    //} );
    // Note: nothing returned here!
}

function *main () {
    //var result1 =yield request ("http://www.google.com") ;
    //var result2 =yield request ("http://www.yahoo.com") ;
}

router.get ('/pagesgenerators', function (req, res) {
    var it =main () ;
    it.next () ; // get it all started
    res.end () ;
}) ;

//-----------------------------------------------------------------------------
module.exports =router ;
