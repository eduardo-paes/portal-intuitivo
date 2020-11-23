const AnoLetivoCtrl = require("../controllers/schoolYear-ctrl");
const AnoLetivo = require('../models/schoolYear-model');

// Retorna data contagem em ms da data atual
const currentDay = () => {
    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let today = new Date(year, month, day);
    return today.valueOf();
}

// Calcula o número de semanas existente entre o início do ano letivo e a data atual
async function currentWeek() {
    // Contagem em ms da data de início do ano letivo
    return await AnoLetivo
        .find()
        .limit(1)
        .exec(function (err, listaAnoLetivo) {
            console.log(listaAnoLetivo);
        // Verificação de erros
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // Verifica se há dados na lista
        if (!listaAnoLetivo.length) {
            return res
                .status(404)
                .json({ success: false, error: "Dados não encontrados." })
        }
        // Caso não haja erros, retorna ano letivo
        
        const firstDay = listaAnoLetivo[0].contagem;
        
        // Contagem em ms da data atual
        let today = currentDay();
        
        // Número total de semana entre os intervalos (hoje e início do ano letivo)
        let weeks = Math.trunc(((((today - firstDay)/1000)/3600)/24)/7);
        console.log(weeks+1)
        return weeks + 1;
    })
}

function getTheWeek() {
    let today = currentDay();
    let firstday = new Date(2020, 8, 16, 0, 0, 0, 0);
    let week = Math.trunc(((((today - firstday.valueOf())/1000)/3600)/24)/7);
    return week+1;
}

const diaDaSemana = [ "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado" ]

module.exports = {
    currentWeek,
    getTheWeek,
    diaDaSemana
}