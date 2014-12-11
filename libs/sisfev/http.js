
var unirest = require('unirest');
var logged = false;
var CookieJar = unirest.jar();
var exports = module.exports = {};
var events = require('events');
var eventEmitter = new events.EventEmitter();
var Anexo = require('../../models/anexo')
var Mensagem = require('../../models/mensagem')
var async = require('async')
var identificador = null;
var logger = require('../../libs/sisfev/logger')
var md5 = require('MD5');

function login(user,password,emitter){
    unirest.post('https://www.unifev.edu.br/portalunifev2/PoLogin/PoLoginAuth.php')
    .headers(
        {
            'Accept': '*/*',
            'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:19.0) Gecko/20100101 Firefox/19.0',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer':'https://www.unifev.edu.br/portalunifev2/PoLogin/PoLogin.php'
        })
    .jar(CookieJar)
    .send({'usuario':user,'senha':md5(password)})
    .end(function(response){
        console.log(md5(password))
        if(response.body!="Usuário ou senha inválido..."){
            logger.info("[Login] Login efetuado com sucesso.");
            logged = true;
            // Função removida Responsavel por efetuar login de acordo com o que protocolo
            //emulation_proc(emitter)
            eventEmitter.emit('loginFinished');
        } else {
            logger.log('warn', '[Login] Login recusado. %s', response.body);
        }
    })
}



//emitter foi definido para utilização da queue
// Uso do queue atualmente é apenas para modo de debug e testes.
function isLogged(username,password,emitter){
    unirest.get('https://www.unifev.edu.br/portalunifev/PoMPrincN001.php')
    .headers({
                'Accept': '*/*',
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:19.0) Gecko/20100101 Firefox/19.0',
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            })
    .jar(CookieJar)
    .end(function(response){
        // Efetuar checagem caso o retorno for nulo
        if(response.body.indexOf('Você tentou acessar conteúdo Restrito!')>-1)
        {
            logger.info('[isLogged] Conteudo Restrito. Tentando Efetuar login')
            login(username,password,emitter); /// Edição para publicar
            return false;
        } else {
            logger.verbose('[isLogged] Login permanece ativo.')

        }
        return true;
    });
}

var getIdentificador = function (){
    unirest.get('https://www.unifev.edu.br/portalunifev2/PoMenPor/PoMenPorN001.php')
    .headers({
            'Accept': '*/*',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0a2) Gecko/20110613 Firefox/6.0a2',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer':'https://www.unifev.edu.br/portalunifev/PoMPrincN002.php'
    })
    .jar(CookieJar)
    .end(function(response){
    //Regex executa dentro do loop
    var re = /ps3="(\d*?)"/g;
    var str = response.body;
    var m;
        while ((m = re.exec(str)) != null) {
            if (m.index === re.lastIndex) {
            re.lastIndex++;
            }
            eventEmitter.emit('identificadorPronto',m[1]);
        }
    })
}

var getListMensagem = function(identificador){
    unirest.post('https://www.unifev.edu.br/portalunifev2/PoMenPor/PoMenPorC04.php')
    .headers({
            'Accept': '*/*',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0a2) Gecko/20110613 Firefox/6.0a2',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer':'https://www.unifev.edu.br/portalunifev2/PoMenPor/PoMenPorN001.php'
    })
    .jar(CookieJar)
    .send({'p_user':identificador})
    .end(function(response){

    var re = /<tr [\S\s]*? cod="([\S\s]*?)" vizualiza="([\S\s]*?)" dest="([\S\s]*?)" [^>]*?>[\S\s]*?<\/tr>/g;
    var re2 = /<td [\S\s]*?>([^*]*?)<\/td>/g;
    var str = response.body;
    var m;
    var m2;

        while ((m = re.exec(str)) != null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
            logger.info('Encontrada mensagem: %d', m[1])
            queue_header.push(m[1],1,retornoHeader);
        }
    })
}


