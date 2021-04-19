const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const db = require('./db')


// connection data to the running GraphDB instance
const GRAPHDB_BASE_URL = 'http://localhost:7200',
    GRAPHDB_REPOSITORY = 'myrepo',
    GRAPHDB_USERNAME = 'admin',
    GRAPHDB_PASSWORD = 'test',
    GRAPHDB = 'http://www.openrdf.org/schema/sesame#nil';

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: 'entest',
        iri: 'http://ont.enapso.com/test#'
    },
    {
        prefix: 'dbo',
        iri: 'http://dbpedia.org/ontology/'
    },
    {
        prefix: 'foaf',
        iri: 'http://xmlns.com/foaf/spec/'
    },
    {
        prefix: 'mo',
        iri: 'http://purl.org/ontology/mo/'
    }
];

let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: GRAPHDB_BASE_URL,
    repository: GRAPHDB_REPOSITORY,
    prefixes: DEFAULT_PREFIXES,
    transform: 'toJSON'
});

graphDBEndpoint.login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
.then((result) => {
    console.log(result);
})
.catch((err) => {
    console.log(err);
});

//selects the songs from graphDB and for each record adds it to sqliteDB
graphDBEndpoint.query(
    `select * from <${GRAPHDB}>
        where {
            ?x foaf:name ?name .
            ?x mo:MusicArtist ?artist .
            ?x mo:genre ?genre .
        }`
)
.then((result) => {
    result.records.forEach(element => {
        const model = {
            title: element.name,
            artist: element.artist,
            genre: element.genre
        }
        db.addSong(model, function(error){
            console.log(error);
        })
    });
})
.catch((err) => {
    console.log(err);
});
