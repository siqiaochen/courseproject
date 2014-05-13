/**
 * New node file
 */
function ConfigureMgr()
{
	this.config = undefined;
	this.readconfig = function()
	{
		var fs = require('fs');
		var path = require('path');
	    appDir = path.dirname(require.main.filename);
		this.config = JSON.parse(fs.readFileSync(appDir + '/config/config.json', encoding="ascii"));

	}
	
	this.writeconfig = function()
	{
		var fs = require('fs');
		var path = require('path');
	    appDir = path.dirname(require.main.filename);
		fs.writeFileSync(appDir + '/config/config.json',JSON.stringify(this.config), encoding="ascii");
	}
}


var configMgr = new ConfigureMgr(); 
configMgr.readconfig();

exports.configMgr = configMgr;