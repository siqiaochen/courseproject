/**
 * New node file
 */
var net = require('net');
var cmdstate = 0;
var client = net.connect({
	port : 8124
}, function() { //'connect' listener
	console.log('client connected');
	client.write('world!\r\n');
});
client.on('data', function(data) {
	var result = data.toString().split(/\r?\n/);
	if(result.length > 0)
	{
		var cmdstr = result[0].split(" ");
	}
	client.end();
});
client.on('bye', function() {
	console.log('client disconnected');
});