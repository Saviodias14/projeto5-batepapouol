const conteudoDasMensagens = document.querySelector('.mensagens');
const conteudoDosContatos = document.querySelector('.contatos');
let contatoEscolhido;
let exibeTodos;
let vaiAtualizarOsContatos;
//Cadastrando o usuário
let nomeDoUsuario;
let novoNomeDoUsuario;
let naoativar = true;

function enviaONomeDoUsuario(){
    nomeDoUsuario = document.querySelector(".paginaInicial input").value;
    document.querySelector(".paginaInicial input").value = "";
    carregamento();
    cadastrandoUsuario();
}
const inicio = document.querySelector('.paginaInicial');
function carregamento(){
    inicio.querySelector('input').classList.toggle('clicado');
    inicio.querySelector('button').classList.toggle('clicado');
    inicio.querySelector('.gifEntrando').classList.toggle('clicado');
    inicio.querySelector('p').classList.toggle('clicado');
}
function cadastrandoUsuario() {
    novoNomeDoUsuario = {name: nomeDoUsuario};
    const cadastroDoUsuario = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', novoNomeDoUsuario);
    cadastroDoUsuario.then(atualizaDe5Em5);
    cadastroDoUsuario.catch(usuarioJaExiste);
}
function usuarioJaExiste(){
    alert("usuário já existe, escolha outro nome");
    carregamento();
}
function atualizaDe5Em5 (){
    setInterval(atualizacao,5000);
    inicioDasMensagens();
    setInterval(inicioDasMensagens,3000);
    pegaOsContatos();
    setInterval(pegaOsContatos,10000);
    inicio.classList.add('clicado');
    naoativar=false;
}
function atualizacao(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', novoNomeDoUsuario);
}
//Funções para buscar as mensagens do API de 3 em 3 segundos


function inicioDasMensagens(){
    const mensagensPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    mensagensPromise.then(exibeMensagens);
    mensagensPromise.catch(recarregarAPagina);
}

function exibeMensagens(conteudo){
    const condicaoDeAtualizacao = conteudoDasMensagens.innerHTML;
    conteudoDasMensagens.innerHTML = '';
    for(let i = 0; i<conteudo.data.length;i++){
        if(conteudo.data[i].type==="status"){
            conteudoDasMensagens.innerHTML =conteudoDasMensagens.innerHTML + 
            `<li data-test="message" class="mensagem entrouSaiu">
                <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>${conteudo.data[i].text}</div>
            </li>`;
        }
        else if(conteudo.data[i].type==="message"){
            conteudoDasMensagens.innerHTML =conteudoDasMensagens.innerHTML + 
            `<li data-test="message" class="mensagem">
                <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>para <span>${conteudo.data[i].to}:</span> ${conteudo.data[i].text}</div>
            </li>`;
        }
        else if((conteudo.data[i].type==='private_message')&&(conteudo.data[i].to === nomeDoUsuario||conteudo.data[i].from === nomeDoUsuario)){
            conteudoDasMensagens.innerHTML =conteudoDasMensagens.innerHTML +
            `<li data-test="message" class="mensagem reservado">
                <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>para <span>${conteudo.data[i].to}:</span> ${conteudo.data[i].text}</div>
            </li>`;
        }
    }
    if(condicaoDeAtualizacao!==conteudoDasMensagens.innerHTML){
        document.querySelector('li:last-child').scrollIntoView();
    }
}
//Atualiza a lista de contatos na sidebar de 10 em 10 segundos


function pegaOsContatos(){
    const contatosPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    contatosPromise.then(exibeContatos);
    contatosPromise.catch(recarregarAPagina);
}

