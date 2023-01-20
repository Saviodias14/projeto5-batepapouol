let conteudoDoUl = document.querySelector('ul');

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

inicioDasMensagens();
function inicioDasMensagens(){
    const mensagensPromise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    mensagensPromise.then(exibeMensagens);
}
setInterval(inicioDasMensagens,3000);


function exibeMensagens(conteudo){
    conteudoDoUl.innerHTML = '';
    for(let i = 0; i<conteudo.data.length;i++){
        if(conteudo.data[i].type==="status"){
            conteudoDoUl.innerHTML =conteudoDoUl.innerHTML + 
             `<li class="mensagem entrouSaiu">
                 <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>entra na sala...</div>
             </li>`;
    
        }
        else if(conteudo.data[i].type==="message"){
            conteudoDoUl.innerHTML =conteudoDoUl.innerHTML + 
             `<li class="mensagem">
                 <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>para <span>${conteudo.data[i].to}:</span> ${conteudo.data[i].text}</div>
             </li>`;
        }
        else if((conteudo.data[i].type==='private_message')&&(conteudo.data[i].to === nomeDoUsuario)){
            conteudoDoUl.innerHTML =conteudoDoUl.innerHTML +
             `<li class="mensagem reservado">
                 <div><span class="hora">(${conteudo.data[i].time})  </span>  <span>${conteudo.data[i].from} </span>para <span>${conteudo.data[i].to}:</span> ${conteudo.data[i].text}</div>
             </li>`;
        }
    }
    document.querySelector('li:last-child').scrollIntoView();
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