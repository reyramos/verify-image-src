/**
 * Created with JetBrains PhpStorm.
 * User: rramos
 * Date: 7/12/13
 * Time: 10:38 AM
 * To change this template use File | Settings | File Templates.
 */

angular.module('app').factory
	( 'utilitiesService'
	, [ '$location'
	  , '$rootScope'
	  , '$routeParams'
	  , '$timeout'
	  , '$window'
	  , function( $location, $rootScope, $routeParams, $timeout, $window ) {

		var utilities = {};
		
		// US and Canadian postal code validation.
		utilities.US_POSTAL_CODE_RX = new RegExp( /(^\d{5}$)|(^\d{5}-\d{4}$)/ );
		utilities.CA_POSTAL_CODE_RX = new RegExp( /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i );
		
		// Alphabet array.
		utilities.alphabet =
			( function(){
				var a = [];
				for( var i = 65; i <= 90; i++ ){
					a[ a.length ] = String.fromCharCode( i );
				}
				
				return a;
			  }
			)();
		
		function s4(){
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		
		utilities.stripURLParams = function( params ){
			// params: Array of URL param keys to delete.
			var getParams = $location.$$search;
			
			for( var key in getParams){
				for( var i = 0; i < params.length; i++ ){
					if( key == params[ i ] ){
						delete getParams[ key ];
					}
				}
			}
			
			return getParams;
		}

		utilities.inArray = function( value, array){
			for(var i in array){
				if(array[i].toLowerCase() == value.trim().toLowerCase())
				return true
			}

			return false;
		}


		utilities.clearContents = function(element){
			try{
				var node = $window.document.getElementById(element);
				while(node.hasChildNodes()){
					node.removeChild(node.firstChild);
				}
			}
			catch(errror){
				
			}
		}

		utilities.guid = function(){
			return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
		}

		utilities.getBoolean = function( value ) {
			// TODO: look at using !! inplace of this function
			if( typeof value == 'undefined' ) {
				value = false;
			}

			if( typeof value != 'boolean' ) {
				switch( value.toString().toLowerCase() ) {
					case 'true':
					case 'yes':
					case 'ok':
					case '1':
						value = true;
					break;

					case 'false':
					case 'no':
					case 'failed':
					case '0':
						value = false;
					break;

					default:
						value = new Boolean(value).valueOf();
					break;
				}
			}
			return value;
		};

		utilities.getMerchant = function() {
			var merchant = '';
			try{
				if ( ($location.$$host != 'store.accesso.com' && $location.$$host != 'stg-store.accesso.com') && $location.$$search.m){
					return $location.$$search.m;
				} else if ( $routeParams.merchant ) {
					return $routeParams.merchant;
				} else {
					return window.location.href.toString().split(window.location.host)[1].split('/')[1].split('?')[0];
				}
			}catch(e){
				return merchant;
			}
		};

		utilities.arrayUnique = function(array ) {
			var a = array.concat();
			for( var i=0; i < a.length; ++i ) {
				for( var j = i+1; j < a.length; ++j ) {
					if( a[i] === a[j] ) {
						a.splice(j--, 1);
					}
				}
			}
			return a;
		};
		/**
		 * Loop through an object to search if key exist
		 * @param value, string
		 * @param obj, object to search the string into
		 * @returns {boolean}
		 */
		utilities.objectKeyExists = function(value, obj ) {
			// null and undefined are empty
			if( obj === null || typeof(obj) == 'undefined' ) {
				return false;
			}
			var results = false;
			Object.keys(obj).forEach(function(key) {

				if(key.toLowerCase() ===  value.trim().toLowerCase()){
					results = true;
				}

			});

			return results;
		};

		utilities.arrayIntersection = function( x, y ) {
			var ret = [];
			for ( var i = 0; i < x.length; i++ ) {
				for ( var z = 0; z < y.length; z++ ) {
					if ( x[i] == y[z] ) {
						ret.push(i);
						break;
					}
				}
			}
			return ret;
		};

		/*
		 * This function checks if an object is empty
		 *
		 * EXAMPLE USES:
		 * isEmpty("") // True
		 * isEmpty([]) // True
		 * isEmpty({}) // True
		 * isEmpty({length: 0, custom_property: []}) // True
		 * isEmpty("Hello") // False
		 * isEmpty([1,2,3]) // False
		 * isEmpty({test: 1}) // False
		 * isEmpty({length: 3, custom_property: [1,2,3]}) // False
		*/
		utilities.isEmpty = function( object ) {

			// null and undefined are empty
			if( object === null || typeof(object) == 'undefined' ) {
				return true;
			}

			// Assume if it has a length property with a non-zero value
			// that that property is correct.
			if( Object.keys(object).length && Object.keys(object).length > 0 ) {
				return false;
			}
			if( Object.keys(object).length === 0 ) {
				return true;
			}
			for( var key in object ) {
				if( hasOwnProperty.call( object, key ) ) {
					return false;
				}
			}
			// Doesn't handle toString and toValue enumeration bugs in IE < 9
			return true;
		};

		/**
	 * Inspect the string with JQuery format,reference to the element by its ID or Class and resturn Object
	 * @param name reference to the element by its ID or Class, tag name
	 * Ex: #name, .name, name
	 * @returns Object
	 */

	  document.getElementsByAttribute = Element.prototype.getElementsByAttribute = function(attr) {
		  var nodeList = this.getElementsByTagName('*');
		  var nodeArray = [];

		  for (var i = 0, elem; elem = nodeList[i]; i++) {
			  if ( elem.getAttribute(attr) ) {
					nodeArray.push(elem);
				}
		  }

		  return nodeArray;
	  };

		utilities.toggleMenu = function(){

			$rootScope.state.showMainMenu = !$rootScope.state.showMainMenu;
			
			if($rootScope.state.showMainMenu){
				utilities.getObject('#navigation-view').css({'display':'inline'});

				$timeout(function(){
					utilities.getObject('#promobox').css({'pointer-events':'all'});
				}, 1000);
			}else{

				//utilities.getObject('#application-view').css({'position':'fixed','left':'0px'});
				utilities.getObject('#navigation-view').css({'display':'none'});
				utilities.getObject('#promobox').css({'pointer-events':'none'});

//				$timeout(function(){
//					utilities.getObject('#application-view').removeAttr('style');
//				}, 1000);

			}
		};

		var setTransitionEvents = (function (){
			var handler = ['webkitTransitionEnd', 'oTransitionEnd', 'transitionend']
			var isSupported = null;
			for(var i in handler){
				var  testEvent = handler[i].trim()
				if(isSupported == null){
					Object.keys($window['__proto__']).forEach(function(key) {
						if(key.toLowerCase() ===  testEvent.toLowerCase() || key.toLowerCase() ===  'on'+testEvent.toLowerCase()){
							isSupported = testEvent;
						}
					});
				}
			}

			return isSupported;
		})();


		utilities.getObject = function( name ) {

			var n=name.substr(0,4);
			//TODO: working create ability to gather js data-attributes
			if(n == 'data'){
				var value = [];
				var allElements = angular.element( document );
				for (var i = 0; i < allElements.length; i++){
					
				}

			}else{
				switch( name[0] ) {
					case '#':
						var value = angular.element( document.getElementById( name.substring( 1 ) ) );
						break;
					case '.':
						var value = angular.element( document.getElementsByClassName( name.substring(1) ) );
						break;
					default:
						var value = angular.element( document.getElementsByTagName( name ) );
						break;
				}
			}

			return value;
		};

		/**
		 * Set the position of the window back to top
		* This is currently being used in routeTo()
		*/
		utilities.scrollPosition = function() {
			$window.scrollTo(0, 0)
			var object = utilities.getObject('#application-view');

			//HACK FOR IOS DEVICES
			object.css({'pointer-events':'none'});
			$timeout
				( 	function() {
						object.css({'pointer-events':'all'});
					}
					, 1000
				);
		};

		/**
		* Set the position of the window back to top
		* This is currently being used in routeTo()
		*/
		utilities.isValidEmail = function( email ) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		};

		/**
		 * This function is here to deal with an issue that
		 *
		 TEMPORARY FIX, angular.copy() is supposed to strip out the hashKey values, but currently is not.
		 There is a pull request,
		 https://github.com/angular/angular.js/pull/2423
		 https://github.com/angular/angular.js/pull/2382
		 *
		 */

		function isWindow(obj) {
			return obj && obj.document && obj.location && obj.alert && obj.setInterval;
		}


		function isScope(obj) {
			return obj && obj.$evalAsync && obj.$watch;
		}

		utilities.copyObject = function(source, destination ) {

			if( isWindow(source) || isScope(source) ) throw Error("Can't copy Window or Scope");

			if( !destination ) {
				destination = source;
				if( source ) {
					if( angular.isArray(source) ) {
						destination = utilities.copyObject(source, []);
					} else if( angular.isDate(source) ) {
						destination = new Date(source.getTime());
					} else if( angular.isObject(source) ) {
						destination = utilities.copyObject(source, {});
					}
				}
			} else {
				if( source === destination ) throw Error("Can't copy equivalent objects or arrays");

				if( angular.isArray(source) ) {
					destination.length = 0;

					for(var i = 0; i < source.length; i++ ) {
						destination.push( utilities.copyObject( source[i] ) );
					}
				} else {
					angular.forEach(destination, function(value, key ) {
						delete destination[key];
					});

					for(var key in source ) {
						if(source.hasOwnProperty(key) && key.substr(0, 2) !== '$$' ) {
							destination[key] = utilities.copyObject(source[key]);
						}
					}
				}
			}

			return destination;
		};

		// Taken from http://phpjs.org/functions/utf8_encode/
		utilities.utf8_encode = function(argString) {
			// http://kevin.vanzonneveld.net
			// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
			// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +   improved by: sowberry
			// +    tweaked by: Jack
			// +   bugfixed by: Onno Marsman
			// +   improved by: Yves Sucaet
			// +   bugfixed by: Onno Marsman
			// +   bugfixed by: Ulrich
			// +   bugfixed by: Rafal Kukawski
			// +   improved by: kirilloid
			// +   bugfixed by: kirilloid
			// *     example 1: utf8_encode('Kevin van Zonneveld');
			// *     returns 1: 'Kevin van Zonneveld'

			if (argString === null || typeof argString === "undefined") {
				return "";
			}

			var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			var utftext = '',
				start, end, stringl = 0;

			start = end = 0;
			stringl = string.length;
			for (var n = 0; n < stringl; n++) {
				var c1 = string.charCodeAt(n);
				var enc = null;

				if (c1 < 128) {
					end++;
				} else if (c1 > 127 && c1 < 2048) {
					enc = String.fromCharCode(
						(c1 >> 6)        | 192,
						( c1        & 63) | 128
					);
				} else if (c1 & 0xF800 != 0xD800) {
					enc = String.fromCharCode(
						(c1 >> 12)       | 224,
						((c1 >> 6)  & 63) | 128,
						( c1        & 63) | 128
					);
				} else { // surrogate pairs
					if (c1 & 0xFC00 != 0xD800) { throw new RangeError("Unmatched trail surrogate at " + n); }
					var c2 = string.charCodeAt(++n);
					if (c2 & 0xFC00 != 0xDC00) { throw new RangeError("Unmatched lead surrogate at " + (n-1)); }
					c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
					enc = String.fromCharCode(
						(c1 >> 18)       | 240,
						((c1 >> 12) & 63) | 128,
						((c1 >> 6)  & 63) | 128,
						( c1        & 63) | 128
					);
				}
				if (enc !== null) {
					if (end > start) {
						utftext += string.slice(start, end);
					}
					utftext += enc;
					start = end = n + 1;
				}
			}

			if (end > start) {
				utftext += string.slice(start, stringl);
			}

			return utftext;
		};

		utilities.preventDefault = function( event ){

			event.preventDefault();

			if(event && event.stopPropagation){
				event.stopPropagation();
			} else {
				e = window.event;
				e.cancelBubble = true;
			}
		};

		// Taken from http://phpjs.org/functions/md5/
		utilities.md5 = function(str) {
			// http://kevin.vanzonneveld.net
			// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
			// + namespaced by: Michael White (http://getsprink.com)
			// +    tweaked by: Jack
			// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +      input by: Brett Zamir (http://brett-zamir.me)
			// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// -    depends on: utf8_encode
			// *     example 1: md5('Kevin van Zonneveld');
			// *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
			var xl;

			var rotateLeft = function (lValue, iShiftBits) {
				return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
			};

			var addUnsigned = function (lX, lY) {
				var lX4, lY4, lX8, lY8, lResult;
				lX8 = (lX & 0x80000000);
				lY8 = (lY & 0x80000000);
				lX4 = (lX & 0x40000000);
				lY4 = (lY & 0x40000000);
				lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
				if (lX4 & lY4) {
					return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
				}
				if (lX4 | lY4) {
					if (lResult & 0x40000000) {
						return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
					} else {
						return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
					}
				} else {
					return (lResult ^ lX8 ^ lY8);
				}
			};

			var _F = function (x, y, z) {
				return (x & y) | ((~x) & z);
			};
			var _G = function (x, y, z) {
				return (x & z) | (y & (~z));
			};
			var _H = function (x, y, z) {
				return (x ^ y ^ z);
			};
			var _I = function (x, y, z) {
				return (y ^ (x | (~z)));
			};

			var _FF = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var _GG = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var _HH = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var _II = function (a, b, c, d, x, s, ac) {
				a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
				return addUnsigned(rotateLeft(a, s), b);
			};

			var convertToWordArray = function (str) {
				var lWordCount;
				var lMessageLength = str.length;
				var lNumberOfWords_temp1 = lMessageLength + 8;
				var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
				var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
				var lWordArray = new Array(lNumberOfWords - 1);
				var lBytePosition = 0;
				var lByteCount = 0;
				while (lByteCount < lMessageLength) {
					lWordCount = (lByteCount - (lByteCount % 4)) / 4;
					lBytePosition = (lByteCount % 4) * 8;
					lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
					lByteCount++;
				}
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
				lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
				lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
				return lWordArray;
			};

			var wordToHex = function (lValue) {
				var wordToHexValue = "",
					wordToHexValue_temp = "",
					lByte, lCount;
				for (lCount = 0; lCount <= 3; lCount++) {
					lByte = (lValue >>> (lCount * 8)) & 255;
					wordToHexValue_temp = "0" + lByte.toString(16);
					wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
				}
				return wordToHexValue;
			};

			var x = [],
				k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
				S12 = 12,
				S13 = 17,
				S14 = 22,
				S21 = 5,
				S22 = 9,
				S23 = 14,
				S24 = 20,
				S31 = 4,
				S32 = 11,
				S33 = 16,
				S34 = 23,
				S41 = 6,
				S42 = 10,
				S43 = 15,
				S44 = 21;

			str = this.utf8_encode(str);
			x = convertToWordArray(str);
			a = 0x67452301;
			b = 0xEFCDAB89;
			c = 0x98BADCFE;
			d = 0x10325476;

			xl = x.length;
			for (k = 0; k < xl; k += 16) {
				AA = a;
				BB = b;
				CC = c;
				DD = d;
				a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
				d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
				c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
				b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
				a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
				d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
				c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
				b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
				a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
				d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
				c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
				b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
				a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
				d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
				c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
				b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
				a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
				d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
				c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
				b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
				a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
				d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
				c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
				b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
				a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
				d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
				c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
				b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
				a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
				d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
				c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
				b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
				a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
				d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
				c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
				b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
				a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
				d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
				c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
				b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
				a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
				d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
				c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
				b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
				a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
				d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
				c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
				b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
				a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
				d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
				c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
				b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
				a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
				d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
				c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
				b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
				a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
				d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
				c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
				b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
				a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
				d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
				c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
				b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
				a = addUnsigned(a, AA);
				b = addUnsigned(b, BB);
				c = addUnsigned(c, CC);
				d = addUnsigned(d, DD);
			}

			var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

			return temp.toLowerCase();
		};

		utilities.getYear = function() {
			var d = new Date(); return d.getFullYear();
		};

		utilities.supports_video = function () {
				return !!document.createElement('video').canPlayType;
			}

		utilities.supports_h264_baseline_video = function () {
				if (!utilities.supports_video()) { return false; }
				var v = document.createElement("video");
				return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
			}

		utilities.supports_ogg_theora_video = function () {
				if (!utilities.supports_video()) { return false; }
				var v = document.createElement("video");
				return v.canPlayType('video/ogg; codecs="theora, vorbis"');
			}

		utilities.supports_webm_video = function () {
				if (!utilities.supports_video()) { return false; }
				var v = document.createElement("video");
				return v.canPlayType('video/webm; codecs="vp8, vorbis"');
			}


		return utilities;
  }]);
