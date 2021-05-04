const SparqlClient = require('sparql-http-client')
const db = require('./db')

const endpointUrl = 'http://dbtune.org/jamendo/sparql/'
const query = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ns1: <http://purl.org/ontology/mo/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT * WHERE {
    ?x rdf:type ns1:MusicArtist .
    ?x foaf:name ?name .
    ?x foaf:made ?made .
    ?made ns1:track ?track .
    ?track dc:title ?songName .
}
LIMIT 1`

const client = new SparqlClient({ endpointUrl })

async function start() {
    const stream = await client.query.select(query)

    stream.on('data', row => {
        const model = {
            title: row.name.value,
            artist: row.songName.value,
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
