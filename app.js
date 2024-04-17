import execPowerShell from "./powershell.js";
import rl from "readline";

import { deleteService, insertService, listAllServices, servicesList } from "./db-services.js";

// const rl = require("readline");

const readline = rl.createInterface({
	input: process.stdin,
	output: process.stdout
});

const CADASTRAR_NOVO_SERVICO = 0;
const REINICIAR_SERVICO = 1;
const LISTAR_SERVICOS = 2;
const EXCLUIR_SERVICO = 3;
const SAIR = 99;

const options = [
	'1. Cadastrar novo serviço',
	'2. Iniciar/ Reiniciar um serviço',
	'3. Listar os serviços disponíveis',
	'4. Excluir um serviço'
];


function listarArray(array) {

	let stringReturn = '';
	array.forEach(item => {
		stringReturn += item + `\n`;
	});
	return stringReturn;
}
let optionsString = listarArray(options);


const perguntar = (pergunta) => {
	return new Promise((resolve) => {
		readline.question(pergunta, resolve);
	});
};

const main = async () => {
	let continua = true;

	// Carrega a lista de serviços
	await listAllServices();

	while (continua) {

		const menuSelectedOption = await perguntar(`O que deseja?\n${optionsString}\n`) - 1;
		console.log(`Opção selecionada: ${menuSelectedOption+1}`);

		switch (menuSelectedOption) {
			case CADASTRAR_NOVO_SERVICO:

				const server = await perguntar(`Qual o IP ou nome do servidor?\n`);
				const service = await perguntar(`Qual o nome do serviço?\n`);

				if (server && service) {
					if (await insertService({
						server,
						service
					})) {
						console.log(`Serviço cadastrado com sucesso!\n\n`);
					}
					else {
						console.log(`Falha ao criar o serviço!\n\n`);
					}
				}

				break;

			case REINICIAR_SERVICO:

				console.log(`\nEscolha o número do serviço que deseja reiniciar:\n`);

				const listaToReset = await listAllServices();
				listaToReset.forEach((serviceToShow, index) => {
					console.log(`${index+1} | ${serviceToShow.server} | ${serviceToShow.service}`);
				})
				console.log(`\n`);

				const serviceToReset = await perguntar(`Qual o número do serviço para reiniciar?\n`)-1;


				if (serviceToReset) {

					// const indexReset = services.findIndex(item => item.service === serviceToReset);
					// const indexReset = servicesList.findIndex(item => item.service === serviceToReset);

					console.log(`reseting service: ${servicesList[serviceToReset].server} | ${servicesList[serviceToReset].service}...`);

					const command = `get-service -ComputerName ${servicesList[serviceToReset].server} -Name ${servicesList[serviceToReset].service} | Restart-service`
					await execPowerShell(command)

				}

				break;

			case LISTAR_SERVICOS:

				console.log(`Serviços cadastrados:\n`);
				// services.forEach(serviceToShow => {
				// 	console.log(`${serviceToShow.server} | ${serviceToShow.service}`);
				// })
				// console.log(`\n\n`);

				const lista = await listAllServices();
				lista.forEach(serviceToShow => {
					console.log(`${serviceToShow.server} | ${serviceToShow.service}`);
				})
				console.log(`\n\n`);
				break;

			case EXCLUIR_SERVICO:

				const serviceToDelete = await perguntar(`Qual o nome do serviço que quer excluir?\n`);

				if (serviceToDelete) {

					// services = services.filter(item => item.service !== serviceToDelete)

					if (await deleteService(serviceToDelete))
						console.log(`Serviço excluído com sucesso!\n\n`);
					break;
				}

				break;

			default:
				console.log("Opção inválida");
				continua = false;
				break;
		}


	};
	readline.close();
};

main();
