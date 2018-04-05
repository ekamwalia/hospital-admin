const redis = require('redis');
const client = redis.createClient();

// Redis configuration
const redisConfig = {
		host: 'localhost',
		port: 6379,
		client: client,
		ttl: 260
	};

module.exports = session => {
	const redisStore = require('connect-redis')(session);
	return new redisStore(redisConfig);
};
