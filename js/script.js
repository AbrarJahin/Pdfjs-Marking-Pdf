var fcanvas, scale;
$(function() {
	var url = prompt("Please enter pdf url:", "https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/tracemonkey.pdf");
	//var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/tracemonkey.pdf';
	var canvas = document.getElementById('pdfcanvas');
	var context = canvas.getContext('2d');
	PDFJS.disableWorker = true;
	PDFJS.getDocument(url)
		.then(pdf => {
			//console.log(pdf.pdfInfo.numPages);
			//Get Page No
			var pageNo = parseInt(prompt("Please enter Page No (max page - "+pdf.pdfInfo.numPages+")", "1"));
			pdf.getPage(Math.abs((pageNo-1)%pdf.pdfInfo.numPages)+1)
			.then(page => {
				//console.log(page);
				//Set Scale = (page width)/(canvas width)
				scale = $("#pdfcanvas").width()/page.getViewport(1).width;
				var viewport = page.getViewport(scale);
				//Canvas height and width - level 1
				canvas.height = viewport.height;
				//canvas.width = viewport.width;
				page.render({
						canvasContext: context,
						viewport: viewport
					})
				.then(function() {
					var bg = canvas.toDataURL("image/png");
					fcanvas = new fabric.Canvas("pdfcanvas", {
							selection: false
						});

					fcanvas.setBackgroundImage(bg,fcanvas.renderAll.bind(fcanvas));
					//Canvas height and width - level 2
					fcanvas.setWidth($("#pdfcanvas").width());
					//fcanvas.setHeight($("#pdfcanvas").height());

					/*
					var rect = new fabric.Rect({
						left: 100,
						top: 100,
						width: 50,
						height: 50,
						fill: '#FF454F',
						opacity: 0.5,
						transparentCorners: true,
						borderColor: "gray",
						cornerColor: "gray",
						cornerSize: 5
					});
					fcanvas.add(rect);
					*/
					fcanvas.renderAll();
				});
			});
		});
});

function removeAllSignature() {
	fcanvas.remove(fcanvas.getObjects());
	fcanvas.getObjects().forEach(function(object) {
		fcanvas.remove(object);
		alert("Removed");
	});
}

function addSignature() {
	var txt;
	var width = parseInt(prompt("Please enter width:", "50"));
	var height = parseInt(prompt("Please enter width:", "50"));
	if (width == null || width == "" || height == null || height == "") {
		txt = "User cancelled the prompt.";
	} else {
		var rect = new fabric.Rect({
			left: 100,
			top: 100,
			width: width,
			height: height,
			fill: '#FF454F',
			opacity: 0.5,
			transparentCorners: true,
			borderColor: "gray",
			cornerColor: "gray",
			cornerSize: 5
		});
		fcanvas.add(rect);
		//fcanvas.renderAll();
	}
}

function getSignatures() {
	/*for(i=0;i<fcanvas.getObjects().length;i++) {
		console.log(fcanvas.getObjects()[i].aCoords);
	}*/
	console.log(scale);
	fcanvas.getObjects().forEach(function(object) {
		console.log(object.aCoords);
	});
}