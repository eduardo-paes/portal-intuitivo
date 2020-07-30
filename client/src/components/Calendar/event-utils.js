let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
let date = new Date("2020-07-22").toISOString().replace(/T.*$/, '')

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Evento de Dia inteiro',
    start: date + 'T10:00:00'
  },
  {
    id: createEventId(),
    title: 'Evento com Hora marcada',
    start: todayStr + 'T12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}