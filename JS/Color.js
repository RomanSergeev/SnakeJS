function Color(r, g, b, a, format="rgba") {
	// TODO add construct instance of number, implement it in aelc(img)
	// remvoe code from createPaletteElements
	var that = this;
	
	function construct(r, g, b, a) {
		that.r = Math.min(255, Math.max(0, Math.floor(+r) || 0));
		that.g = Math.min(255, Math.max(0, Math.floor(+g) || 0));
		that.b = Math.min(255, Math.max(0, Math.floor(+b) || 0));
		that.a = Math.min(255, Math.max(0, Math.floor(+a) || 0));
	}
	
	if (arguments.length == 1) {
		if (r instanceof Color)
			construct(r.r, r.g, r.b, r.a);
		else if (typeof r == "number")
			construct(r & 255, (r >> 8) & 255, (r >> 16) & 255, (r >> 24) & 255);
		else if (Array.isArray(r))
			construct(r[0], r[1], r[2], r[3]);
		else {  // assume it's a string
			r = r.split(' ').join('');
			var rgb = [], a1 = 255;
			if (/^rgb\(\d+,\d+,\d+\)$/i.test(r)) {
				rgb = r.match(/\d+/g);
			} else if (/^rgba\(\d+,\d+,\d+,(\d*\.)?\d+\)$/i.test(r)) {
				rgb = r.match(/\d+/g);
				//var parts = r.match(/\d+/g);
				if (rgb.length == 4) a1 = Math.floor(+rgb[3] * 255);  // it can be either "0", "1" or ".123", "0.123"
				else a1 = Math.floor(+(rgb[3] + "." + rgb[4]) * 255);
				//a1 = r.match(/\.\d+/);
			} else if (/^#[0-9a-f]{6}$/i.test(r)) {
				rgb = [
					parseInt(r.substr(1, 2), 16),
					parseInt(r.substr(3, 2), 16),
					parseInt(r.substr(5, 2), 16)];
			} else if (/^#[0-9a-f]{3}$/i.test(r)) {
				rgb = [
					parseInt(r[1], 16) * 17,
					parseInt(r[2], 16) * 17,
					parseInt(r[3], 16) * 17];
			}
			construct(rgb[0], rgb[1], rgb[2], a1);
		}
	} else {
		construct(r, g, b, a);
	}
}

Color.prototype.distanceTo = function(other) {
	return Math.abs(this.r - other.r) +
		Math.abs(this.g - other.g) +
		Math.abs(this.b - other.b) +
		Math.abs(this.a - other.a);
}

Color.prototype.distanceToEuclidean = function(other) {
	return Math.sqrt(
		Math.pow(Math.abs(this.r - other.r), 2) +
		Math.pow(Math.abs(this.g - other.g), 2) +
		Math.pow(Math.abs(this.b - other.b), 2) +
		Math.pow(Math.abs(this.a - other.a), 2));
}

Color.prototype.negate = function() {
	return new Color(
		~this.r & 255,
		~this.g & 255,
		~this.b & 255,
		~this.a & 255);
}

Color.prototype.mix = function(other, percent) {
	//if (!(other instanceof Color)) return undefined;
	var r = percent * other.r + (1 - percent) * this.r;
	var g = percent * other.g + (1 - percent) * this.g;
	var b = percent * other.b + (1 - percent) * this.b;
	var a = percent * other.a + (1 - percent) * this.a;
	return new Color(r, g, b, a);
}

Color.prototype.brighter = function(percent) {
	return this.mix({r: 255, g: 255, b: 255, a: 255}, percent);
}

Color.prototype.darker = function(percent) {
	return this.mix({r: 0, g: 0, b: 0, a: 255}, percent);
}

Color.prototype.opaque = function(alpha) {
	return new Color(this.r, this.g, this.b, alpha);
}

