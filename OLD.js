const SparqlClient = require('sparql-http-client')
const db = require('./db')

const endpointUrl = 'http://dbtune.org/musicbrainz/sparql'
const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX mo: <http://purl.org/ontology/mo/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>

    SELECT * WHERE {
        ?x rdf:type mo:MusicArtist ; 
            foaf:name "Akon" ;
            rdfs:label ?artist . 
        ?y rdf:type mo:Track ; 
            foaf:maker <http://dbtune.org/musicbrainz/resource/artist/9fff2f8a-21e6-47de-a2b8-7f449929d43f> ;
            dc:title ?songName .
    }
    LIMIT 10
`

const client = new SparqlClient({ endpointUrl })

async function start() {
    const stream = await client.query.select(query)

    stream.on('data', row => {
        const model = {
            title: row.songName.value,
            artist: row.artist.value,
            genre: 'Pop'
        }
        db.addSong(model, function(error){
            console.log(error);
        })
    })

    stream.on('error', err => {
        console.error(err)
    }) 
}
start()
