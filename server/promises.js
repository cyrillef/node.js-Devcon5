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
/*var email =getUser ()
    .then (function (user) {
        return (user.email) ;
    })
    .catch (function (err) {
        log.error ({ 'err': err }, '-') ;
        throw new BadUserName () ;
    })
;*/

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
			.catch (function (err) { // fail()
				return (res.status (500).send (err)) ;
			})
	) ;
} ;

//-----------------------------------------------------------------------------
function test () {
    var promise =new Promise (function (resolve, reject) {
        // do a thing, possibly async, then…
        if ( 1 === 1 ) {
            resolve ("Stuff worked!") ;
        } else {
            reject (new Error ("It broke")) ;
        }
    }) ;

    promise
        .then (function (message) {
            console.log (message) ;
            //throw new Error ('argh!') ;
        })
        .catch (
            function (err) {
                console.log (err) ;
        })
    ;
}

//-----------------------------------------------------------------------------
function fibonacci (n) {
    if ( n > 78 )
        return (new Promise (function (resolve, reject) { reject (new Error ('Result will exceed a int64 limit!')) ; })) ;

    var am =Array.apply (null, Array (n)).map (function (x, i) { return (i) ; }) ;
    var promisePool =am.map (function (val, index) {
        return (
            new Promise (function (resolve, reject) {
                process.nextTick (function () {
                    am [index] =(index < 2 ? 1 : am [index - 2] + am [index - 1]) ;
                    resolve (am [index]) ;
                }) ;
            })
        ) ;
    }) ;
    return (Promise.all (promisePool)) ;
}


router.get ('/fibonaccipromise', function (req, res) {
    var terms =req.query.terms || 40 ;
    var m =moment () ;
    console.log ('Terms(' + terms + ') - ' + m.format ()) ;
    fibonacci (terms)
        .then (function (data) {
            console.log ('fibonacci(' + terms + ') callback') ;
            res.json ({ 'fibonacci': data [terms - 1] }) ;
            console.log ('Returning(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
        })
        .catch (function (err) {
            res.json ({ 'error': err }) ;
        })
    ;
    console.log ('Exiting(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;

//-----------------------------------------------------------------------------
module.exports =router ;
