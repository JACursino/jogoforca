const palavras = [
    { palavra: "JAVASCRIPT", dica: "Linguagem de programação da web" },
    { palavra: "PYTHON", dica: "Linguagem de programação com nome de cobra" },
    { palavra: "ELEFANTE", dica: "Maior animal terrestre" },
    { palavra: "COMPUTADOR", dica: "Máquina eletrônica para processar dados" },
    { palavra: "CHOCOLATE", dica: "Doce feito de cacau" },
    { palavra: "FUTEBOL", dica: "Esporte mais popular do Brasil" },
    { palavra: "VIOLAO", dica: "Instrumento musical de cordas" },
    { palavra: "PIZZA", dica: "Comida italiana redonda" },
    { palavra: "BRASIL", dica: "Maior país da América do Sul" },
    { palavra: "CELULAR", dica: "Dispositivo móvel de comunicação" }
];

let palavraEscolhida = {};
let palavraOculta = [];
let erros = 0;
let acertos = 0;
let jogoAtivo = true;
let letrasTentadas = [];

function iniciarJogo() {
    // Escolher palavra aleatória
    palavraEscolhida = palavras[Math.floor(Math.random() * palavras.length)];
    palavraOculta = Array(palavraEscolhida.palavra.length).fill('_');
    erros = 0;
    acertos = 0;
    jogoAtivo = true;
    letrasTentadas = [];

    // Atualizar interface
    document.getElementById('dica-texto').textContent = palavraEscolhida.dica;
    document.getElementById('input-letra').value = '';
    document.getElementById('input-letra').disabled = false;
    document.getElementById('btn-tentar').disabled = false;
    document.getElementById('input-palavra').value = '';
    document.getElementById('input-palavra').disabled = false;
    document.getElementById('btn-chutar').disabled = false;
    document.getElementById('lista-letras').textContent = '-';
    
    atualizarPalavra();
    atualizarImagem();
    atualizarInfo();
    criarTeclado();
    document.getElementById('mensagem').textContent = '';
    document.getElementById('mensagem').className = 'mensagem';
    
    // Focar no input de letra
    document.getElementById('input-letra').focus();
}

function criarTeclado() {
    const teclado = document.getElementById('teclado');
    teclado.innerHTML = '';
    
    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let letra of alfabeto) {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.className = 'letra';
        btn.onclick = () => tentarLetra(letra, btn);
        teclado.appendChild(btn);
    }
}

function tentarLetraInput() {
    if (!jogoAtivo) return;

    const input = document.getElementById('input-letra');
    const letra = input.value.toUpperCase().trim();

    // Validações
    if (letra === '') {
        alert('Por favor, digite uma letra!');
        return;
    }

    if (letra.length !== 1) {
        alert('Digite apenas UMA letra!');
        input.value = '';
        return;
    }

    if (!/[A-Z]/.test(letra)) {
        alert('Digite apenas letras de A a Z!');
        input.value = '';
        return;
    }

    if (letrasTentadas.includes(letra)) {
        alert('Você já tentou essa letra! Tente outra.');
        input.value = '';
        return;
    }

    // Processar a letra
    processarLetra(letra);
    
    // Desabilitar o botão correspondente no teclado virtual
    const botoes = document.querySelectorAll('.letra');
    botoes.forEach(btn => {
        if (btn.textContent === letra) {
            btn.disabled = true;
        }
    });

    input.value = '';
    input.focus();
}

function tentarLetra(letra, botao) {
    if (!jogoAtivo) return;
    
    if (letrasTentadas.includes(letra)) {
        return;
    }

    botao.disabled = true;
    processarLetra(letra);
}

function processarLetra(letra) {
    // Adicionar letra às tentadas
    letrasTentadas.push(letra);
    atualizarLetrasTentadas();

    // Verificar se a letra está na palavra
    if (palavraEscolhida.palavra.includes(letra)) {
        // ACERTOU!
        let acertosNessaLetra = 0;
        for (let i = 0; i < palavraEscolhida.palavra.length; i++) {
            if (palavraEscolhida.palavra[i] === letra) {
                palavraOculta[i] = letra;
                acertos++;
                acertosNessaLetra++;
            }
        }
        atualizarPalavra();
        
        // Feedback positivo
        mostrarFeedback(`✅ Muito bem! A letra "${letra}" aparece ${acertosNessaLetra} vez(es)!`, 'acerto');
        
        verificarVitoria();
    } else {
        // ERROU!
        erros++;
        atualizarImagem();
        
        // Feedback negativo
        mostrarFeedback(`❌ A letra "${letra}" não está na palavra!`, 'erro');
        
        verificarDerrota();
    }

    atualizarInfo();
}

