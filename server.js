const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const compilers = require('./compilers/compilers');
//const cors = require('cors')
const server = express();

const option = {init:true};
compilers.init(option);

const lang = {
	cpp:{compiler:compilers.compileCPP},
	python:{compiler:compilers.compilePython}
};



server.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PETCH, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	if(req.method == 'OPTIONS'){
		return res.sendStatus(200);
	}
	next();
});

//server.use(cors());

server.use(bodyParser.json());


server.post('/compile/:lang', (req, res, next)=> {
	console.log(req.params)
	if(!req.body.input && !req.body.code){
		return res.status(400).json({result:'No Code, No Input thus No response ...'})
	}
	if(req.params.lang !== 'cpp' && req.params.lang !== 'python'){
		return res.status(400).json({result:'Non supported language'});
	}
	const envData = {
		OS:process.env.OS,cmd:process.env.CMD
	}
	lang[req.params.lang].compiler(envData,req.body.code,req.body.input, data=>{
		res.status(201).json({result:data.output})
		if(data.filepath)
			fs.unlinkSync(data.filepath);
		if(data.objectCodeFilePath)
			fs.unlinkSync(data.objectCodeFilePath)
		if(data.inputFilePath)
			fs.unlinkSync(data.inputFilePath);
	});
		
});
server.use((req, res)=>{
	res.send('server is running')
})
const port = process.env.PORT || '3001';
server.listen(port, ()=>{
	console.log(`Server is running of ${port}`);
});