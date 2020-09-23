export function getTheWeek() {

    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
  
    let today = new Date(year, month, day);
    let firstday = new Date(2020, 8, 16, 0, 0, 0, 0);
    let week = Math.trunc(((((today.valueOf() - firstday.valueOf())/1000)/3600)/24)/7);
  
    return week+1;
}

export const diaDaSemana = [ "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado" ]
