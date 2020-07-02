const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');
const rootDir = require('../../util/path');
const path = require('path');

exports.init = false;

exports.cpp = (envData, code, input, cb) => {
	if(!exports.init)
		return false;
	//making source file
	let filename = cuid.slug()+'.cpp';
	let filepath = path.join(rootDir,'temp',filename);
	let objectCodeFileName = filename.split('.cpp')[0];
	let objectCodeFilePath = path.join(rootDir,'temp', objectCodeFileName);
	let inputFileName, inputFilePath;
	if(input){
		 inputFileName = filename.split('.cpp')[0]+'.txt';
		 inputFilePath = path.join(rootDir, 'temp', inputFileName);
	}
	fs.writeFile(filepath, code, err=>{
		if(err)
			console.log(err.toString().red);
		else {
			let command;
			if(envData.OS === 'window' && envData.cmd === 'g++'){
				command = 'g++ '+filepath+' -o '+objectCodeFilePath+'.exe';
			}
			if(envData.OS === 'linux' && envData.cmd === 'gcc'){
				command = 'gcc '+filepath+' -o '+objectCodeFilePath;
			}

			exec(command, (err, stdout, stderr)=>{
				if(err){
					return cb({output:stderr});
				}
				if(stderr){

					return cb({output:stderr})
				}
				var nextCommand = objectCodeFilePath;
				if(input){
					fs.writeFileSync(inputFilePath, input);
					nextCommand = objectCodeFilePath+' < '+inputFilePath;
				}
				exec(nextCommand, (err, stdout, stderr)=>{
					if(err){
						return cb({output:err});
					}
					if(stderr){
						return cb({output:sdterr})
					}
					return cb({output:stdout, filepath:filepath, objectCodeFilePath:objectCodeFilePath,inputFilePath:inputFilePath?inputFilePath:undefined});
				});
			});
		}
	})
};