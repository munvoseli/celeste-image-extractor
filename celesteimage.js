
var fileInput = document.createElement("input");
fileInput.setAttribute("type", "file");
fileInput.multiple = true;
document.body.appendChild(fileInput);

function renderArrayBuffer(arrayBuffer)
{
    var array = new Uint8Array(arrayBuffer); // turn the array buffer into an array of bytes
    /*var str = "";
    // this is just a hexdump thing for figuring things out, but I didn't really need it because of wtdcode/CelesteExtractor
    for (var i = 0; i < 10000; i += cols)
    {
    str += "\n";
    for (var j = 0; j < cols; j++)
    {
    var n = array[i + j];
    str += ('0' + n.toString(16)).slice(-2) + " ";
    }
    }*/
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 256 * array[1] + array[0];
    canvas.height = 256 * array[5] + array[4];
    var imageData = ctx.createImageData(canvas.width, canvas.height);
    var mode = array[8];
    var i = 0;
    var k = 9;
    if (mode == 0) // completely opaque
    {
	while (k < array.length)
	{
	    var r = array[k + 3];
	    var g = array[k + 2];
	    var b = array[k + 1];
	    var n = array[k]; // number of times the pixel happened
	    for (var j = 0; j < n; j++)
	    {
		imageData.data[i    ] = r;
		imageData.data[i + 1] = g;
		imageData.data[i + 2] = b;
		imageData.data[i + 3] = 255;
		i += 4;
	    }
	    k += 4;
	}
    }
    else // support for clear pixels
    {
	while (k < array.length)
	{
	    var n = array[k];
	    var b = array[k + 1];
	    if (b)
	    {
		for (var j = 0; j < n; j++)
		{
		    var r = array[k + 4];
		    var g = array[k + 3];
		    var b = array[k + 2];
		    imageData.data[i] = r;
		    imageData.data[i + 1] = g;
		    imageData.data[i + 2] = b;
		    imageData.data[i + 3] = 255;
		    i += 4;
		}
		k += 5;
	    }
	    else
	    {
		i += 4 * n;
		k += 2; // transparent
	    }
	}
    }
    ctx.putImageData(imageData, 0, 0);
    document.body.appendChild(canvas);
}

function loadFile(file) {
    var fileReader = new FileReader();
    fileReader.addEventListener("loadend", function(e) {
	var result = fileReader.result;
	renderArrayBuffer(result);
    }, false);
    fileReader.readAsArrayBuffer(file);
}
fileInput.addEventListener("change", function() {
    var files = fileInput.files;
    for (var file of files) {
	loadFile(file);
    }
}, false);
