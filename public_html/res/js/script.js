$(function(){
	var canvas = $('#board'),
		ctx = canvas[0].getContext('2d'),
		drawing = false,
		prev = {},
		lineWidth = 3,
		url = "http://localhost:8080",
		socket = io.connect(url);

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

	canvas.on('mousedown', function(e){
		drawing = true;
		prev = getCoordinates(e);
		//fillCircle(prev.x, prev.y, lineWidth / 2.0);
	});
	canvas.on('mousemove', function(e){
		if (drawing){
			var next = getCoordinates(e);
			drawLine(prev.x, prev.y, next.x, next.y);
			socket.emit('client drawing', {
				'prev': prev,
				'next': next
			});
			prev = next;
		}
	});

	canvas.on('mouseup mouseleave', function(e){
		drawing = false;
	});

	socket.on('peer drawing', function(data){
		drawLine(data.prev.x, data.prev.y, data.next.x, data.next.y);
	});
});