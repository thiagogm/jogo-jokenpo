// Verifica se o navegador suporta Service Workers
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker registrado com sucesso!"))
        .catch(err => console.log("Erro ao registrar o Service Worker:", err));
}
