/**
 * New node file
 */
var net = require('net');
var net = require('net');
function oj_client(client_ip,client_port,solution)
{
	var cmdstate = new String();
	var datastr = new String();
	var result = new String();
	var finished = false;
	this.client = net.connect({port: client_port ,host:client_ip},
		function() { //'connect' listener
		console.log('client connected');
		this.write("echo\n");
	});
	this.client.on('data', function(data) {
		datastr += data.toString();
		//console.log(this.datastr);
		if(datastr.indexOf("\n")>=0)
		{
			var result = datastr.split(/\r?\n/);
			console.log(result);
			if(result.length > 0)
			{
				var cmdstr = result[0].split(" ");
				if(cmdstr.length > 0)
				{
					if(cmdstr[0] === "echo")
					{
						this.cmdstate = "connected";
						console.log('connected');	
						var str = solveProblem(solution);
						this.write('solve '+str+'\n');
					}	
					else if(cmdstr[0] === "starting")
					{
						this.cmdstate = "starting";						
						console.log('starting');
					}
					else if(cmdstr[0] === "processing")
					{
						this.cmdstate = "processing";						
						console.log('processing');
					}
					else if(cmdstr[0] === "solution")
					{
						this.cmdstate = "solution";		
						var buf = new Buffer(cmdstr[1], 'base64'); 						
						var ans = buf.toString('ascii');
						console.log('solution processed:' + ans);
						this.end();
						this.finished = true;
					}
					else if(cmdstr[0] === "exit")
					{
						this.cmdstate = "exit";	
						this.end();
						console.log('exit');
					}
					else 
					{
						
					}
				}
			}
			datastr = new String();
		}
	});
	this.client.on('end', function() {
		console.log('client disconnected');
	});

	this.client.on('error', function(e) {
		console.log(e);
	});

}

	oj_client.sendecho = function()
	{
		this.client.write('echo\n');
	};
	
	function solveProblem(solution)
	{
		var json_str = JSON.stringify(solution);
		var base64_str = new Buffer(json_str).toString('base64');
		return base64_str;
	}
	oj_client.getstatus = function(problem)
	{
		
		var json_str = JSON.stringify(problem);
		var base64_str = new Buffer(json_str).toString('base64');
		
		this.client.write('status\n');
	}
	oj_client.exit = function()
	{
		this.client.write('exit\n');
	}


	module.exports = oj_client;