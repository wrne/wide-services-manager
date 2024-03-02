import { servicesCollections } from "./db-connect.js";

let servicesList;

async function insertService({ service, server }) {

	const atualizacao = await servicesCollections.insertOne({
		server,
		service
	})

	return atualizacao.acknowledged;

};

async function listAllServices() {
	
	const listServices = await servicesCollections.find().toArray();
	return listServices;
	
}

async function deleteService(serviceName) {
	const deletedService = await servicesCollections.deleteOne({ service: serviceName })
	console.log(deletedService);

	if (deletedService && deletedService.acknowledged) {
		return true;
	}
	return false;
}
export { servicesList, insertService, listAllServices, deleteService };