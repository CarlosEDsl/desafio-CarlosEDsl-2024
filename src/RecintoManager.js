import { Carnivoros, Herbivoros, Onivoros } from "./AnimaisDATA";

export const Recintos = [   {'bioma':'SAVANA', 'tamanho_total':10, 'animais_existentes':[{'animal':'MACACO', 'total': 3}]}, 
                            {'bioma':'FLORESTA', 'tamanho_total':5, 'animais_existentes':[]}, 
                            {'bioma':'SAVANA E RIO', 'tamanho_total':7, 'animais_existentes':[{'animal':'GAZELA', 'total':1}]}, 
                            {'bioma':'RIO', 'tamanho_total':8, 'animais_existentes':[]},
                            {'bioma':'SAVANA', 'tamanho_total':9, 'animais_existentes':[{'animal':'LEAO', 'total':1}]}
                        ];

export function encontrarRecinto(animalRecebido, quantidade) {
    const animal = [Carnivoros, Herbivoros, Onivoros].flat().find(animal => animal.espécie === animalRecebido.toUpperCase());
    if(!animal)
        return {'erro':'Animal inválido'};
    if(quantidade < 1)
        return {'erro':'Quantidade inválida'};
    const recintosViaveis = [];
    
    for (let i = 0; i < Recintos.length; i++) {
        const recinto = Recintos[i];

        //Verificar se esse lugar se adequa ao animal
        if(!verificarHabitabilidade(recinto, animal)) {
            continue;
        }
    
        // Verificando se os animais cabem no recinto
        if (!verificarCapacidade(recinto, animal, quantidade)) {
            continue;
        }
    
        // Verificar se o animal pode entrar no recinto
        if (!verificarCompatibilidade(recinto, animal)) {
            continue;
        }
    
        //Colocar todos os recintos possíveis em um array
        recintosViaveis.push(gerarResposta(recinto, animal, quantidade));
    }
    if(recintosViaveis.length > 0)
        return {'recintosViaveis':recintosViaveis};
    else{
        return {'erro':"Não há recinto viável"};
    }
}

function verificarCapacidade(recinto, animal, quantidade) {
    let ocupacaoTotal = 0;
    const animaisDoRecinto = recinto.animais_existentes;

    // Verifica se o recinto está vazio
    if (animaisDoRecinto.length === 0) {
        return (animal.tamanho * quantidade <= recinto.tamanho_total);
    }

    if (verificarDiversidade(recinto)) {
        ocupacaoTotal++;
    }

    // Calcula a ocupação total com os animais existentes
    for (const animalExistente of animaisDoRecinto) {

        const tamanhoAnimalExistente = [Carnivoros, Herbivoros, Onivoros].flat()
            .find(a => a.espécie === animalExistente.animal).tamanho;
        
        ocupacaoTotal += animalExistente.total * tamanhoAnimalExistente;
    }

    // Verifica se o novo animal cabe no recinto
    return (ocupacaoTotal + (animal.tamanho * quantidade) <= recinto.tamanho_total);
}



function verificarCompatibilidade(recinto, animal, quantidade) {

    for(let i=0; i < recinto.animais_existentes.length; i++) {
        const carnivoroNoRecinto = Carnivoros.find(carnivoro => carnivoro.espécie === recinto.animais_existentes[i].animal);
    
        if(carnivoroNoRecinto && animal.espécie != carnivoroNoRecinto.espécie) {
                return false;
        }
        const BuscarCarnivoro = Carnivoros.find(carnivoro => carnivoro.espécie === animal.espécie);
        if(BuscarCarnivoro){
            if(recinto.animais_existentes.length > 0)
                return false;
        }
    }
    
    if(animal.espécie === "HIPOPOTAMO") {
        if(recinto != Recintos[3] && recinto.animais_existentes.length > 0) {
            return false;
        }
        return true;
    }
    if(animal.espécie === "MACACO" && quantidade === 0){
        if(recinto.animais_existentes.length <= 0)
            return false;
    }
    return true;
}

function verificarHabitabilidade(recinto, animal) {
    return animal.bioma.includes(Recintos.indexOf(recinto)+1);
}

function gerarResposta(recinto, animal, quantidade) {
    const ocupado = espacoOcupado(recinto, animal, quantidade);
    const espacoLivre = recinto.tamanho_total - ocupado;
    return `Recinto ${Recintos.indexOf(recinto)+1} (espaço livre: ${espacoLivre} total: ${recinto.tamanho_total})`
}

function espacoOcupado(recinto, novoAnimal, quantidade) {
    let tamanhoOcupado = 0;
    tamanhoOcupado += novoAnimal.tamanho * quantidade;
    if(recinto.animais_existentes.length === 0) {
        return tamanhoOcupado;
    }

    const tiposExistentes = new Set(recinto.animais_existentes.map(animal => animal.animal));
    tiposExistentes.add(novoAnimal.espécie);
    if(tiposExistentes.size > 1)
        tamanhoOcupado++;
    
    recinto.animais_existentes.forEach(animal => {
        let animalTamanho = [Carnivoros, Onivoros, Herbivoros].flat().find(a => a.espécie === animal.animal).tamanho;
        tamanhoOcupado += (animal.total * animalTamanho);
    });

    return tamanhoOcupado;
    
}

function verificarDiversidade(recinto, novoAnimale) {
    const tiposExistentes = new Set(recinto.animais_existentes.map(animal => animal.animal));
    tiposExistentes.add(novoAnimale);
    return tiposExistentes.size > 1;
}