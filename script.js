document.addEventListener("DOMContentLoaded", function () {
    const opcoes = ["Pedra", "Papel", "Tesoura"];
    const resultadoDiv = document.getElementById("resultado");
    const jogarNovamenteBtn = document.getElementById("jogarNovamente");

    function jogar(escolhaUsuario) {
        const escolhaComputador = Math.floor(Math.random() * 3);
        let mensagem = "";

        if (escolhaUsuario === escolhaComputador) {
            mensagem = "Empate! 🟰";
        } else if (
            (escolhaUsuario === 0 && escolhaComputador === 2) || 
            (escolhaUsuario === 1 && escolhaComputador === 0) || 
            (escolhaUsuario === 2 && escolhaComputador === 1)
        ) {
            mensagem = "🎉 Você venceu!";
        } else {
            mensagem = "😢 Você perdeu!";
        }

        resultadoDiv.innerHTML = `
            <span class="linha1"><strong>Você:</strong> ${opcoes[escolhaUsuario]} 🆚 <strong>Computador:</strong> ${opcoes[escolhaComputador]}</span>
            <span class="linha2">${mensagem}</span>
        `;

        document.querySelectorAll(".opcao").forEach((el, index) => {
            el.classList.remove("selecionado");
            if (index === escolhaUsuario) {
                el.classList.add("selecionado");
            }
        });

        jogarNovamenteBtn.classList.add("ativo");
        jogarNovamenteBtn.style.display = "block"; 
    }

    function resetarJogo() {
        resultadoDiv.innerHTML = ""; // Agora não adiciona "Escolha uma opção:" de novo
        document.querySelectorAll(".opcao").forEach(el => el.classList.remove("selecionado"));

        jogarNovamenteBtn.classList.remove("ativo");
        jogarNovamenteBtn.style.display = "none"; 
    }

    jogarNovamenteBtn.addEventListener("click", resetarJogo);

    document.querySelectorAll(".opcao").forEach((el, index) => {
        el.addEventListener("click", () => jogar(index));
    });
});
