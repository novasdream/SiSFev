var express =require('express')
var router =module.exports = express.Router();

var Bear     = require('../../models/bear');

router.route('/bears')
    //Cria um novo
    .post(function(req,res){

        req.assert('name', 'Name is required').notEmpty();

        var bear        =  new Bear();
        bear.name     = req.body.name;  //Dados vindos da requisição.
        bear.save(function(err){
            if(err)
                res.send(err)
            res.json({message:'Bear Created.'})
        })
    })

    // Pega todos os dados respectivos.
    .get(function(req,res){
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);
            res.json(bears);
        });
    })



router.route('/bears/:bear_id')
    .get(function(req,res){
        Bear.findById(req.params.bear_id, function(err,bear){
            if(err)
                res.send(err);
            res.json(bear);
        })
    })
    .put(function(req,res){
        Bear.findById(req.params.bear_id, function(err,bear){
            if(err)
                res.send(err);
            bear.name = req.body.name;

            bear.save(function(err){
                if(err)
                    res.send(err)
                res.json({message:'Bear updated!'});
            })
        })
    })
    .delete(function(req,res){
        Bear.remove({
            _id:    req.params.bear_id
        }, function(err,bear){
            if(err)
                res.send(err);
            res.json({message:"Bear removido"});
        })
    })