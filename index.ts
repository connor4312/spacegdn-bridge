/// <reference path="types/request/request.d.ts" />
/// <reference path="types/node/node.d.ts" />
import request = require('request')
import querystring = require('querystring')

class Bridge {
    private endpoint: String;
    private route: string[];
    private parameters: any;
    data: any;

    static operators = {
        '=': 'eq',
        '<': 'lt',
        '>': 'gt',
        '<=': 'lteq',
        '>=': 'gteq'
    };

    static columns = {
        'jar': ['id', 'name', 'site_url', 'created_at', 'updated_at'],
        'channel': ['id', 'jar_id', 'name', 'created_at', 'updated_at'],
        'version': ['id', 'channel_id', 'version', 'created_at', 'updated_at'],
        'build': ['id', 'version_id', 'build', 'size', 'checksum', 'url', 'created_at', 'updated_at']
    };

    constructor() {
        this.clear();
    }

    setEndpoint(url: string): Bridge {
        if (url.indexOf('//') === -1) {
            url = 'http://' + url;
        }

        this.endpoint = url.replace(/\/$/, '');

        return this;
    }

    clear(): void {
        this.route = [];
        this.results = null;
        this.parameters = {};
    }

    jar(id: number): Bridge {
        this.route.push('jar', id.toString());

        return this;
    }

    version(id: number): Bridge {
        this.route.push('version', id.toString());

        return this;
    }

    channel(id: number): Bridge {
        this.route.push('channel', id.toString());

        return this;
    }

    build(id: number): Bridge {
        this.route.push('build', id.toString());

        return this;
    }

    get(item: string): Bridge {
        if (item) {
            this.route.push(item.replace(/s$/, ''));
        }

        return this;
    }

    where(column: string, operator: string, value: any): Bridge {
        var column: string = this.resolveColumn(column);
        var params: string[];

        if (operator === 'in') {
            params = [column, 'in', value.join('.')];
        } else {
            params = [column, Bridge.operators[operator], value];
        }

        this.parameters.where = params.join('.');

        return this;
    }

    orderBy(column: string, direction: string) {
        this.parameters.sort = this.resolveColumn(column) + '.' + direction;
    }

    page(page: number): Bridge {
        this.parameters.page = page;

        return this;
    }

    resolveColumn(column: string): string {
        if (column.indexOf('.') !== -1) {
            return column;
        }

        for (var key in Bridge.columns) {
            if (Bridge.columns[key].indexOf(column) !== -1) {
                return key + '.' + column;
            }
        }
    }

    results(callback: (err, results) => void): void {
        if (!this.data) {
            request.request({
                'url': this.endpoint + this.route.join('/') + '?' + querystring.stringify(this.parameters),
                'method': 'GET',
                'json': true
            }, function (err, response, body) {
                if (err) {
                    return callback(err, null);
                }

                this.data = body;
                callback(null, body);
            });
        }

        callback(null, this.data);
    }
}

module.exports = Bridge;