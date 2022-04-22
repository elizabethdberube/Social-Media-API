const { connect, connection } = require('mongoose');

const connectionMon = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialDB';

connect(connectionMon, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;
