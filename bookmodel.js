var mysql = require("mysql2");
var config = require('./config');


const tableBooksName = 'books';
const tableAuthorsName = 'authors';

const connection = mysql.createConnection({
  host: config.mysql_host,
  user: config.mysql_user,
  database: config.mysql_database,
  password: config.mysql_password
}).promise();

function query(sql, params) 
{
	let res = connection.execute(sql, params)
		  .then(([rows, fields]) =>{
		    return rows;
		  })
		  .catch(err =>{
		    console.log(err);
		    return err;
		  });
	return  res;
}

const crud = {
    init: ()   => {return init()},
    getAll: (start,limit,orderby,sort)   => {
		let st = 'SELECT * FROM ' +tableBooksName+' ORDER BY '+orderby+' '+sort+' LIMIT '+start+','+limit;
		return query(st);
	},
    get:    (id) => {
		let st = 'SELECT * FROM '+ tableBooksName + ' LEFT OUTER JOIN '+tableAuthorsName+' ON '+ tableBooksName + '.author_id = '+ tableAuthorsName + '.id WHERE ' + tableBooksName +'.id= ?';
		return query(st, [Number(id)])},
    delete: (id) => {return query(`DELETE FROM ${tableBooksName} WHERE id= ?`, [Number(id)])},
    insert: (request) => {
		//console.log(request);
		datum = new Date().toJSON().slice(0, 10);
		return query(`INSERT INTO ${tableBooksName}
			(author_id,title,description,image,date)  VALUES(?,?,?,?,?)`,
			[request.author_id, request.title,request.description,request.image,datum] );
	},
    update: (id, request) => {
		let st = 'UPDATE ' + tableBooksName + ' SET ';
		let params = [];
		for(var key in request) {
  			console.log(key + ' ' + request[key]);
			st  = st + key + ' = ?,'
			params.push(request[key]); 
		}
		st = st.substring(0, st.length - 1);
		st = st + 'WHERE id = '+id;
		console.log(st);
		return query(st, params);	
	},
};

function init()
{
	let authors = ['Taras Mikolanko','Mikola Tarasenko','Ivan Shevchenko','Petro Ivanenko'];
	let count_authors = authors.length;
	let author_id,datum;
	for (let i = 0; i < count_authors; i++)
	{
		query('INSERT INTO ' + tableAuthorsName +'(name) VALUES("'+authors[i]+'")');
	}
	for (let i = 1; i < 100001  ; i++)  
	{
		author_id = getRandomInt(1,4);
		datum = new Date().toJSON().slice(0, 10); 
		query('INSERT INTO ' + tableBooksName +'(author_id,title,description,image,date) VALUES(?,?,?,?,?)', 				[author_id,'title'+i,'description'+i,'image'+i,datum]);
	}
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * max) + min;
}

module.exports = crud;
