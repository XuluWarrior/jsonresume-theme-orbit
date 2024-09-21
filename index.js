const fs = require("fs");
const path = require('path');
const Handlebars = require("handlebars");
const utils = require('handlebars-utils');
const marked = require('marked').marked;

Handlebars.registerHelper('markdown', function(str, locals, options) {
	if (typeof str !== 'string') {
		options = locals;
		locals = str;
		str = true;
	}

	if (utils.isOptions(locals)) {
		options = locals;
		locals = {};
	}

	const ctx = utils.context(this, locals, options);
	const val = utils.value(str, ctx, options);

	const markup = marked(val);

	// If we end up with a string wrapped in one <p> block, remove it so we don't create a new text block
	const startEndMatch = markup.match(/^<p>(.*)<\/p>\n$/);
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
		const d = new Date(str);
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

// Resume.json used to have website property in some entries.  This has been renamed to url.
// However the demo data still uses the website property so we will also support the "wrong" property name.
// Fix the resume object to use url property
function fixResume(resume) {
	if (resume.basics.website) {
		resume.basics.url = resume.basics.website;
		delete resume.basics.website
	}
	fixAllEntries(resume.work);
	fixAllEntries(resume.volunteer);
	fixAllEntries(resume.publications);
	fixAllEntries(resume.projects);

	fixWork(resume.work);
}

function fixAllEntries(entries) {
	if (entries) {
		for (let i=0; i < entries.length; i++) {
			const entry = entries[i];
			if (entry.website) {
				entry.url = entry.website;
				delete entry.website;
			}
		}
	}
}

// work.company has been renamed as work.name in v1.0.0
function fixWork(work) {
	if (work) {
		for (let i=0; i < work.length; i++) {
			const entry = work[i];
			if (entry.company) {
				entry.name = entry.company;
				delete entry.website;
			}
		}

	}
}

function render(resume) {
	const variant = parseInt(resume.meta?.themeVariant || "1");
	if (isNaN(variant) || variant < 1 || variant > 6) {
		throw "Invalid themeVariant.  Allowed values are 1 to 6"
	}

	const css = fs.readFileSync(__dirname + `/assets/css/styles-${variant}.css`, "utf-8");
	const js = fs.readFileSync(__dirname + "/assets/js/main.js", "utf-8");
	const tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");

	fixResume(resume);

	const partialsDir = path.join(__dirname, 'partials');
	const filenames = fs.readdirSync(partialsDir);

	filenames.forEach(function (filename) {
	  const matches = /^([^.]+).hbs$/.exec(filename);
	  if (!matches) {
	    return;
	  }
	  const name = matches[1];
	  const filepath = path.join(partialsDir, filename);
	  const template = fs.readFileSync(filepath, 'utf8');

	  Handlebars.registerPartial(name, template);
	});

	const packageJSON = require("./package");
	return Handlebars.compile(tpl)({
		css,
		js,
		resume,
		meta: {
			packageName: packageJSON.name,
			version:  packageJSON.version
		}
	});
}

module.exports = {
	render: render,
	pdfRenderOptions: {
		mediaType: 'print',
		displayHeaderFooter: true,
		margin: {
			top: '30px',
			bottom: '30px'
		},
		headerTemplate: `
			<style>
				html {
				  -webkit-print-color-adjust: exact;
				}
			</style>
			<div style="margin-top: -30px; background: #f5f5f5; width: 100%; height: 60px"/>    
		`,
		footerTemplate: `
			<style>
				html {
				  -webkit-print-color-adjust: exact;
				}
			</style>
			<div style="margin-bottom: -15px; background: #f5f5f5; width: 100%; height: 30px"/>
		`
	}
};
