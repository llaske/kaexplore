
// Load topics and language file
var topics = require('./topics.json');
var languageMappings = require('./dubbed_video_mappings.json');
var videosSize = require('./video_file_sizes.json');

// Init count
var countTotal = 0;
var countVideo = 0;
var sizeVideo = 0;
var countExercice = 0;
var countTopic = 0;
var countMapped = 0;
var sizeMapped = 0;
var modeList = false;
var modeRestrict = false;


// Look for a language mapping
function getMapping(mappings, language) {
	return mappings[language];
}

// Find locale for a string
function getLocale(value, locale) {
	if (!locale) return value;
	if (!locale[value]) return value;
	if (locale[value].length < 2) return value;
	return eval('decodeURIComponent(escape("'+locale[value][1].replace(/(\r\n|\n|\r)/gm,"").replace(/"/g,"'")+'"))');
}

// Explore a node
function explore(node, level, mapping, language, locale) {
	// Stats
	countTotal++;
	if (node.kind == 'Topic') countTopic++;
	else if (node.kind == 'Video') countVideo++;
	else if (node.kind == 'Exercise') countExercice++;
	
	// Display properties
	var line = '';
	var videoUrl = '';
	var title = '';
	var imageUrl = '';
	for (var i = 0 ; i < level ; i++) line += '  ';
	if (node.kind == 'Video') {
		videoUrl = node.download_urls.mp4;
		imageUrl = node.download_urls.png;
		sizeVideo += videosSize[node.id];
		title = getLocale(node.title, locale);
		line += 'Video: '+title+' '+videoUrl;
		if (mapping) {
			if (mapping[node.id]) {
				sizeMapped += videosSize[node.id];
				videoUrl = videoUrl.replace(new RegExp(node.id, 'g'), mapping[node.id]);
				imageUrl = imageUrl.replace(new RegExp(node.id, 'g'), mapping[node.id]);
				line += videoUrl + ' ('+language+')';
				countMapped++;
			}
		}
		line += ' ('+node.duration+'s)';
	}
	else if (node.kind == 'Exercise') {
		line += 'Exercice: '+getLocale(node.title, locale);
	}
	else {
		line += node.title;
	}
	if (!modeList)
		console.log(line);
	else {
		if (videoUrl.length != 0) {
			if (!modeRestrict || !mapping || mapping[node.id]) {
				console.log(videoUrl+';'+imageUrl+';'+title);
			}
		}
	}

	// Explore children
	var length = node.children ? node.children.length : 0;
	for (var i = 0 ; i < length ; i++) {
		explore(node.children[i], level+1, mapping, language, locale);
	}
}

// Write usage
function writeUsage() {
	console.log("Usage: "+process.argv[0]+" kaexplore.js [-l] [-r] [<language>]");
}

// Get language mapping
var argv = require('minimist')(process.argv.slice(2), {boolean: ['l','r']});
modeList = argv.l;
modeRestrict = argv.r;
var languageToMap = null;
if (argv._.length == 1) {
	languageToMap = argv._[0];
} else if (argv._.length > 1) {
	writeUsage();
	return;
}
var languagemapping = null;
if (languageToMap) {
	languagemapping = getMapping(languageMappings, languageToMap);
	if (!languagemapping)
		console.warn("WARNING: No mapping for "+languageToMap);
}
var languagelocale = null;
if (languageToMap) {
	try {
		languagelocale = require('./django_'+languageToMap+'.json');
	} catch(e) {
		console.warn("WARNING: No localization for "+languageToMap);
	}
}

// Launch from root
explore(topics, 0, languagemapping, languageToMap, languagelocale);

// Display stats
if (!modeList) {
	console.log();
	console.log("= "+countTopic+" topics");
	console.log("= "+countVideo+" videos, "+Math.floor(sizeVideo/(1024*1024))+" Mb");
	if (languagemapping) console.log("= "+countMapped+" videos "+languageToMap+", "+Math.floor(sizeMapped/(1024*1024))+" Mb");
	console.log("= "+countExercice+" exercices");
	console.log("--- Total = "+countTotal+"/"+(countTopic+countVideo+countExercice));
}
