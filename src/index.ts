import * as http from 'http';
import * as url from 'url';
import { pathToRegexp, match, parse, compile } from "path-to-regexp";

let request = class {
    private req;
    public url;
    public httpVersion;

    constructor(req) {
        this.req = req;

        this.url = req.url;
        this.httpVersion = req.httpVersion;
        this.method = req.method;
    }
}

let bolt = class {
    private getPaths;

    constructor() {
        this.getPaths = {};
    }

    get(path: string, callback: Function) {
        this.getPaths[path] = callback;
    }

    listen(port: number, func: Function | void) {
        let server = http.createServer((req, res) => {
            let paths = {};

            if (req.method == "GET") {
                paths = this.getPaths;
            }

            let found = false;

            Object.keys(paths).forEach(path => {
                if (!(path == '*')) {
                    let keys = [];
                    let regex = pathToRegexp(path, keys);

                    let match = regex.exec(req.url);
                    if (match !== null && match.length > 0) {
                        console.log(match);
                        found = true;
                        let callback = paths[path];

                        callback(new request(req));
                    }
                }
            });

            if (found == false) {
                if (paths['*'] !== undefined) {
                    paths['*'](new request(req));
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