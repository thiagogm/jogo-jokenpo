document.addEventListener("DOMContentLoaded", function () {
    // Prevenção absoluta de rolagem
    (function() {
        // Impedir qualquer tipo de rolagem
        function preventScroll(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Eventos de rolagem
        document.addEventListener('scroll', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('mousewheel', preventScroll, { passive: false });
        document.addEventListener('DOMMouseScroll', preventScroll, { passive: false });
        
        // Aplicar a todos os elementos
        document.querySelectorAll('*').forEach(function(el) {
            el.addEventListener('touchmove', preventScroll, { passive: false });
            el.addEventListener('wheel', preventScroll, { passive: false });
            el.addEventListener('mousewheel', preventScroll, { passive: false });
            el.addEventListener('DOMMouseScroll', preventScroll, { passive: false });
        });
        
        // Forçar a página a ficar no topo
        function forceTop() {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        
        window.addEventListener('scroll', forceTop);
        setInterval(forceTop, 100); // Verificar a cada 100ms
        
        // Desabilitar eventos de teclado que podem causar rolagem
        document.addEventListener('keydown', function(e) {
            if ([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
                return false;
            }
        }, { passive: false });
        
        // Aplicar estilos inline para garantir que não haja rolagem
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';
    })();

    const opcoes = ["Pedra", "Papel", "Tesoura"];
    const resultadoDiv = document.getElementById("resultado");
    const jogarNovamenteBtn = document.getElementById("jogarNovamente");
    const opcaoDivs = document.querySelectorAll(".opcao");
    const nivelDificuldade = document.getElementById("nivel-dificuldade");
    const botoesAcao = document.querySelector(".botoes-acao");
    
    // Elementos do placar
    const placarUsuario = document.getElementById("placar-usuario");
    const placarEmpates = document.getElementById("placar-empates");
    const placarComputador = document.getElementById("placar-computador");
    const resetarPlacarBtn = document.getElementById("resetarPlacar");
    
    // Inicializar placar do localStorage ou começar do zero
    let placar = {
        usuario: parseInt(localStorage.getItem("placar-usuario")) || 0,
        empates: parseInt(localStorage.getItem("placar-empates")) || 0,
        computador: parseInt(localStorage.getItem("placar-computador")) || 0
    };
    
    // Inicializar a área de resultado com espaço em branco para manter o layout consistente
    resultadoDiv.innerHTML = '<span class="linha1" style="color: #333 !important;">&nbsp;</span><span class="linha2" style="color: #333 !important;">&nbsp;</span>';
    
    // Posicionar o botão jogar novamente no centro da área de botões
    jogarNovamenteBtn.style.top = "0";
    jogarNovamenteBtn.style.left = "50%";
    jogarNovamenteBtn.style.transform = "translateX(-50%)";
    
    // Garantir que todos os textos tenham cores adequadas
    document.querySelectorAll('p, h1, h2, h3, span, div').forEach(el => {
        if (!el.classList.contains('linha2') && 
            !el.closest('button') && 
            !el.closest('.opcao.selecionado::after')) {
            el.style.color = '#333';
        }
    });
    
    document.querySelectorAll('button').forEach(el => {
        el.style.color = '#fff';
    });
    
    // Atualizar placar na interface
    atualizarPlacar();
    
    function atualizarPlacar() {
        placarUsuario.textContent = placar.usuario;
        placarEmpates.textContent = placar.empates;
        placarComputador.textContent = placar.computador;
        
        // Destacar visualmente o placar
        if (placar.usuario > placar.computador) {
            placarUsuario.style.color = "#4CAF50"; // Verde para indicar vitória
            placarComputador.style.color = "#f44336"; // Vermelho para indicar derrota
        } else if (placar.computador > placar.usuario) {
            placarUsuario.style.color = "#f44336"; // Vermelho para indicar derrota
            placarComputador.style.color = "#4CAF50"; // Verde para indicar vitória
        } else {
            placarUsuario.style.color = "#333"; // Cor padrão para empate
            placarComputador.style.color = "#333"; // Cor padrão para empate
        }
        
        // Salvar no localStorage
        localStorage.setItem("placar-usuario", placar.usuario);
        localStorage.setItem("placar-empates", placar.empates);
        localStorage.setItem("placar-computador", placar.computador);
        
        // Forçar a página a ficar no topo após atualizar o placar
        window.scrollTo(0, 0);
    }
    
    function resetarPlacar() {
        placar = {
            usuario: 0,
            empates: 0,
            computador: 0
        };
        atualizarPlacar();
        
        // Forçar a página a ficar no topo após resetar o placar
        window.scrollTo(0, 0);
    }
    
    // Lógica para diferentes níveis de dificuldade
    function escolhaComputadorInteligente(escolhaUsuario, nivel) {
        // No nível fácil, o computador escolhe aleatoriamente (33% de chance para cada opção)
        if (nivel === "facil") {
            return Math.floor(Math.random() * 3);
        }
        
        // No nível médio, o computador tem uma pequena vantagem (50% aleatório, 50% inteligente)
        else if (nivel === "medio") {
            if (Math.random() < 0.5) {
                return Math.floor(Math.random() * 3);
            } else {
                // Escolha que vence a do usuário
                return (escolhaUsuario + 1) % 3;
            }
        }
        
        // No nível difícil, o computador é mais inteligente (70% inteligente, 30% aleatório)
        else if (nivel === "dificil") {
            if (Math.random() < 0.3) {
                return Math.floor(Math.random() * 3);
            } else {
                // Escolha que vence a do usuário
                return (escolhaUsuario + 1) % 3;
            }
        }
        
        // Fallback para escolha aleatória
        return Math.floor(Math.random() * 3);
    }

    function jogar(escolhaUsuario) {
        // Prevenir qualquer comportamento de rolagem durante a jogada
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        
        const nivel = nivelDificuldade.value;
        const escolhaComputador = escolhaComputadorInteligente(escolhaUsuario, nivel);
        let mensagem = "";
        let corMensagem = "";

        if (escolhaUsuario === escolhaComputador) {
            mensagem = "Empate!";
            corMensagem = "#FF9800"; // Laranja para empate
            placar.empates++;
        } else if (
            (escolhaUsuario === 0 && escolhaComputador === 2) ||
            (escolhaUsuario === 1 && escolhaComputador === 0) ||
            (escolhaUsuario === 2 && escolhaComputador === 1)
        ) {
            mensagem = "Você venceu!";
            corMensagem = "#4CAF50"; // Verde para vitória
            placar.usuario++;
        } else {
            mensagem = "Você perdeu!";
            corMensagem = "#f44336"; // Vermelho para derrota
            placar.computador++;
        }
        
        // Atualizar placar
        atualizarPlacar();

        // Usar um formato consistente para o resultado com texto mais curto e cores forçadas
        resultadoDiv.innerHTML = `
            <span class="linha1" style="color: #333 !important;">Você: ${opcoes[escolhaUsuario]} vs PC: ${opcoes[escolhaComputador]}</span>
            <span class="linha2" style="color: ${corMensagem} !important;">${mensagem}</span>
        `;

        // Destacar a opção selecionada sem alterar o tamanho
        opcaoDivs.forEach((el, index) => {
            el.classList.remove("selecionado");
            if (index === escolhaUsuario) {
                el.classList.add("selecionado");
            }
        });

        // Mostrar o botão sem alterar o layout
        jogarNovamenteBtn.style.display = "block";
        
        // Forçar um reflow para garantir que não haja rolagem
        setTimeout(function() {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }, 10);
    }

    function resetarJogo() {
        // Manter um espaço reservado para preservar o layout
        resultadoDiv.innerHTML = '<span class="linha1" style="color: #333 !important;">&nbsp;</span><span class="linha2" style="color: #333 !important;">&nbsp;</span>';
        opcaoDivs.forEach(el => el.classList.remove("selecionado"));
        jogarNovamenteBtn.style.display = "none";
        
        // Forçar um reflow para garantir que não haja rolagem
        setTimeout(function() {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }, 10);
    }

    jogarNovamenteBtn.addEventListener("click", function(e) {
        e.preventDefault();
        resetarJogo();
        window.scrollTo(0, 0);
    });
    
    resetarPlacarBtn.addEventListener("click", function(e) {
        e.preventDefault();
        resetarPlacar();
        window.scrollTo(0, 0);
    });

    opcaoDivs.forEach((el, index) => {
        // Garantir que o texto do botão seja branco
        el.querySelector("button").style.color = "#fff";
        
        // Adicionar efeito de hover para melhorar feedback visual
        el.addEventListener("mouseenter", function() {
            if (!el.classList.contains("selecionado")) {
                el.style.transform = "translateY(5px)";
            }
        });
        
        el.addEventListener("mouseleave", function() {
            if (!el.classList.contains("selecionado")) {
                el.style.transform = "translateY(0)";
            }
        });
        
        el.querySelector("button").addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            jogar(index);
            window.scrollTo(0, 0);
        });
        
        el.querySelector("img").addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            jogar(index);
            window.scrollTo(0, 0);
        });
        
        // Adicionar evento de toque para melhor resposta em dispositivos móveis
        el.addEventListener("touchstart", function(e) {
            e.preventDefault();
            jogar(index);
            window.scrollTo(0, 0);
        }, { passive: false });
    });
    
    // Inicializar o jogo com layout consistente
    resetarJogo();
    
    // Desabilitar comportamentos padrão que podem causar rolagem
    document.querySelectorAll('button, select, img').forEach(function(el) {
        el.addEventListener('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        
        el.addEventListener('click', function(e) {
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 10);
        });
    });
    
    // Forçar cores corretas em todos os elementos
    setInterval(function() {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.style.color !== 'rgb(255, 255, 255)' && 
                btn.style.color !== '#fff' && 
                btn.style.color !== '#ffffff') {
                btn.style.color = '#fff';
            }
        });
        
        // Forçar a página a ficar no topo
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }, 100);
});
