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
var bodyParser =require ('body-parser') ;

var EvtCbPr =require ('./EvtCbPr') ;
var async_raw_impl =require ('./async-raw-impl') ;
var async_lib =require ('./async-lib') ;
var fibonacci =require ('./fibonacci') ;
var promises =require ('./promises') ;
var mod1 =require ('./mod1') ;
var generators =require ('./generators') ;

var async_test =require ('./async-test') ;

// http://garann.github.io/template-chooser/
var app =express () ;
app.use (bodyParser.urlencoded ({ extended: false })) ;
app.use (bodyParser.json ()) ;
app.use (express.static (__dirname + '/../www')) ;
app.use ('/api', EvtCbPr) ;
app.use ('/api', async_raw_impl) ;
app.use ('/api', fibonacci) ;
app.use ('/api', promises) ;
app.use ('/api', mod1) ;
app.use ('/api', generators) ;

app.use ('/test', async_test) ;

app.set ('port', process.env.PORT || 8000) ;

module.exports =app ;
