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

// babel es7/src/babel-es7.js --out-file es7/babel-es7.js --watch

//-----------------------------------------------------------------------------
export default class Greeter {

    constructor (name) {
        this.name =name ;
    }

    sayHello () {
        return ('Hello ' + this.name) ;
    }

}

//-----------------------------------------------------------------------------
var person ={} ;
var changesHandler =changes => console.log (changes) ;
Object.observe (person, changesHandler) ;

person.test =1 ;

//-----------------------------------------------------------------------------
let fibonacci = {
    [Symbol.iterator]() {
        let pre = 0, cur = 1;
        return {
            next() {
                [pre, cur] = [cur, pre + cur];
                return { done: false, value: cur }
            }
        }
    }
}

export class Fibonacci {

    static eval (terms) {

    }

}
