import execPowerShell from "./powershell.js";
import rl from "readline";

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

let services = [];


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

	while (continua) {

		const menuSelectedOption = await perguntar(`O que deseja?\n${optionsString}\n`) - 1;
		console.log(`Opção selecionada: ${menuSelectedOption}`);

		switch (menuSelectedOption) {
			case CADASTRAR_NOVO_SERVICO:

				const server = await perguntar(`Qual o IP ou nome do servidor?\n`);
				const service = await perguntar(`Qual o nome do serviço?\n`);

				if (server && service) {
					services.push({
						server,
						service
					})
				}

				console.log(`Serviço cadastrado com sucesso!\n\n`);
				break;

			case REINICIAR_SERVICO:
				
			const serviceToReset = await perguntar(`Qual o nome do serviço?\n`);


				if (serviceToReset) {
					
					const indexReset = services.findIndex( item => item.service === serviceToReset);
					console.log(`reseting service: ${services[indexReset].server} | ${services[indexReset].service}...`);

					const command = `get-service -ComputerName ${services[indexReset].server} -Name ${services[indexReset].service} | Restart-service`
					execPowerShell(command)
					
				}

				break;

			case LISTAR_SERVICOS:

				console.log(`Serviços cadastrados:\n`);
				services.forEach(serviceToShow => {
					console.log(`${serviceToShow.server} | ${serviceToShow.service}`);
				})
				console.log(`\n\n`);
				break;

			case EXCLUIR_SERVICO:

				const serviceToDelete = await perguntar(`Qual o nome do serviço que quer excluir?\n`);

				if (serviceToDelete) {

					services = services.filter(item => item.service !== serviceToDelete)
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
