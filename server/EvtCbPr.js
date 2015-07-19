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
var fs =require ('fs') ;

var router =express.Router () ;

router.get ('/test', function (req, res) {
	// https://github.com/joyent/node/blob/master/lib/fs.js
	fs.readFile ('./test.txt', 'utf-8', function (err, content) {
		if ( err )
			return (console.log (err)) ;

        // successful code here
	}) ;
	// it will execute res.end() before calling the callback
	res.end () ;
}) ;

module.exports =router ;
