const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');
const rootDir = require('../../util/path');
const path = require('path');

exports.init = false;

exports.python = (envData, code, input, cb) => {
	if(!exports.init)
		return false;
	let filename = cuid.slug();
	let filepath = path.join(rootDir, 'temp', filename);
	fs.writeFile(filepath+'.py', code, err=>{
		if(err){
			return cb({output:stderr});
		}
		let command = 'python '+filepath+'.py';
		if(input){
			fs.writeFileSync(filepath+'_input.txt', input);
			command = 'python '+filepath+'.py < '+ filepath+'_input.txt';
		}
		exec(command, (err, stdout, stderr)=>{
			if(err){
				console.log(err)
				return cb({output:stderr});
			}
			if(stderr){
				console.log(err)
				return cb({output:stderr});
			}
			return cb({output:stdout, filepath:filepath+'.py' ,inputFilePath:input?filepath+'_input.txt':undefined });
		});

	})
};