var getMensagemHeader = function (id,callback){
    var mensagem = new Mensagem();
    mensagem.codigo = id;
    var anexos =[];


    unirest.post('https://www.unifev.edu.br/portalunifev2/PoMenPor/PoMenPorC05.php')
    .headers({
            'Accept': '*/*',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0a2) Gecko/20110613 Firefox/6.0a2',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer':'https://www.unifev.edu.br/portalunifev2/PoMenPor/PoMenPorN001.php'
    })
    .send({
        'v_mencod':id
    })
    .jar(CookieJar)
    .end(function(response){

    var re = /cod=([\S\s]*?)><img src=..\/imagens\/extension\/([^>]*?) class="img"><\/td><\/tr><tr><td>([^>]*?)<\/td><\/tr>/g;
    var str =response.body;
    var m;
    // Se encontra o anexo executa o procedimento abaixo para ser criado o novo anexo.
    while ((m = re.exec(str)) != null) {
    if (m.index === re.lastIndex) {
    re.lastIndex++;
    }
        // Cria o novo anexo que sera colocado no array
        var anexo = new Anexo();
        //Certas mensagens estao em brancas por algum motivo.
        //anexo.codigo = m[1];    // codigo do anexo
        anexo.name =m[3];
        anexos.push(anexo);
        mensagem.anexos = anexos;
    }

    var re2 = /[ ]{16}([^>]*?)[ ]{12}[\S\s]*?value="([\S\s]*?)"/g;
    var str2 =response.body;
    var m2;

    while ((m2 = re2.exec(str2)) != null) {
        if (m2.index === re2.lastIndex) {
            re2.lastIndex++;
        }
        mensagem.assunto = m2[2];
        mensagem.remetente = m2[1]
        if(m2[2] == '' && m2[1] ==''){
            return callback('[MensagemHeader] - Mensagens com Assunto e Remetentes invalidos ' + id, mensagem);
        }

        return callback(null, mensagem)
    }
    return callback('[MensagemHeader] - Mensagem não encontrada ' + id, mensagem)
    })

}

  getMensagemConteudo = function(mensagem,callback){

    unirest.post('https://www.unifev.edu.br/portalunifev2/PoMenPor/PoMenPorV03.php')
        .headers({
                'Accept': '*/*',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0a2) Gecko/20110613 Firefox/6.0a2',
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer':'https://www.unifev.edu.br/portalunifev2/PoMenPor/PoMenPorN001.php'
        })
        .send({
            'v_mencod':mensagem.codigo
        })
        .jar(CookieJar)
        .end(function(response){
//         console.log('response = '+response.body)
        var re =   /id="TextoMensagem">([\S\s]*?)<\/text/g;
        var str = response.body;
        var m;

        while ((m = re.exec(str)) != null) {
        if (m.index === re.lastIndex) {
        re.lastIndex++;
        }
            mensagem.conteudo = m[1];
            console.log(m[1])
            callback(null,mensagem,true);
        }
        })


}



exports.queue_header     =queue_header       =   async.priorityQueue(getMensagemHeader, 4);
exports.queue_conteudo = queue_conteudo =  async.priorityQueue(getMensagemConteudo, 4);


function startQueue(var_inicio){
    logger.log('[StartQueue] Iniciando queue de  [%d] até [%d].',inicio,fim);
    queue_header.push(inicio,1,retornoHeader);

}

queue_header.drain = function() {
    logger.info('[QueueHeader] Terminada. Requisitando mais items.');
   // isLogged(false);
};

function paginaLogin(numero,callback) {
    // Do funky stuff with file
        setTimeout(function(){
            queueMensagem.push(numero,1, retorno);
            callback(null, 'login: '+numero);
        }, 2000);
}

function paginaGetMensagem(numero,callback) {
        // Do funky stuff with file
        setTimeout(function(){
            callback(null, 'mensagem: '+numero);
        }, 2000);
}

function retornoHeader(err,mensagem){
    if (err) {
        return logger.log('error', '[HeaderError] [%s]', err);
    }
        queue_conteudo.push(mensagem,1,retornoConteudo);
}

function retornoConteudo(err,mensagem,debug){
    if(err)
        logger.log('error', '[ConteudoError] [%s] [Continuando]', err);
        if(debug){
            return logger.warn("[DEBUG MODE] Conteudo da mensagem\n [%s]", mensagem._doc)
        }
        mensagem.save(function (err_save, mensagem, numberAffected) {
        if (err_save) {
            if(err_save.code ==11000){
                return logger.warn(err_save.err)
            }
            return logger.error('[ConteudoError] [save] [2] '+ err_save.err);
        }
        return logger.log('verbose','[RetornoConteudo] - [Mongoose] saved Mensagem[%d] conteudo [%s] ', mensagem.codigo, mensagem.conteudo)
    })
}




var array = [];
exports.test = function(){
isLogged(LOGIN,SENHA,true);


//cookieTeste();
//isLogged(true);
//eventEmitter.on('teste', teste);
eventEmitter.on('loginFinished', getIdentificador);
//eventEmitter.on('identificadorPronto', teste);
eventEmitter.on('identificadorPronto', getListMensagem);
//eventEmitter.on('getMensagemHeader', getMensagemHeader);
//eventEmitter.on('getMensagemConteudo', getMensagemConteudo);
}




//Teste de manipulação de cookies.
function cookieTeste(){
var CookieJar3 = unirest.jar();
CookieJar3.add('PHPSESSID=dasdadad','http://httpbin.org');
unirest.get('http://httpbin.org/cookies/set?k1=v1&k2=v2')
.jar(CookieJar3)
.end(function(response){
         console.log(response.headers)
         console.log('-----------------------------------')
         console.log(response.cookie('k1'))
});
}