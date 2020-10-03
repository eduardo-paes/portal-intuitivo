import api from "../api";

// Retorna data contagem em ms da data atual
const currentDay = () => {
    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let today = new Date(year, month, day);
    return today.valueOf();
}

// Calcula o número de semanas existente entre o início do ano letivo e a data atual
export async function currentWeek() {
    // Contagem em ms da data de início do ano letivo
    const response = await api.listarAnoLetivo();
    const value = response.data.data;
    const firstDay = value[0].contagem;
    
    // Contagem em ms da data atual
    let today = currentDay();

    // Número total de semana entre os intervalos (hoje e início do ano letivo)
    let weeks = Math.trunc(((((today - firstDay)/1000)/3600)/24)/7);
    return weeks + 1;
}

export function getTheWeek() {
    let today = currentDay();
    let firstday = new Date(2020, 8, 16, 0, 0, 0, 0);
    let week = Math.trunc(((((today - firstday.valueOf())/1000)/3600)/24)/7);
    return week+1;
}

export const diaDaSemana = [ "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado" ]
