// const { exec } = require('child_process');
import {exec} from 'child_process'

// Comando do PowerShell que você deseja executar,exemplo:
// const comandoPowerShell = 'Get-Process';


export  default function execPowerShell(comandoPowerShell){

	// Executando o comando do PowerShell
	exec(`powershell.exe -Command "${comandoPowerShell}"`, (erro, stdout, stderr) => {
	  if (erro) {
		console.error(`Erro ao executar o comando: ${erro.message}`);
		return;
	  }
	
	  if (stderr) {
		console.error(`Erro do PowerShell: ${stderr}`);
		return;
	  }
	
	  // Saída padrão do PowerShell
	  console.log(`Saída do PowerShell:\n${stdout}\n\n`);
	  return;

	});

}

