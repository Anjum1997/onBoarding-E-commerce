const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
 
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number,
       required: true
       },
  totalAmount: {
    type: Number,
  },
  
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);


//  Redis or Memcached ,gzip or Brotli ,HTTP headers like ETag, Cache-Control, RabbitMQ or Kafka,New Relic, Datadog, or Prometheus, ELK Stack (Elasticsearch, Logstash, Kibana) or Splunk, Apache JMeter, Loader.io, or Artillery ,Nginx , GraphQL,Winston or Bunyan,PM2.