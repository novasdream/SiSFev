/*
* Copyright (c) 2014-2015 SiSFev <https://github.com/novasdream/SiSFev>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

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

