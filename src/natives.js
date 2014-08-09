/*! ------------------------------------------------------------------------
//                                   Fusion
//  ------------------------------------------------------------------------
//
//                       Copyright 2014 Nicholas Gaulin
//
//       Licensed under the Apache License, Version 2.0 (the "License");
//      you may not use this file except in compliance with the License.
//                   You may obtain a copy of the License at
//
//                 http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//      distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//                       limitations under the License.
*/

// ########## NATIVE CODE ##########

// Store references to native code functions and constants
var $__object               = Object,
    $__objectProto__        = $__object.prototype,
    $__create               = $__object.create,
    $__defineProperty       = $__object.defineProperty,
    $__freeze               = $__object.freeze,
    $__getPrototypeOf       = $__object.getPrototypeOf,
    $__isExtensible         = $__object.isExtensible,
    $__isFrozen             = $__object.isFrozen,
    $__isSealed             = $__object.isSealed,
    $__keys                 = $__object.keys,
    $__preventExtensions    = $__object.preventExtensions,
    $__propertyIsEnumerable = $__object.propertyIsEnumerable,
    $__seal                 = $__object.seal,
    $__hasOwnProperty__     = $__objectProto__.hasOwnProperty,
    $__isPrototypeOf__      = $__objectProto__.isPrototypeOf,
    $__toString__           = $__objectProto__.toString,
    $__valueOf__            = $__objectProto__.valueOf,

    // ---------- ARRAY ----------
    $__array         = Array,
    $__arrayProto__  = $__array.prototype,
    $__array_isArray = $__array.isArray,

    // ---------- DATE ----------
    $__date       = Date,
    $__date_now   = $__date.now,
    $__date_parse = $__date.parse,

    // ---------- ERROR ----------
    $__error = Error,

    // ---------- NUMBER ----------
    $__number     = Number,
    $__ceil       = Math.ceil,
    $__floor      = Math.floor,
    $__isFinite   = isFinite,
    $__isNaN      = isNaN,
    $__parseFloat = parseFloat,
    $__parseInt   = parseInt,
    $__random     = Math.random,

    // ---------- STRING ----------
    $__string        = String,
    $__stringProto__ = $__string.prototype;

// If any of the ECMAScript 5 native code methods are not found, throw an exception
if (!$__create || !$__defineProperty || !$__freeze || !$__getPrototypeOf || !$__preventExtensions || !$__seal || !$__array_isArray || !$__arrayProto__.forEach || !$__arrayProto__.indexOf || !$__stringProto__.trim)
    throw new $__error('JavaScript engine does not support ECMAScript 5.');

// ---------- WINDOW ----------
var $_window = typeof window != 'undefined' && window != null && window.window === window ?
               window :
               {};