var mongoose         = require('mongoose');
var Schema            = mongoose.Schema;

var UserSchema      = new Schema({
    RA        : Number,
    session : String,
});

module.exports      = mongoose.model('User', UserSchema);

