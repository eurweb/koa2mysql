var Koa = require('koa');
var convert = require('koa-convert');
var KoaBody = require('koa-body');
var Router = require('koa-router');
var Bookmodel = require('./bookmodel');
var config = require('./config');
var router = new Router({ prefix: '/books'});
var koaBody = convert(KoaBody());
var app = new Koa();

router
.get('/init', async (ctx, next) => {
	ctx.body = await Bookmodel.init(); // fill the database
})
.get('/:start/:limit/:orderby/:sort', async (ctx, next) => {
	let sort = ctx.params.sort, limit = ctx.params.limit, start = ctx.params.start;
	// check input var
	if (sort != 'asc' || sort != 'desc') sort = 'asc';
	limit = parseInt(limit);
	if (limit > 1000) limit = 1000; 
	start = parseInt(start);
	ctx.body = await Bookmodel.getAll(start, limit, ctx.params.orderby, sort); 
})
.get('/:id', async (ctx, next) => {
	// check input var
	let id = parseInt(ctx.params.id);
	ctx.body = await Bookmodel.get(id);
})
.post('/', koaBody,  async (ctx, next) => {
	ctx.body = await Bookmodel.insert(ctx.request.body);
})
.put('/:id', koaBody,  async (ctx, next) => {
	// check input var
	let id = parseInt(ctx.params.id);
	//console.log(ctx.request.body);
	ctx.body = await Bookmodel.update(id, ctx.request.body);
})
.delete('/:id', async (ctx, next) => {
	let id = parseInt(ctx.params.id); // check input var
	ctx.body = await Bookmodel.delete(id);
});

app.use(async (ctx, next) => {
 try {
 await next();
 } catch (err) {
 ctx.status = err.status || 500;
 ctx.body = err.message;
 ctx.app.emit('error', err, ctx);
 }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port);



  

