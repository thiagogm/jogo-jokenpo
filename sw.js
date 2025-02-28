const CACHE_NAME = "jokenpo-pwa-v3"; // Updated version number!
const FILES_TO_CACHE = [
    "/jogo-jokenpo/index.html",
    "/jogo-jokenpo/style.css",
    "/jogo-jokenpo/script.js",
    "/jogo-jokenpo/img/pedra.png",
    "/jogo-jokenpo/img/papel.png",
    "/jogo-jokenpo/img/tesoura.png",
    "/jogo-jokenpo/img/background.jpg",
    "/jogo-jokenpo/manifest.json",
    "/jogo-jokenpo/offline.html" // Add the offline page
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
});

// Interceptação de requisições para funcionamento offline
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            //Network-First: We try to fetch the resource, if it's possible
            const clonedResponse = response.clone();

            caches.open(CACHE_NAME)
            .then((cache) => {
                //We cache the response for later usage
                cache.put(event.request, clonedResponse);
            })

            return response;

        }).catch((err) => {
            return caches.match(event.request)
            .then((response) => {
              
                // Retorna o cache se existir, senão tenta buscar na rede
                if (response){
                    return response;
                }

                // Responde com uma página offline genérica se a rede falhar
                if (event.request.mode === "navigate") {
                    return caches.match("/offline.html");
                }
                
            })
        })
    );
});
