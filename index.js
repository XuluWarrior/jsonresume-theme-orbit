var fs = require("fs");
var path = require('path');
var Handlebars = require("handlebars");
var markdown = require('helper-markdown');

Handlebars.registerHelper('markdown', function() {
	var markup = markdown().apply(this, arguments);

	// If we end up with a string wrapped in one <p> block, remove it so we don't create a new text block
	var startEndMatch = markup.match(/^<p>(.*)<\/p>\n$/);
	return startEndMatch && startEndMatch[1].indexOf("<p>") === -1 ?
		startEndMatch[1] :
		markup;
});

Handlebars.registerHelper('displayUrl', function(str) {
	return str.replace(/https?:\/\//, "");
});

Handlebars.registerHelper('toLowerCase', function(str) {
	return str.toLowerCase();
});

Handlebars.registerHelper('year', function(str) {
	if (str) {
		var d = new Date(str);
		return d.getFullYear();
	} else {
		return "Present"
	}
});

Handlebars.registerHelper('award', function(str) {
	switch (str.toLowerCase()) {
		case "bachelor":
		case "master":
			return str + "s";
		default:
			return str;
	}
});

Handlebars.registerHelper('skillLevel', function(str) {
	switch (str.toLowerCase()) {
		case "beginner":
			return "25%";
		case "intermediate":
			return "50%";
		case "advanced":
			return "75%";
		case "master":
			return "100%";
		default:
			return parseInt(str) + "%"
	}
});

function render(resume) {
	var css = fs.readFileSync(__dirname + "/assets/css/styles.css", "utf-8");
	var js = fs.readFileSync(__dirname + "/assets/js/main.js", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	//var partialsDir = path.join(__dirname, 'partials');
	//var filenames = fs.readdirSync(partialsDir);
    //
	//filenames.forEach(function (filename) {
	//  var matches = /^([^.]+).hbs$/.exec(filename);
	//  if (!matches) {
	//    return;
	//  }
	//  var name = matches[1];
	//  var filepath = path.join(partialsDir, filename);
	//  var template = fs.readFileSync(filepath, 'utf8');
    //
	//  Handlebars.registerPartial(name, template);
	//});
	return Handlebars.compile(tpl)({
		css: css,
		js: js,
		resume: resume
	});
}

module.exports = {
	render: render
};