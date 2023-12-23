/**
 * @in: array (any Array of comparable elements)
 * @in: condition (function of two arguments comparing first (array element) to second (current ideal))
 * @out: array element best of specified condition
 */
function bestOfCondition(array, condition) {
	if (!Array.isArray(array)) return undefined;
	result = [array[0], 0];
	for (var i = 1; i < array.length; i++)
		if (condition(array[i],result[0]))
			result = [array[i], i];
	return result;
}

function conditionLess(arrayElement, ideal) {return arrayElement < ideal;}
function conditionGreater(arrayElement, ideal) {return arrayElement > ideal;}
function conditionLessPositive(arrayElement, ideal) {return ideal == 0 || arrayElement != 0 && arrayElement < ideal;}

/**
 * @in: x (array of elements or first in a row of comparable arguments)
 * @out: minimal element of x (or of all the arguments given)
 */
function minimal(x) {
	var lookThrough = Array.isArray(x) ? x : Array.prototype.slice.call(arguments);
	return bestOfCondition(lookThrough, conditionLess);
}

function minimalPositive(x) {
	var lookThrough = Array.isArray(x) ? x : Array.prototype.slice.call(arguments);
	return bestOfCondition(lookThrough, conditionLessPositive);
}

/**
 * @in: x (array of elements or first in a row of comparable arguments)
 * @out: maximal element of x (or of all the arguments given)
 */
function maximal(x) {
	var lookThrough = Array.isArray(x) ? x : Array.prototype.slice.call(arguments);
	return bestOfCondition(lookThrough, conditionGreater);
}

/**
 * @in: x (array of real size n)
 * @in: y (array of real size n)
 * @out: euclidean distance between x and y
 */
function distanceBetween(x, y) {
	// TODO make multi-dimensional
	return Math.sqrt((x[0]-y[0])*(x[0]-y[0]) + (x[1]-y[1])*(x[1]-y[1]));
}

/**
 * @in: val (integer)
 * @in: mod (integer)
 * @out: val modulo mod (non-negative integer)
 */
function byMod(val, mod) {
	return (val % mod + mod) % mod;
}

/**
 * @in: val (number)
 * @in: mod (number, non-negative)
 * @out: if |val| <= mod then val; otherwise mod or -mod, depending on val sign (number)
 */
function trunc(val, mod) {
	return Math.min(mod, Math.max(-mod, val));
}

/**
 * @in: obj (any type)
 * @out: clone of obj
 */
/*function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}*/

/**
 * @in: n (integer)
 * @out: # of ones in binary representation of n (integer)
 */
function countOnes(n) {
	var result = 0;
	while (n) {
		n &= n-1;
		result++;
	}
	return result;
}

/*function divisors(n) {
	var result = 1;
	for (var i = 2; i < Math.sqrt(n); i++)
		if (!(n%i)) result++;
	//if (Math.sqrt(n) == Math.floor(Math.sqrt(n))) result++;
	return result;
}*/

/**
 * @in: value (integer)
 * @in: bit (integer)
 * @out: bit position in value (0 or 1)
 */
function getBit(value, bit) {
	return (value & (1 << bit)) >> bit;
}

/**
 * @in: x (any type)
 * @out: convertation to integer
 */
function int(x) {
	return parseInt(x) || 0;
}

/**
 * @in: n (any type)
 * @out: is n a finite number (boolean)
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * @in: x == {n}
 * n == m * 2^k (m is odd) - non-negative integer
 * n becomes m
 * @out: k (integer)
 */
function oddify(x) {
	var result = 0;
	var one = 1;
	while (~x.n & one) {
		one <<= 1;
		result++;
	}
	x.n >>= result;
	return result;
}

/**
 * @in: n (integer)
 * @out: whether n is a prime (boolean)
 */
function isPrime(n) {
	for (var i = 2; i <= Math.sqrt(n); ++i)
		if (n % i == 0) return false;
	return true;
}

/**
 * @in: x (integer)
 * @out: object with keys representing primes and values being number of times a prime is included in x
 */
function factorize(x) {
	x = Math.abs(x);
	if (x == 1) return {1: 1};
	var result = {};
	for (var i = 2; i <= x; i++)
		if (x % i == 0) {
			if (result[i] !== undefined) result[i]++;
			else result[i] = 1;
			x /= i;
			i--;
		}
	return result;
}

