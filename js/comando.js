let conteudoDasMensagens = document.querySelector('.mensagens');
let conteudoDosContatos = document.querySelector('.contatos');
let contatoEscolhido;
let exibeTodos;
let vaiAtualizarOsContatos;
//Cadastrando o usuário
let nomeDoUsuario = prompt('Digite o seu nome de usuário');
let novoNomeDoUsuario;

cadastrandoUsuario();
function cadastrandoUsuario() {
    novoNomeDoUsuario = {name: nomeDoUsuario};
    console.log(novoNomeDoUsuario);
    const cadastroDoUsuario = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', novoNomeDoUsuario);
    cadastroDoUsuario.then(atualizaDe5Em5);
    cadastroDoUsuario.catch(usuarioJaExiste);
}
function usuarioJaExiste(erro){
    alert("usuário já existe");
    nomeDoUsuario = prompt('Escolha um outro nome de usuário');
    cadastrandoUsuario();
}
function atualizaDe5Em5 (){
    setInterval(atualizacao,5000);
}
function atualizacao(){
    const enviaStatus = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', novoNomeDoUsuario);
}
//Funções para buscar as mensagens do API de 3 em 3 segundos

setInterval(inicioDasMensagens,3000);
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
             `<li class="mensagem entrouSaiu">
                 <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>entra na sala...</div>
             </li>`;
    
        }
        else if(conteudo.data[i].type==="message"){
            conteudoDasMensagens.innerHTML =conteudoDasMensagens.innerHTML + 
             `<li class="mensagem">
                 <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>para <span>${conteudo.data[i].to}:</span> ${conteudo.data[i].text}</div>
             </li>`;
        }
        else if((conteudo.data[i].type==='private_message')&&(conteudo.data[i].to === nomeDoUsuario)){
            conteudoDasMensagens.innerHTML =conteudoDasMensagens.innerHTML +
             `<li class="mensagem reservado">
                 <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>para <span>${conteudo.data[i].to}:</span> ${conteudo.data[i].text}</div>
             </li>`;
        }
    }
    if(condicaoDeAtualizacao!==conteudoDasMensagens.innerHTML){
        document.querySelector('li:last-child').scrollIntoView();
    }
}
//Atualiza a lista de contatos na sidebar de 3 em 3 segundos
setInterval(pegaOsContatos,3000);

function pegaOsContatos(){
    const contatosPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    contatosPromise.then(exibeContatos);
    contatosPromise.catch(recarregarAPagina);
}

function exibeContatos(conteudo){
    if(conteudo.data!==vaiAtualizarOsContatos){
        if(conteudoDosContatos.querySelector('.escolhoVoce p')){
            contatoEscolhido = conteudoDosContatos.querySelector('.escolhoVoce p').innerHTML;
        }

        if(conteudoDosContatos.querySelector('.escolhido')){
            exibeTodos = conteudoDosContatos.querySelector('.escolhido');
        }

        if(exibeTodos.classList.contains('clicado') && conteudoDosContatos.querySelector('.escolhoVoce p')){
            conteudoDosContatos.innerHTML =`
            <li class="participantes">
                <div onclick="mudaOContato(this)" class="dadosAside todos">
                    <ion-icon class="iconeTodos" name="people"></ion-icon>
                    <p>Todos</p>
                    <ion-icon class="escolhido clicado" name="checkmark-sharp"></ion-icon>
                </div>
            </li>`;
        }else{
            conteudoDosContatos.innerHTML =`
            <li class="participantes">
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
                 <li class="participantes escolhoVoce">
                    <div onclick="mudaOContato(this)" class="dadosAside">
                        <ion-icon class="iconeParticipantes" name="person-circle"></ion-icon>
                        <p>${conteudo.data[i].name}</p>
                        <ion-icon class="escolhido" name="checkmark-sharp"></ion-icon>
                    </div>
                </li>`;
            }else{
                conteudoDosContatos.innerHTML = conteudoDosContatos.innerHTML + 
                 `
                <li class="participantes">
                    <div onclick="mudaOContato(this)" class="dadosAside">
                        <ion-icon class="iconeParticipantes" name="person-circle"></ion-icon>
                        <p>${conteudo.data[i].name}</p>
                        <ion-icon class="escolhido clicado" name="checkmark-sharp"></ion-icon>
                    </div>
                </li>`;
            }
        
        } 
        vaiAtualizarOsContatos=conteudo.data;
    }
}



// Enviando as mensagens
function enviaMensagem(){
    let valorDoInput = document.querySelector('input').value;
    console.log(valorDoInput);
    nomeDoUsuario =nomeDoUsuario.replace("{|}",'');
    valorDoInput={
        from: nomeDoUsuario,
        to: "Todos",
        text: valorDoInput,
        type: "message"
    }
    console.log(valorDoInput);
    const mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', valorDoInput);
    mensagemEnviada.then(inicioDasMensagens);
    mensagemEnviada.catch(recarregarAPagina);
    document.querySelector('input').value="";
}
function recarregarAPagina(mensagem){
    window.location.reload(true);
}
//Abrindo barra lateral
const abreAside = () => document.querySelector(".fundo").classList.remove("esconde");

const fechaAside = () => document.querySelector(".fundo").classList.add("esconde");
//Selecionando visibilidade e contatos
function mudaAVisibilidade(elemento){
    const addClasse = document.querySelectorAll('.listaDaVisibilidade .escolhido');
    for(let i = 0;i<addClasse.length;i++){
        addClasse[i].classList.add('clicado');
    }
    elemento.querySelector('.escolhido').classList.remove('clicado');
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
}