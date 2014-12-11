var mongoose         = require('mongoose');
var Schema            = mongoose.Schema;
var Disciplina               = require('./models/anexo');

var DisciplinaSchema      = new Schema({
    name        : String,
});

module.exports      = mongoose.model('Disciplina', DisciplinaSchema);