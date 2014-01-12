$(function(){
	var canvas = $('#board'),
		ctx = canvas[0].getContext('2d'),
		tools = $('#tools'),
		toolctx = tools[0].getContext('2d'),
		drawing = false,
		prev = {},
		lineWidth = 3,
		cursorWidth = 6,
		penColor = rgbToHex(255, 0, 0),
		url = "http://localhost:8080",
		socket = io.connect(url),
		cursor = $('#cursor');

	var drawLine = function(x1, y1, x2, y2, color){
		color = typeof color !== 'undefined' ? color : 'black';
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = color;
		ctx.lineCap = 'round';

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	var fillCircle = function(x, y, r){
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
	}

	var getCoordinates = function(e, element){
		element = typeof element !== 'undefined' ? element : canvas;
		return {
			x: e.pageX - element.offset().left,
			y: e.pageY - element.offset().top
		};
	}

	var moveCursor = function(pos){
		cursor.css({
			'top': pos.y + cursorWidth / 2.,
			'left': pos.x - cursorWidth / 2.,
			'width': cursorWidth,
			'height': cursorWidth,
			'background-color': penColor,
			'position': "relative",
			'pointer-events': 'none'
		});
	}

	canvas.on('mousedown', function(e){
		drawing = true;
		prev = getCoordinates(e);
		//fillCircle(prev.x, prev.y, lineWidth / 2.0);
	});
	canvas.on('mousemove', function(e){
		var next = getCoordinates(e);
		moveCursor(next);
		if (drawing){
			drawLine(prev.x, prev.y, next.x, next.y, penColor);
			socket.emit('client drawing', {
				'prev': prev,
				'next': next,
				'color': penColor
			});lineWidth
			prev = next;
		}
	});

	canvas.on('mouseup mouseleave', function(e){
		drawing = false;
	});

	tools.on('mouseup', function(e){
		var pos = getCoordinates(e, tools);
		var c  = toolctx.getImageData(pos.x, pos.y, 1, 1).data;
		penColor = rgbToHex(c[0], c[1], c[2]);
	});

	socket.on('peer drawing', function(data){
		drawLine(data.prev.x, data.prev.y, data.next.x, data.next.y, data.color);
	});
	drawGradient(toolctx, 0, 0, canvas.width(), canvas.height());
});

function drawGradient(ctx, x, y, width, height){
	var grad = ctx.createLinearGradient(0, 0, 0, height);
	grad.addColorStop(0, 'red');
	grad.addColorStop(1 / 6, 'orange');
	grad.addColorStop(2 / 6, 'yellow');
	grad.addColorStop(3 / 6, 'green')
	grad.addColorStop(4 / 6, 'aqua');
	grad.addColorStop(5 / 6, 'blue');
	grad.addColorStop(1, 'purple');
	ctx.fillStyle = grad;
	ctx.fillRect(x, y, width, height);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}