function intersect(fact1, fact2) {
	if (objectIsEmpty(fact2)) return fact1;
	if (objectIsEmpty(fact1)) return fact2;
	var result = {};
	for (var key in fact1)
		if (fact2[key] !== undefined)
			result[key] = Math.min(fact1[key], fact2[key]);
	if (objectIsEmpty(result)) return {1: 1};
	return result;
}

// == factorized^(-1)
function compose(factorized) {
	var result = 1;
	for (var key in factorized) {
		for (var i = 0; i < factorized[key]; i++)
			result *= key;
	}
	return result;
}

function GCDbasic(m, n) {
	var arr = [Math.abs(m), Math.abs(n)];
		while (arr[1] > 0)
			arr = [arr[1], arr[0] % arr[1]];
		return arr[0];
}

/**
 * @in: m (integer (case 1) or array (case 2))
 * @in: n (integer (case 1) or undefined (case 2))
 * @out: greatest common denominator of m and n (case 1) or all m elements (case 2) (integer)
 */
function GCD1(m, n) {
	if (arguments.length == 2) {
		return GCDbasic(m, n);
	}
	if (arguments.length > 2) return GCD1(Array.prototype.slice.call(arguments));
	// now m is array; loop through primes may be more effective than consequent GCD computing
	var len = m.length;
	var n = m.slice();  // prevent array change
	for (var i = 0; i < len; i++)
		n[i] = Math.abs(n[i]);  // could have used Array.prototype.convert from Proto.js
	var minElem = minimalPositive(n);
	for (var i = minElem[0]; i > 1; i--) {
		if (minElem[0] % i != 0) continue;
		var left = false;
		for (var j = 0; j < len; j++)
			if (n[j] % i != 0) {
				left = true;
				break;
			}
		if (!left) return i;
	}
	return 1;
}

function GCD2(m, n) {
	if (arguments.length == 2) {
		return GCDbasic(m, n);
	}
	if (arguments.length > 2) return GCD2(Array.prototype.slice.call(arguments));
	var len = m.length;
	if (len == 2) return GCDbasic(m[0], m[1]);
	var newArray = [];
	for (var i = 0; i < len; i += 2) {
		var newElement = i + 1 < len ? GCDbasic(m[i], m[i + 1]) : m[i];
		if (newElement == 1) return 1;
		newArray.push(newElement);
	}
	return GCD2(newArray) || 1;
}

function GCD3(m, n) {
	if (arguments.length == 2) {
		return GCDbasic(m, n);
	}
	if (arguments.length > 2) return GCD3(Array.prototype.slice.call(arguments));
	var len = m.length;
	var result = factorize(m[0]);
	for (var i = 1; i < len; i++) {
		if (result[1] == 1) return 1;
		result = intersect(result, factorize(m[i]));
	}
	return compose(result);
}

function GCD4(m, n) {
	if (arguments.length == 2) {
		return GCDbasic(m, n);
	}
	if (arguments.length > 2) return GCD4(Array.prototype.slice.call(arguments));
	var len = m.length;
	var allZeros;
	var n = m.slice();  // prevent array change
	for (var i = 0; i < len; i++)
		n[i] = Math.abs(n[i]);
	
	do {
		var minElem = minimalPositive(n);
		if (minElem[0] == 0) return 1;  // array of all zeros
		var elem = n[minElem[1]];
		n[minElem[1]] = n[0];
		n[0] = minElem[0];  // now first is minimal
		allZeros = true;
		for (var i = 1; i < len; i++) {
			n[i] %= n[0];
			if (n[i] != 0 && allZeros) allZeros = false;
			if (n[i] == 1) return 1;
		}
		if (allZeros) return n[0];
	} while (1);
	return 1;
}

