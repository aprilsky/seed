/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */


var route = require('./route');

route.map({
    method:'get',
    url: /^\/$/i,
    controller: 'blog',
    action: 'index'
});

route.map({
    method:'get',
    url: /^\/blog\/?$/i,
    controller: 'blog',
    action: 'index'
});

route.map({
    method:'get',
    url: /^\/tweets\/?$/i,
    controller: 'blog',
    action: 'tweets'
});

route.map({
    method:'get',
    url: /^\/tweets_data\/?$/i,
    controller: 'blog',
    action: 'tweets_data'
});


route.map({
    method:'get',
    url: /^\/about\/?$/i,
    controller: 'blog',
    action: 'about'
});

route.map({
    method:'get',
    url: /^\/toAdd\/?$/i,
    controller: 'blog',
    action: 'toAdd'
});

route.map({
    method:'post',
    url: /^\/addPost\/?$/i,
    controller: 'blog',
    action: 'addPost'
});


route.map({
    method:'get',
    url: /^\/tools\/?$/i,
    controller: 'nav',
    action: 'tools'
});



route.map({
    method:'get',
    url: /^\/getTrainAdminDetail_\/?$/i,
    controller: 'tools',
    action: 'getTrainAdminDetail_'
});



exports.staticFileDir = 'static';
