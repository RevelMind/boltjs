import * as http from 'http';
import * as url from 'url';
import { pathToRegexp, match, parse, compile } from "path-to-regexp";

let request = class {
    private req;
    private keys;
    public headers;
    public url;
    public httpVersion;
    public method;
    public rawHeaders;
    public protocol;
    public vars;
    public body = undefined;

    constructor(req, path) {
        this.req = req;

        this.httpVersion = req.httpVersion;
        this.method = req.method;
        this.headers = req.headers;
        this.rawHeaders = req.rawHeaders;
        this.protocol = '';

        if (req.connection.encrypted !== undefined)
            this.protocol = 'https';
        else
            this.protocol = 'http';

        if (path !== undefined) {
            let handler = match(path, { decode: decodeURIComponent });
            this.vars = handler(req.url).params;
        } else
            this.vars = {};

        this.url = new URL(req.url, `${this.protocol}://${this.headers.host}`).href;
    
        if (this.method == 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on('end', () => {
                this.body = body;
            });

            while (this.body === undefined) {
                // ... wait
            }
        } else {
            this.body = undefined;
        }
    }
}

let response = class {
    
}

let bolt = class {
    private getPaths;
    private postPaths;

    constructor() {
        this.getPaths = {};
        this.postPaths = {};
    }

    get(path: string, callback: Function) {
        this.getPaths[path] = callback;
    }

    post(path: string, callback: Function) {
        this.postPaths[path] = callback;
    }

    listen(port: number, func: Function) {
        let server = http.createServer((req, res) => {
            let paths = {};

            if (req.method == "GET") {
                paths = this.getPaths;
            } else if (req.method == "POST") {
                paths = this.postPaths;
            }

            let found = false;

            Object.keys(paths).forEach(path => {
                if (!(path == '*')) {
                    let keys = [];
                    let regex = pathToRegexp(path, keys);

                    let match = regex.exec(req.url);
                    if (match !== null && match.length > 0) {
                        found = true;
                        let callback = paths[path];

                        callback(new request(req, path));
                    }
                }
            });

            if (found == false) {
                if (paths['*'] !== undefined) {
                    paths['*'](new request(req, undefined));
                }
            }
        })
        if (func !== undefined) {
            server.listen(port, () => func(port));
        }
        server.listen(port)
    }
}

module.exports = bolt;