function exibeContatos(conteudo){
    if(conteudoDosContatos.querySelector('.escolhoVoce p')){
        contatoEscolhido = conteudoDosContatos.querySelector('.escolhoVoce p').innerHTML;
    }

    if(conteudoDosContatos.querySelector('.escolhido').classList.contains('clicado')){
        conteudoDosContatos.innerHTML =`
        <li data-test="all" class="participantes">
            <div onclick="mudaOContato(this)" class="dadosAside todos">
                <ion-icon class="iconeTodos" name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon class="escolhido clicado" name="checkmark-sharp"></ion-icon>
            </div>
        </li>`;
    }else{
        conteudoDosContatos.innerHTML =`
        <li data-test="all" class="participantes escolhoVoce">
            <div onclick="mudaOContato(this)" class="dadosAside todos">
                <ion-icon class="iconeTodos" name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon class="escolhido" name="checkmark-sharp"></ion-icon>
            </div>
        </li>`;
    }
    for(let i = 0; i<conteudo.data.length;i++){
        if(contatoEscolhido===conteudo.data[i].name){
            conteudoDosContatos.innerHTML = conteudoDosContatos.innerHTML + 
            `
            <li data-test="participant" class="participantes escolhoVoce">
                <div onclick="mudaOContato(this)" class="dadosAside">
                    <ion-icon class="iconeParticipantes" name="person-circle"></ion-icon>
                    <p>${conteudo.data[i].name}</p>
                    <ion-icon data-test="check" class="escolhido" name="checkmark-sharp"></ion-icon>
                </div>
            </li>`;
        }else{
            conteudoDosContatos.innerHTML = conteudoDosContatos.innerHTML + 
            `
            <li data-test="participant" class="participantes">
                <div onclick="mudaOContato(this)" class="dadosAside">
                    <ion-icon class="iconeParticipantes" name="person-circle"></ion-icon>
                    <p>${conteudo.data[i].name}</p>
                    <ion-icon data-test="check" class="escolhido clicado" name="checkmark-sharp"></ion-icon>
                </div>
            </li>`;
        }
        
    } 
    if(!conteudoDosContatos.querySelector('.escolhoVoce')){
            conteudoDosContatos.querySelector('.escolhido').classList.remove('clicado');
    }
}



// Enviando as mensagens
const tipo = ()=>{
    const tipoDaMensagem = document.querySelector('.listaDaVisibilidade .clicado').parentNode.querySelector('p').innerHTML;
    if(tipoDaMensagem==='Público'){
        return 'private_message';
    }
    else{
        return 'message';
    }
}
function enviaMensagem(){
    let valorDoInput = document.querySelector('input').value;
    if(valorDoInput){
         valorDoInput={
            from: nomeDoUsuario,
            to: conteudoDosContatos.querySelector('.escolhoVoce p').innerHTML,
            text: valorDoInput,
            type: tipo()
        };
        const mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', valorDoInput);
        mensagemEnviada.then(inicioDasMensagens);
        mensagemEnviada.catch(recarregarAPagina);
        document.querySelector('input').value="";
    }
}

function recarregarAPagina(){
    window.location.reload(true);
}
//Enviando mensagens com o enter
document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        const btn1 = document.querySelector("#campo");
        const btn2 = document.querySelector('#entrada');

        btn1.click();
        if(naoativar){
            btn2.click();
        }
    }
  });
//Abrindo barra lateral
const abreAside = () => document.querySelector(".fundo").classList.remove("esconde");

const fechaAside = () => document.querySelector(".fundo").classList.add("esconde");
//Selecionando visibilidade e contatos

const paraQuem = () =>  {
    if(tipo()==='private_message'){
        return "reservadamente";
    }else{
        return "público";
    }
}

function mudaAVisibilidade(elemento){
    const addClasse = document.querySelectorAll('.listaDaVisibilidade .escolhido');
    for(let i = 0;i<addClasse.length;i++){
        addClasse[i].classList.add('clicado');
    }
    elemento.querySelector('.escolhido').classList.remove('clicado');
    document.querySelector('.paraQuem').innerHTML = `Enviando para ${conteudoDosContatos.querySelector('.escolhoVoce p').innerHTML} (${paraQuem()})`;

}
function mudaOContato(elemento){
    const addClasse = document.querySelectorAll('.contatos .escolhido');
    const escolhoVoce = document.querySelectorAll('.contatos .participantes');
    for(let i = 0;i<addClasse.length;i++){
        addClasse[i].classList.add('clicado');
    } 
    for(let i = 0;i<escolhoVoce.length;i++){
        escolhoVoce[i].classList.remove('escolhoVoce');
    }
    elemento.querySelector('.escolhido').classList.remove('clicado');
    elemento.querySelector('.escolhido').parentNode.classList.add('escolhoVoce');
    document.querySelector('.paraQuem').innerHTML = `Enviando para ${conteudoDosContatos.querySelector('.escolhoVoce p').innerHTML} (${paraQuem()})`;
}