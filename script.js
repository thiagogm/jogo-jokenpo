document.addEventListener("DOMContentLoaded", function () {
    const opcoes = ["Pedra", "Papel", "Tesoura"];
    const resultadoDiv = document.getElementById("resultado");
    const jogarNovamenteBtn = document.getElementById("jogarNovamente");
    const opcaoDivs = document.querySelectorAll(".opcao");

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

        opcaoDivs.forEach((el, index) => {
            el.classList.remove("selecionado");
            if (index === escolhaUsuario) {
                el.classList.add("selecionado");
            }
        });

        jogarNovamenteBtn.style.display = "block";
    }

    function resetarJogo() {
        resultadoDiv.innerHTML = "";
        opcaoDivs.forEach(el => el.classList.remove("selecionado"));
        jogarNovamenteBtn.style.display = "none";
    }

    jogarNovamenteBtn.addEventListener("click", resetarJogo);

    opcaoDivs.forEach((el, index) => {
        el.addEventListener("click", () => jogar(index));
    });
});