Color.prototype.toString = function() {
	this.format = this.format || "rgba";
	var r = this.r, g = this.g, b = this.b, a = this.a;
	switch(this.format) {
		case "rgba": return "rgba(" + r + ", " + g + ", " + b + ", " + (a / 255) + ")";
		case "rgb" : return "rgb(" + r + ", " + g + ", " + b + ")";
		case "hex3": {
			r = Math.floor((r + 8) / 17);
			g = Math.floor((g + 8) / 17);
			b = Math.floor((b + 8) / 17);
			return "#" + r.toString(16) + g.toString(16) + b.toString(16);  // losing alpha and some color precision
		}
		case "hex6": {
			r = (r < 16 ? "0" : "") + r.toString(16);
			g = (g < 16 ? "0" : "") + g.toString(16);
			b = (b < 16 ? "0" : "") + b.toString(16);
			return "#" + r + g + b;  // losing alpha
		}
		/*case "hex8": {
			var 
		}*/
	}
}

/*Color.prototype.asEvaluated = function() {
	return "new Color(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
}*/

Color.prototype.equals = function(other) {
	if (Array.isArray(other))
		return (this.r == other[0] &&
		this.g == other[1] &&
		this.b == other[2] &&
		this.a == other[3]);
	if (typeof other == "string") return this.equals(new Color(other));
	return (other instanceof Color &&
		this.r == other.r &&
		this.g == other.g &&
		this.b == other.b &&
		this.a == other.a);
}

Color.prototype.eval = function() {
	return "new Color(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
}

// note: (\d*\.)?\d+ instead of just \d+ is used because rgb (or hsl) values can be real
var COLOR_FORMAT_REGEXPS = {
	hex3: /^#[0-9a-f]{3}$/i,
	hex6: /^#[0-9a-f]{6}$/i,
	hex8: /^#[0-9a-f]{8}$/i,
	rgba: /^rgba?\((\d*\.)?\d+,(\d*\.)?\d+,(\d*\.)?\d+(,(\d*\.)?\d+%?)?\)$|^rgba?\((\d*\.)?\d+%,(\d*\.)?\d+%,(\d*\.)?\d+%(,(\d*\.)?\d+%?)?\)$/i,
	hsla: /^hsla?\((\d*\.)?\d+,(\d*\.)?\d+%,(\d*\.)?\d+%(,(\d*\.)?\d+%?)?\)$/i
}

