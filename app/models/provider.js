var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');
var ProviderSchema = new Schema({
    name: String,
    password: String,
    email: String,
    creationDate: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Provider', ProviderSchema);
// module.exports = providers;