// UNITS == # of tests
// SIZE == size of arrays to test
// COMPOSED == flag if numbers in array have GCD > 1
function GCDtest(UNITS, SIZE, COMPOSED) {
	//var UNITS = 1000;
	//var SIZE = 100;
	var SPREAD = 5000;
	//var COMPOSED = true;
	var arr = [];
	var multiplier = 1;
	var timeTotal = [0,0,0];
	var time;
	var sum = 0;
	for (var i = 0; i < UNITS; i++) {
		if (COMPOSED) multiplier = randomIntegerInRange(2, 5);
		for (var j = 0; j < SIZE; j++)
			arr[j] = multiplier * randomIntegerInRange(1, SPREAD);
		
		time = performance.now();
		var gcd1 = GCD1(arr.slice());
		sum += gcd1;
		timeTotal[0] += performance.now() - time;
		
		/*time = performance.now();
		var gcd2 = GCD2(arr.slice());
		timeTotal[1] += performance.now() - time;
		
		time = performance.now();
		var gcd3 = GCD3(arr.slice());
		timeTotal[2] += performance.now() - time;*/
	}
	console.log(format(timeTotal[0]));
	console.log(sum);  // prevent skips & time saving
}

/**
 * @in: minimal (number)
 * @in: maximal (number)
 * @out: random number in [min, max)
 */
function randomInRange(minimal, maximal) {
	return Math.random() * (maximal - minimal) + minimal;
}

/**
 * @in: minimal (integer)
 * @in: maximal (integer)
 * @out: random integer in [min, max)
 */
randomIntegerInRange = (minimal, maximal) => Math.floor(Math.random() * (maximal - minimal) + minimal);

/**
 * @in: maximal (integer)
 * @out: random integer in [0, max)
 */
randomInteger = maximal => Math.floor(Math.random() * maximal);

/**
 * @in: fromto (Array[Number])
 * @in: percent (real in range [0, 1])
 * @out: linearly interpolated value between fromto[0] and fromto[1] (Number)
 */
interpolate = (fromto, percent) => fromto[0] + (fromto[1] - fromto[0]) * percent;

/**
 * @in: x (Number)
 * @in: precision (non-negative integer)
 * @out: decimal truncation of x to precision digits (Number)
 */
function format(x, precision = 4) {
	var ten = Math.pow(10, precision);
	return Math.round(x * ten) / ten;
}

/**
 * @in: x (Number)
 * @out: "y.yy%" format for x (string)
 */
function formatPercent(x, precision = 2) {
	var ten = Math.pow(10, precision);
	return Math.round(x * 100 * ten) / ten + "%";
}

/**
 * @in: arr (array)
 * @in: n (integer)
 * @out: subarray of arr containing n its random elements (array)
 */
function pickElements(arr, n) {
	if (n >= arr.length) return arr.slice();
	if (n < 0) {
		console.warn("Trying to pick negative amount of elements from an array");
		return false;
	}
	var result = [];
	var indices = [];
	for (var i = 0; i < n; i++) {
		var idx = Math.floor(Math.random() * arr.length);
		if (indices.indexOf(idx) != -1) {
			i--;
			continue;
		}
		indices.push(idx);
		result.push(typeof arr[idx] === "object" ? Object.clone(arr[idx], true, true) : arr[idx]);  // TODO works if arr elements are also arrays
	}
	return result;
}

//******************* DOM functions *******************//

/**
 * @in: id (string)
 * @out: element with this id
 */
$ = id => document.getElementById(id);

objectIsEmpty = object => Object.entries(object).length === 0 && object.constructor === Object;

/**
 * @in: className (string)
 * modifies element's class list
 */
acn = (element, className) => element.classList.add   (className);
rcn = (element, className) => element.classList.remove(className);
tcn = (element, className) => element.classList.toggle(className);

/**
 * @in: element (DOMElement)
 * @in: event (string)
 * @in: f (function with optional argument event)
 * adds event listener
 */
ael  = (element, event, f) => element.   addEventListener(event, f);
rel  = (element, event, f) => element.removeEventListener(event, f);
aelc = (element,        f) => ael(element, "click", f);

//******************* Canvas functions *******************//

function drawGraphic(c, pts, stroke, fill) {
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	var h = c.height;
	ctx.beginPath();
	ctx.strokeStyle = stroke;
	var minimum = pts[0][1];
	ctx.moveTo(pts[0][0], h - pts[0][1]);
	for (var i = 1; i < pts.length; i++) {
		ctx.lineTo(pts[i][0], h - pts[i][1]);
		if (pts[i][1] < minimum) minimum = pts[i][1];
	}
	ctx.lineTo(pts[i-1][0], h - minimum);
	ctx.lineTo(pts[0][0], h - minimum);
	ctx.stroke();
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	ctx.closePath();
}