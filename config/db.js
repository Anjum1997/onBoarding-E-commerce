const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;
 

// Redis cache
// virtuls
// mongoose middlewares

//  Redis or Memcached ,gzip or Brotli ,HTTP headers like ETag, Cache-Control, RabbitMQ or Kafka,New Relic, Datadog, or Prometheus, ELK Stack (Elasticsearch, Logstash, Kibana) or Splunk, Apache JMeter, Loader.io, or Artillery ,Nginx , GraphQL,Winston or Bunyan,PM2.
