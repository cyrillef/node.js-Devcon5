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
var nodent =require ('nodent') () ;
'use nodent-es7' ;
//'use nodent-promise' ;

var express =require ('express') ;

var router =express.Router () ;

//-----------------------------------------------------------------------------
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

async function fibonacci (n, cb) {
     if ( n > 78 ) {
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
}

router.get ('/fibonaccies7', function (req, res) {
    var terms =req.query.terms || 40 ;
    var m =moment () ;
    console.log ('Terms(' + terms + ') - ' + m.format ()) ;
    var result =await fibonacci (terms) ;
    res.json ({ 'fibonacci': result }) ;
    console.log ('Returning(' + terms + '): ' + moment ().diff (m, 'seconds', true)) ;
}) ;


//-----------------------------------------------------------------------------
module.exports =router ;
