var express =require('express')
var router =module.exports = express.Router();
var Mensagem     = require('../../models/mensagem');
var sisfev = require('../../libs/sisfev/http.js')

router.route('/mensagem')
    // Pega todos os dados respectivos.
    .get(function(req,res){
        Mensagem.find({
        'codigo' : { $in: [
            '157899',
            '157895',
            '157893'
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
