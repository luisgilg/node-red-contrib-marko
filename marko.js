module.exports = function(RED) {
	var path = require('path');
	require("marko/node-require").install();

	function MarkoNode(n) {
	
		RED.nodes.createNode(this,n);
		this.name = n.name;
		this.field = n.field || "payload";

		if (RED.storage && RED.storage.projects) {
			var activeProject = RED.storage.projects.getActiveProject();

			if(activeProject){
				this.projectName = n.projectName || activeProject.name;
				this.path = n.path || activeProject.path;
			}
		}

		this.templatesFolder = n.templatesFolder || "templates";
		this.template = n.template || "";

		var node = this;
		node.on('input', function(msg) {
			var temFile = path.join(node.path,node.template);
			console.log(temFile);
			var tepl = require(temFile);
			var value = tepl.renderToString(msg);

			console.log(value);
			RED.util.setMessageProperty(msg,node.field,value);
			node.send(msg);
		});

	}

	RED.nodes.registerType("marko",MarkoNode);
}