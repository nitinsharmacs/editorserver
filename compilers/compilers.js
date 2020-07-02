const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');
const rootDir = require('../util/path');
const cppModule = require('./languages/cpp');
const pythonModule = require('./languages/python');

let init = false;

exports.init = (option) => {
	if(option&&option.init){
		init = true;
	}
	fs.exists(`${rootDir}/temp`, exists=>{
		if(!exists&&init){
			fs.mkdirSync(`${rootDir}/temp`);
			console.log('INFO: '.cyan + 'temp directory created for storing temporary files.'.cyan );
		}
	});
};	

exports.compileCPP = (envData, code, input, cb) => {
	if(init){
		cppModule.init = true;
		cppModule.cpp(envData, code, input, cb);
	}
};

exports.compilePython = (envData, code, input, cb) => {
	if(init){
		pythonModule.init = true;
		pythonModule.python(envData, code, input, cb);
	}
};