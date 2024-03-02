import { MongoClient } from "mongodb";

const user = process.env.USER_MONGODB || 'root'
const pwd = process.env.PWD_MONGODB || '123'
const cliente = new MongoClient(`mongodb://${user}:${pwd}@localhost:27017/admin`)

let servicesCollections;

try{
	
	await cliente.connect();
	const db = cliente.db("service-manager");
	servicesCollections = db.collection("services");

	console.log("Conectado ao mongoDB");

} catch(erro){
	console.log(erro);
}

export{ servicesCollections }