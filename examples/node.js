var http    = require('http'),
    through = require('through'),
    st      = require('st'),
    fusion  = require('fusion');

var mount  = st({ url:  '/static', path: __dirname + '/fjs' }),
    filter = through(function(data) { this.emit('data', fusion.transpile(data.toString())) });

http.createServer(function(req, res)
{
    res.filter = filter;

    if (mount(req, res))
        res.setHeader('content-type', 'application/javascript');
})
.listen(1337);

console.log('Server running on port 1337...');