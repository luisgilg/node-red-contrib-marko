module.exports = function(RED) {
	var path = require('path');
	require("marko/node-require").install();

	function MarkoNode(n) {
	
		RED.nodes.createNode(this,n);
		this.name = n.name;
		this.field = n.field || "payload";

	

		// if (RED.settings && RED.settings.get("activeProject")) {
		// 	var activeProject = RED.settings.get("activeProject");

		// 	if(activeProject){
		// 		this.projectName = n.projectName || activeProject.name;
		// 		this.path = n.path || activeProject.path;
		// 	}
		// }

		this.path = n.path || "";
		this.projectName = n.projectName || "";

		this.templatesFolder = n.templatesFolder || "components";
		this.template = n.template || "";

		var node = this;
		node.on('input', function(msg) {
			var temFile = path.join(node.path, node.templatesFolder, node.template);
			RED.log.info(temFile);
			var tepl = require(temFile);
			var value = tepl.renderToString(msg) || "";

			RED.log.info(value);
			RED.util.setMessageProperty(msg,node.field,value);
			node.send(msg);
		});

	}

	RED.nodes.registerType("marko-ui",MarkoNode);
}