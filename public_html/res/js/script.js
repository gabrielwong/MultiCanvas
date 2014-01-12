$(function(){
	var canvas = $('#board'),
		ctx = canvas[0].getContext('2d'),
		drawing = false,
		prev = {},
		lineWidth = 3,
		cursorWidth = 6,
		url = "http://localhost:8080",
		socket = io.connect(url),
		cursor = $('#cursor');

	var drawLine = function(x1, y1, x2, y2){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = 'black';
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

	var getCoordinates = function(e){
		return {
			x: e.pageX - canvas.offset().left,
			y: e.pageY - canvas.offset().top
		};
	}

	var moveCursor = function(pos){
		cursor.css({
			'top': pos.y + cursorWidth / 2.,
			'left': pos.x - cursorWidth / 2.
		})
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
			drawLine(prev.x, prev.y, next.x, next.y);
			socket.emit('client drawing', {
				'prev': prev,
				'next': next
			});lineWidth
			prev = next;
		}
	});

	canvas.on('mouseup mouseleave', function(e){
		drawing = false;
	});

	socket.on('peer drawing', function(data){
		drawLine(data.prev.x, data.prev.y, data.next.x, data.next.y);
	});

	cursor.css({
		'width': cursorWidth,
		'height': cursorWidth,
		'background': "black",
		'position': "relative",
		'pointer-events': 'none'
	});
});