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

var express =require('express')
var router =module.exports = express.Router();
var Mensagem     = require('../../models/mensagem');
var sisfev = require('../../libs/sisfev/http.js')

router.route('/mensagem')
    // Pega todos os dados respectivos.
    .get(function(req,res){
        Mensagem.find({
        'codigo' : { $in: [
            ID1, // Int com id da mensagem
            ID2,
            ID3
        ]}
}).limit(20).exec(function (err, doc){
            if(err) return res.send(err);
              res.send(doc);
          })
    })

router.route('/mensagem/:mensagem_id')
    .get(function(req,res){
      console.log(req.user.RA);
        Mensagem.findOne({ codigo: req.params.mensagem_id}, function (err, doc){
            if(!doc){


            return res.send(
                {
                    err:"Mensagem não encontrada."
                }
                )

            }
            if(err) return res.send(err);
              res.send(doc);
        });
    })
