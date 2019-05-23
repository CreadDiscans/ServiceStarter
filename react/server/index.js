const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const mount = require('koa-mount');
const app = new Koa();
const render = require('./render');


app.use(mount('/static/bundles', serve(path.resolve(__dirname, '../build/bundles'))));
app.use((ctx, next) => {
  if (ctx.path === '/') return render(ctx);
  return next();
});
app.use(render);

app.listen(3001);