function mostrarFeedback(mensagem, tipo) {
    const feedbackDiv = document.getElementById('mensagem');
    feedbackDiv.textContent = mensagem;
    feedbackDiv.className = `mensagem ${tipo === 'acerto' ? 'vitoria' : 'derrota'}`;
    
    // Limpar feedback após 2 segundos (se o jogo ainda estiver ativo)
    if (jogoAtivo) {
        setTimeout(() => {
            if (jogoAtivo) {
                feedbackDiv.textContent = '';
                feedbackDiv.className = 'mensagem';
            }
        }, 2000);
    }
}

function atualizarLetrasTentadas() {
    const lista = letrasTentadas.sort().join(', ');
    document.getElementById('lista-letras').textContent = lista || '-';
}

function chutar() {
    if (!jogoAtivo) return;

    const input = document.getElementById('input-palavra');
    const chute = input.value.toUpperCase().trim();

    if (chute === '') {
        alert('Digite uma palavra antes de chutar!');
        return;
    }

    if (chute === palavraEscolhida.palavra) {
        // ACERTOU a palavra completa!
        palavraOculta = palavraEscolhida.palavra.split('');
        atualizarPalavra();
        jogoAtivo = false;
        const mensagem = document.getElementById('mensagem');
        mensagem.textContent = '🎉 INCRÍVEL! Você acertou a palavra completa: ' + palavraEscolhida.palavra;
        mensagem.className = 'mensagem vitoria';
        desabilitarJogo();
    } else {
        // ERROU - perde o jogo imediatamente!
        erros = 6;
        atualizarImagem();
        palavraOculta = palavraEscolhida.palavra.split('');
        atualizarPalavra();
        jogoAtivo = false;
        const mensagem = document.getElementById('mensagem');
        mensagem.textContent = '😢 Chute errado! A palavra era: ' + palavraEscolhida.palavra;
        mensagem.className = 'mensagem derrota';
        desabilitarJogo();
    }

    atualizarInfo();
}

function desabilitarJogo() {
    document.getElementById('input-letra').disabled = true;
    document.getElementById('btn-tentar').disabled = true;
    document.getElementById('input-palavra').disabled = true;
    document.getElementById('btn-chutar').disabled = true;
    
    // Desabilitar todos os botões do teclado
    const botoes = document.querySelectorAll('.letra');
    botoes.forEach(botao => botao.disabled = true);
}

function atualizarPalavra() {
    document.getElementById('palavra-display').textContent = palavraOculta.join(' ');
}

function atualizarImagem() {
    const img = document.getElementById('imagem-forca');
    img.src = `imagens/forca${erros}.png`;
}

function atualizarInfo() {
    document.getElementById('erros').textContent = erros;
    document.getElementById('acertos').textContent = acertos;
}

function verificarVitoria() {
    if (!palavraOculta.includes('_')) {
        jogoAtivo = false;
        const mensagem = document.getElementById('mensagem');
        mensagem.textContent = '🎉 PARABÉNS! Você completou a palavra: ' + palavraEscolhida.palavra;
        mensagem.className = 'mensagem vitoria';
        desabilitarJogo();
    }
}

function verificarDerrota() {
    if (erros >= 6) {
        jogoAtivo = false;
        palavraOculta = palavraEscolhida.palavra.split('');
        atualizarPalavra();
        const mensagem = document.getElementById('mensagem');
        mensagem.textContent = '😢 Game Over! A palavra era: ' + palavraEscolhida.palavra;
        mensagem.className = 'mensagem derrota';
        desabilitarJogo();
    }
}

function reiniciarJogo() {
    iniciarJogo();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Permitir tentar letra pressionando Enter no input de letra
    const inputLetra = document.getElementById('input-letra');
    inputLetra.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            tentarLetraInput();
        }
    });

    // Forçar apenas uma letra e converter para maiúscula
    inputLetra.addEventListener('input', function(e) {
        this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (this.value.length > 1) {
            this.value = this.value.charAt(0);
        }
    });

    // Permitir chutar pressionando Enter no input de palavra
    const inputPalavra = document.getElementById('input-palavra');
    inputPalavra.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            chutar();
        }
    });

    // Iniciar o jogo
    iniciarJogo();
});