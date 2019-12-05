/*
función utilería para guardar en un caché
*/
const actualizaCache = ( nombreCache, request, response ) => {
    if (response.ok) {

        return caches.open(nombreCache)
        .then(cache => {

            cache.put( request, response.clone() );
            
            return response.clone();
        });
        
    } else {
        return response;
    }
}