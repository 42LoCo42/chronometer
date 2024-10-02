const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

///// checkbox management /////

const octBox = document.getElementById("oct") as HTMLInputElement;
const decBox = document.getElementById("dec") as HTMLInputElement;
const hexBox = document.getElementById("hex") as HTMLInputElement;
const blBox = document.getElementById("backlight") as HTMLInputElement;

let showOct = 1;
let showDec = 1;
let showHex = 1;
let black = "#383E42";

const setShowOct = () => (showOct = octBox.checked ? 1 : 0);
const setShowDec = () => (showDec = decBox.checked ? 1 : 0);
const setShowHex = () => (showHex = hexBox.checked ? 1 : 0);
const setBlack = () => (black = blBox.checked ? "#383E42" : "#282828");

octBox.addEventListener("click", () => {
	setShowOct();
	redraw();
});
setShowOct();

decBox.addEventListener("click", () => {
	setShowDec();
	redraw();
});
setShowDec();

hexBox.addEventListener("click", () => {
	showHex = hexBox.checked ? 1 : 0;
	redraw();
});
setShowHex();

blBox.addEventListener("click", () => {
	setBlack();
	redraw();
});
setBlack();

///// event handling /////

let time = new Date();
setInterval(() => {
	time = new Date();
	redraw();
}, 1000);

window.addEventListener("resize", redraw);
redraw();

///// rendering functions /////

function redraw() {
	// canvas size
	const cw = (canvas.width = window.innerWidth);
	const ch = (canvas.height = window.innerHeight);

	ctx.fillStyle = "#282828";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#ebdbb2";
	ctx.font = `${Math.trunc(canvas.width / 30)}px sans-serif`;

	const title = "✨ ⏰ The Chronometer of Endless Whimsy! ⏰ ✨";
	const metrics = ctx.measureText(title);
	ctx.fillText(title, (canvas.width - metrics.width) / 2, canvas.height * 0.1);

	// base size
	const bw = 49;
	const bh = 13;

	const factor = Math.min(cw / bw, ch / bh);

	// scaled sizes & offsets
	const sw = bw * factor;
	const sh = bh * factor;
	const sx = (cw - sw) / 2;
	const sy = (ch - sh) / 2;

	// minimum square transformation factor
	const min = Math.min(sw / bw, sh / bh);
	ctx.setTransform(min, 0, 0, min, sx, sy);
	ctx.lineWidth = 1 / min;

	drawEightsPair(3, time.getHours(), false);
	drawEightsPair(19, time.getMinutes(), true);
	drawEightsPair(35, time.getSeconds(), true);
}

function toBits(value: number): number[] {
	return value.toString(2).padStart(6, "0").split("").reverse().map(Number);
}

function drawDot(x: number, y: number, on: number) {
	ctx.fillStyle = on > 0 ? "#ebdbb2" : black;
	ctx.fillRect(x, y, 1, 1);
}

function drawEightsPair(x: number, value: number, twoDots: boolean) {
	const oct = value.toString(8).padStart(2, "0");
	const dec = value.toString(10).padStart(2, "0");
	const hex = value.toString(16).padStart(2, "0");

	drawEight(x, oct[0], dec[0], hex[0]);
	drawEight(x + 7, oct[1], dec[1], hex[1]);

	const bits = toBits(value);
	if (twoDots) {
		drawDot(x + 9.5, 8.5, bits[0]);
		drawDot(x + 2.5, 8.5, bits[1]);
		drawDot(x - 2, 8, bits[2]);

		drawDot(x + 9.5, 3.5, bits[3]);
		drawDot(x + 2.5, 3.5, bits[4]);
		drawDot(x - 2, 4, bits[5]);
	} else {
		drawDot(x + 9.5, 8.5, bits[0]);
		drawDot(x + 2.5, 8.5, bits[1]);

		drawDot(x + 9.5, 3.5, bits[2]);
		drawDot(x + 2.5, 3.5, bits[3]);

		drawDot(x - 2, 6, bits[4]);
	}
}

function drawEight(x: number, oct: string, dec: string, hex: string) {
	//  --A--
	// |     |
	// F     B
	// |     |
	//  --G--
	// |     |
	// E     C
	// |     |
	//  --D--

	// prettier-ignore
	//               x       y       vertical
	const segments: [number, number, boolean][] = [
		[x + 1,  1, false], // A
		[x + 5,  2, true ], // B
		[x + 5,  7, true ], // C
		[x + 1, 11, false], // D
		[x + 0,  7, true ], // E
		[x + 0,  2, true ], // F
		[x + 1,  6, false], // G
	];

	const font: { [id: string]: number[] } = {
		//  A  B  C  D  E  F  G
		0: [1, 1, 1, 1, 1, 1, 0],
		1: [0, 1, 1, 0, 0, 0, 0],
		2: [1, 1, 0, 1, 1, 0, 1],
		3: [1, 1, 1, 1, 0, 0, 1],
		4: [0, 1, 1, 0, 0, 1, 1],
		5: [1, 0, 1, 1, 0, 1, 1],
		6: [1, 0, 1, 1, 1, 1, 1],
		7: [1, 1, 1, 0, 0, 0, 0],
		8: [1, 1, 1, 1, 1, 1, 1],
		9: [1, 1, 1, 1, 0, 1, 1],
		a: [1, 1, 1, 0, 1, 1, 1],
		b: [0, 0, 1, 1, 1, 1, 1],
		c: [1, 0, 0, 1, 1, 1, 0],
		d: [0, 1, 1, 1, 1, 0, 1],
		e: [1, 0, 0, 1, 1, 1, 1],
		f: [1, 0, 0, 0, 1, 1, 1],
	};

	const colors = [
		black, // black - nothing
		"#cc241d", // red - octal
		"#98971a", // green - decimal
		"#d79921", // yellow - octal + decimal
		"#458588", // blue - hex
		"#b16286", // purple - octal + hex
		"#689d6a", // cyan - decimal + hex
		"#ebdbb2", // white - octal + decimal + hex
	];

	const octDigit = font[oct];
	const decDigit = font[dec];
	const hexDigit = font[hex];

	for (let x in segments) {
		const colorID =
			((octDigit[x] * showOct) << (1 * 0)) +
			((decDigit[x] * showDec) << (1 * 1)) +
			((hexDigit[x] * showHex) << (1 * 2));

		ctx.fillStyle = colors[colorID];

		const segment = segments[x];
		ctx.beginPath();
		ctx.moveTo(segment[0], segment[1]);

		const offsets = [
			[+4.0, +0.0],
			[+4.5, +0.5],
			[+4.0, +1.0],
			[+0.0, +1.0],
			[-0.5, +0.5],
		];

		for (let offset of offsets) {
			if (segment[2]) offset.reverse();
			const [x, y] = offset;
			ctx.lineTo(segment[0] + x, segment[1] + y);
		}

		ctx.closePath();
		ctx.fill();
	}
}
