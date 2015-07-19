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

var router =express.Router () ;

//-----------------------------------------------------------------------------
function fibonacci (n, cb) {
    if ( n > 78 ) {
        if ( cb )
            return (cb ('Result will exceed a int64 limit!', null)) ;
        return (new Promise (function (resolve, reject) { reject (new Error ('Result will exceed a int64 limit!')) ; })) ;
    }
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
    return (Promise.all (promisePool)
        .then (function (data) {
            if ( cb )
                return (cb (null, data [n - 1])) ;
            return (data [n - 1]) ;
        })
        .catch (function (err) {
            if ( cb )
                return (cb (err, null)) ;
            return (new Promise (function (resolve, reject) { reject (new Error ('An Error occured!')) })) ;
        })
    ) ;
}

router.get ('/fibonaccimod1', function (req, res) {
    var terms =req.query.terms || 40 ;
    fibonacci (terms)
        .then (function (data) {
            res.json ({ 'fibonacci': data }) ;
        })
        .catch (function (err) {
            res.json ({ 'error': err }) ;
        })
    ;
}) ;

router.get ('/fibonaccimod2', function (req, res) {
    var terms =req.query.terms || 40 ;
    fibonacci (
        terms,
        function (err, data) {
            if ( err )
                return (res.json ({ 'error': err })) ;
            res.json ({ 'fibonacci': data }) ;
        }
    ) ;
}) ;

//-----------------------------------------------------------------------------
module.exports =router ;
