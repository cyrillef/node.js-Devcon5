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
var fs =require ('fs') ;
var unirest =require ('./index') ;
var http =require ('http') ;

var router =express.Router () ;

//-----------------------------------------------------------------------------
function fibonacci0 (n, res) {
	var am =[] ;
	async.whilst (
		function () {
			return (n - am.length != 0) ;
		},
		function (callback) {
			am.push (am.length < 2 ? 1 : am [am.length - 2] + am [am.length - 1]) ;
			callback (null) ;
		},
		function (err) {
			res.json ({ 'fibonacci': am [n - 1] }) ;
		}
	) ;
}

function fibonacci (n, res) {
	var am =[] ;
	var fibonacci_test =function () {
		return (n - am.length != 0) ;
	} ;
	var fibonaccci_compute_element =function (callback) {
		am.push (am.length < 2 ? 1 : am [am.length - 2] + am [am.length - 1]) ;
		callback (null) ;
	} ;
	async.whilst (
		fibonacci_test,
		fibonaccci_compute_element,
		function (err) {
			res.json ({ 'fibonacci': am [n - 1] }) ;
		}
	) ;
}

router.get ('/fibonacci', function (req, res) {
	var terms =req.query.terms || 40 ;
	fibonacci (terms, res) ;
}) ;

//-----------------------------------------------------------------------------
var downloadItem =function () {
	var self =this ;
	//var uri ='http://extract.autodesk.io/extracted/18683904-Suspensionipt.zip' ;
	var uri ='http://extract.autodesk.io/extracted/13358513-V8Enginef3d.zip' ;
	//var uri ='http://extract.autodesk.io/style.css' ;
	var sz =0 ;
	unirest.get (uri)
		.encoding (null)
		.progress (function (size, chunck) {
			sz +=chunck.length ;
			console.log ('% = ' + sz * 100 / size) ;
		})
		.end (function (response) {
			try {
				if ( response.statusCode != 200 )
						throw response.statusCode ;

			} catch ( err ) {

			}
		})
	;
} ;


router.get ('/download', function (req, res) {
	downloadItem() ;
	res.end () ;

}) ;

router.get ('/upload', function (req, res) {
	//fs.readFile ('C:/Users/cyrille/Box Sync/viewerModels/Urban House - 2015.rvt', function (err, data) {
	/*var sz =0 ;
		unirest.put ('http://localhost:3000/test/uploadendpoint')
			.progress (function (size, chunck) {
				sz +=chunck.length ;
				console.log ('% = ' + sz * 100 / size) ;
			})
			.attach ('file', 'C:/Users/cyrille/Box Sync/viewerModels/Urban House - 2015.rvt')
	//		.send (data)
			.end (function (response) {
				console.log ('done') ;

			})
		;*/
	//})

	fs.createReadStream('C:/Users/cyrille/Box Sync/viewerModels/Urban House - 2015.rvt')
		.on ('readable', function() {
			console.log('test') // 200
		})
		.on('data', function (chunk) {
			console.log('stream body: ' + chunk.length);
		})
		.pipe(
			//request.post('http://www.google.com/upload')
			request.post('http://localhost:3000/uploadendpoint')
				.on('response', function(response) {
					console.log(response.statusCode) // 200
					//console.log(response.headers['content-type']) // 'image/png'
				})
				.on('error', function(err) {
					console.log(err)
				})
				.on('data', function (chunk) {
					console.log('post body: ' + chunk.length);
				})
		)
	;

	res.end () ;
}) ;

router.get ('/upload2', function (req, res) {
	var options = {
		host: 'www.google.com',
		port: 80,
		path: '/upload',
		method: 'POST'
	};

	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			//console.log('BODY: ' + chunk);
		});
	});
	req.on('data', function (chunk) {
			console.log('post body: ' + chunk.length);
		})
		;

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();

	res.end () ;
}) ;

//var multipart =require ('connect-multiparty') ;
//var multipartMiddleware =multipart () ;
router.put ('/uploadendpoint', function (req, res) {

	res.end () ;

}) ;

module.exports =router ;
