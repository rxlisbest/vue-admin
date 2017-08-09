let localhostDev = true;
//如果是本地开发，就把localhostDev 设置成true，连接就是拼成‘http://localhost:8080/api/test’
//生产环境，就把localhostDev 设置成false，连接就是拼成‘http://xxx.com/api/test’
let _host = localhostDev ? 'http://127.0.0.1:8000' : 'http://xxx.com';
let httpUrl = {
	articles: {
	    'index': _host + '/api/v1/articles',
	    'view': _host + '/api/v1/articles/',
	    'create': _host + '/api/v1/articles',
	    'update': _host + '/api/v1/articles/',
	    'delete': _host + '/api/v1/articles/'
	},
	qiniu: {
	    'token': _host + '/api/v1/qiniu/token',
	},
	file: {
	    'view': _host + '/api/v1/files/',
	    'create': _host + '/api/v1/files',
	},
	statistic: {
	    'index': _host + '/api/v1/statistics',
	},
	auth: {
	    'index': _host + '/api/v1/auth',
	},
};
export const api = httpUrl