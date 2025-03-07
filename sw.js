const CACHE_NAME = "jokenpo-pwa-v5"; // Updated version number
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./app.html", // Novo arquivo principal
    "./style.css",
    "./script.js",
    "./img/pedra.png",
    "./img/papel.png",
    "./img/tesoura.png",
    "./manifest.json",
    "./offline.html",
    // Adicionar todos os ícones
    "./img/48x48.png",
    "./img/72x72.png",
    "./img/96x96.png",
    "./img/144x144.png",
    "./img/192x192.png",
    "./img/384x384.png",
    "./img/512x512.png"
];

// Instalação do Service Worker e cache dos arquivos essenciais
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Cache criado com sucesso!");
                return cache.addAll(FILES_TO_CACHE);
            })
            .catch((error) => console.error("Erro ao adicionar arquivos ao cache:", error))
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Ativação do Service Worker e remoção de caches antigos
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("Removendo cache antigo:", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    // Claim any clients immediately
    event.waitUntil(self.clients.claim());
});

// Interceptação de requisições para funcionamento offline
self.addEventListener("fetch", (event) => {
    // Estratégia Cache First, Network Fallback
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Se encontrou no cache, retorna o cache
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Se não encontrou no cache, busca na rede
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Se a resposta da rede for válida, clona e armazena no cache
                        if (networkResponse && networkResponse.status === 200) {
                            const clonedResponse = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, clonedResponse);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Se falhar na rede e for uma navegação, retorna a página offline
                        if (event.request.mode === "navigate") {
                            return caches.match("./offline.html");
                        }
                        // Para outros recursos, retorna uma resposta vazia
                        return new Response(null, { status: 404 });
                    });
            })
    );
});
