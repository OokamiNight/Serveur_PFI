function ShowRequestInfo(req) {
    console.log(`Request --> [${req.method}::${req.url}]`);
    if (req.headers["content-type"] != undefined)
        console.log(`Content-type:${req.headers["content-type"]}`);
}

function API_Endpoint(req, res) {
    return require('./router').dispatch_API_EndPoint(req, res);
}
function token_Endpoint(req, res) {
    return require('./router').dispatch_TOKEN_EndPoint(req, res);
}
function registered_Enpoint(req, res) {
    return require('./router').dispatch_Registered_EndPoint(req, res);
}
function routeConfig() {
    const RouteRegister = require('./routeRegister');
    RouteRegister.add('GET', 'accounts');
    RouteRegister.add('POST', 'accounts', 'register');
    //RouteRegister.add('POST', 'accounts', 'logout');
    RouteRegister.add('PUT', 'accounts', 'change');
    //RouteRegister.add('DELETE', 'accounts', 'remove');
}

function responseNotFound(res) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end();
}

let requestProcessStartTime = null;
function setRequestProcessStartTime() {
    requestProcessStartTime = process.hrtime();
}
function showRequestProcessTime() {
    let requestProcessEndTime = process.hrtime(requestProcessStartTime);
    console.log("Response time: ", Math.round((requestProcessEndTime[0] * 1000 + requestProcessEndTime[1] / 1000000) / 1000 * 10000) / 10000, "seconds");
}

function showMemoryUsage() {
    const used = process.memoryUsage();
    console.log("RSet size:", Math.round(used.rss / 1024 / 1024 * 100) / 100, "Mb |",
        "Heap size:", Math.round(used.heapTotal / 1024 / 1024 * 100) / 100, "Mb |",
        "Used size:", Math.round(used.heapUsed / 1024 / 1024 * 100) / 100, "Mb");
}
function AccessControlConfig(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', '*'); 
}
function CORS_Prefligth(req, res) {
    if (req.method === 'OPTIONS') {
        console.log('preflight CORS verifications');
        res.end();
        // request handled
        return true;
    }
    // request not handled
    return false;
}
function cached_Endpoint(req, res) {
    if (req.method == 'GET') {
        const Cache = require('./getRequestsCacheManager');
        let cacheFound = Cache.find(req.url);
        if (cacheFound != null) {
            res.writeHead(200, { 'content-type': 'application/json', 'ETag': cacheFound.ETag });
            res.end(cacheFound.content);
            return true;
        }
    }
    return false;
}
function API_Endpoint(req, res) {
    return require('./router').dispatch_API_EndPoint(req, res);
}
function Static_Ressource_Request(req, res) {
    const staticRessourcesServer = require('./staticRessourcesServer.js');
    return staticRessourcesServer.sendRequestedFile(req, res);
}

routeConfig();

const server = require('http').createServer(async (req, res) => {
    setRequestProcessStartTime();
    console.log('<--------------------------------------------------------');
    ShowRequestInfo(req);

    AccessControlConfig(res);
    ////////////////////////////////////////////////////////////////////////
    // Middlewares pipeline

    if (!CORS_Prefligth(req, res))
        if (!cached_Endpoint(req, res))
            if (!(await token_Endpoint(req, res)))
                if (!(await registered_Enpoint(req, res)))
                    if (!(await API_Endpoint(req, res)))
                        if (!Static_Ressource_Request(req, res))
                            responseNotFound(res);

    ////////////////////////////////////////////////////////////////////////   

    showRequestProcessTime();
    showMemoryUsage();
    console.log('-------------------------------------------------------->');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}...`));
showMemoryUsage();

