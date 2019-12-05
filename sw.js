/*
imports
*/
importScripts('js/sw-utils.js');

const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/'
    , 'index.html'
    , 'css/style.css'
    , 'img/favicon.ico'
    , 'img/avatars/hulk.jpg'
    , 'img/avatars/ironman.jpg'
    , 'img/avatars/spiderman.jpg'
    , 'img/avatars/thor.jpg'
    , 'img/avatars/wolverine.jpg'
    , 'js/app.js'
    , 'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400'
    , 'https://fonts.googleapis.com/css?family=Lato:400,300'
    , 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
    , 'css/animate.css'
    , 'js/libs/jquery.js'
];

/*
descargamos y guardamos los recursos del APP_SHELL
en la etapa de instalación del SW
*/
self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL))
    
        const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE))
    
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})

/*
borramos cachés estáticos que pueden ya no estar vigentes
en el evento de activación del SW
*/
self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil( respuesta );
});


self.addEventListener('fetch', e => {
    
    const respuesta = caches.match(e.request)
        .then(res => {
            
            if (res) {
                return res;
            } else {
                
                return fetch(e.request)
                    .then(newRes => {

                        return actualizaCache( DYNAMIC_CACHE, e.request, newRes);
                    })
            }
        });
    e.respondWith(respuesta);
})