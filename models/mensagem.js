var mongoose         = require('mongoose');
var Schema            = mongoose.Schema;
var Anexo               = require('../models/anexo');

var MensagemSchema      = new Schema({
    codigo        : { type: Number,unique:true, index:true},
    destino        : Number,
    visualizada : Boolean,
    assunto      : { type:String, index:true, required: true } ,
    remetente  : { type:String, index:true, required: true } ,
    conteudo    : { type:String, required: true } ,
    data           : { type:Date  } ,
    anexos       : [Anexo.schema] // aceita array de Anexo
});

module.exports      = mongoose.model('Mensagem', MensagemSchema);

