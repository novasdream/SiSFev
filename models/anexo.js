var mongoose         = require('mongoose');
var Schema             = mongoose.Schema;
var AnexoSchema      = new Schema({
  codigo        : { type: Number },
  name         : { type:String }
});

module.exports      = mongoose.model('Anexo', AnexoSchema);