var NAMED_COLORS = {
	aliceblue			:[240,248,255],
	antiquewhite		:[250,235,215],
	aqua				:[  0,255,255],
	aquamarine			:[127,255,212],
	azure				:[240,255,255],
	beige				:[245,245,220],
	bisque				:[255,228,196],
	black				:[  0,  0,  0],
	blanchedalmond		:[255,235,205],
	blue				:[  0,  0,255],
	blueviolet			:[138, 43,226],
	brown				:[165, 42, 42],
	burlywood			:[222,184,135],
	cadetblue			:[ 95,158,160],
	chartreuse			:[127,255,  0],
	chocolate			:[210,105, 30],
	coral				:[255,127, 80],
	cornflowerblue		:[100,149,237],
	cornsilk			:[255,248,220],
	crimson				:[220, 20, 60],
	cyan				:[  0,255,255],
	darkblue			:[  0,  0,139],
	darkcyan			:[  0,139,139],
	darkgoldenrod		:[184,134, 11],
	darkgray			:[169,169,169],
	darkgreen			:[  0,100,  0],
	darkgrey			:[169,169,169],
	darkkhaki			:[189,183,107],
	darkmagenta			:[139,  0,139],
	darkolivegreen		:[ 85,107, 47],
	darkorange			:[255,140,  0],
	darkorchid			:[153, 50,204],
	darkred				:[139,  0,  0],
	darksalmon			:[233,150,122],
	darkseagreen		:[143,188,143],
	darkslateblue		:[ 72, 61,139],
	darkslategray		:[ 47, 79, 79],
	darkturquoise		:[  0,206,209],
	darkviolet			:[148,  0,211],
	deeppink			:[255, 20,147],
	deepskyblue			:[  0,191,255],
	dimgray				:[105,105,105],
	dimgrey				:[105,105,105],
	dodgerblue			:[ 30,144,255],
	firebrick			:[178, 34, 34],
	floralwhite			:[255,250,240],
	forestgreen			:[ 34,139, 34],
	fuchsia				:[255,  0,255],
	gainsboro			:[220,220,220],
	ghostwhite			:[248,248,255],
	gold				:[255,215,  0],
	goldenrod			:[218,165, 32],
	gray				:[128,128,128],
	green				:[  0,128,  0],
	greenyellow			:[173,255, 47],
	grey				:[128,128,128],
	honeydew			:[240,255,240],
	hotpink				:[255,105,180],
	indianred			:[205, 92, 92],
	indigo				:[ 75,  0,130],
	ivory				:[255,255,240],
	khaki				:[240,230,140],
	lavender			:[230,230,250],
	lavenderblush		:[255,240,245],
	lawngreen			:[124,252,  0],
	lemonchiffon		:[255,250,205],
	lightblue			:[173,216,230],
	lightcoral			:[240,128,128],
	lightcyan			:[224,255,255],
	lightgoldenrodyellow:[250,250,210],
	lightgray			:[211,211,211],
	lightgreen			:[144,238,144],
	lightgrey			:[211,211,211],
	lightpink			:[255,182,193],
	lightsalmon			:[255,160,122],
	lightseagreen		:[ 32,178,170],
	lightskyblue		:[135,206,250],
	lightslategray		:[119,136,153],
	lightslategrey		:[119,136,153],
	lightsteelblue		:[176,196,222],
	lightyellow			:[255,255,224],
	lime				:[  0,255,  0],
	limegreen			:[ 50,205, 50],
	linen				:[250,240,230],
	magenta				:[255,  0,255],
	maroon				:[128,  0,  0],
	mediumaquamarine	:[102,205,170],
	mediumblue			:[  0,  0,205],
	mediumorchid		:[186, 85,211],
	mediumpurple		:[147,112,219],
	mediumseagreen		:[ 60,179,113],
	mediumslateblue		:[123,104,238],
	mediumspringgreen	:[  0,250,154],
	mediumturquoise		:[ 72,209,204],
	mediumvioletred		:[199, 21,133],
	midnightblue		:[ 25, 25,112],
	mintcream			:[245,255,250],
	mistyrose			:[255,228,225],
	moccasin			:[255,228,181],
	navajowhite			:[255,222,173],
	navy				:[  0,  0,128],
	oldlace				:[253,245,230],
	olive				:[128,128,  0],
	olivedrab			:[107,142, 35],
	orange				:[255,165,  0],
	orangered			:[255, 69,  0],
	orchid				:[218,112,214],
	palegoldenrod		:[238,232,170],
	palegreen			:[152,251,152],
	paleturquoise		:[175,238,238],
	palevioletred		:[219,112,147],
	papayawhip			:[255,239,213],
	peachpuff			:[255,218,185],
	peru				:[205,133, 63],
	pink				:[255,192,203],
	plum				:[221,160,221],
	powderblue			:[176,224,230],
	purple				:[128,  0,128],
	red					:[255,  0,  0],
	rosybrown			:[188,143,143],
	royalblue			:[ 65,105,225],
	saddlebrown			:[139, 69, 19],
	salmon				:[250,128,114],
	sandybrown			:[244,164, 96],
	seagreen			:[ 46,139, 87],
	seashell			:[255,245,238],
	sienna				:[160, 82, 45],
	silver				:[192,192,192],
	skyblue				:[135,206,235],
	slateblue			:[106, 90,205],
	slategray			:[112,128,144],
	slategrey			:[112,128,144],
	snow				:[255,250,250],
	springgreen			:[  0,255,127],
	steelblue			:[ 70,130,180],
	tan					:[210,180,140],
	teal				:[  0,128,128],
	thistle				:[216,191,216],
	tomato				:[255, 99, 71],
	turquoise			:[ 64,224,208],
	violet				:[238,130,238],
	wheat				:[245,222,179],
	white				:[255,255,255],
	whitesmoke			:[245,245,245],
	yellow				:[255,255,  0],
	yellowgreen			:[154,205, 50]
}