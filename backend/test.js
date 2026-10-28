
const url = 'http://localhost:3000/api/appointments';

const fecha = '2026-10-29T16:00:00';

console.log('Texto original:', fecha);
console.log('Objeto Date:', new Date(fecha).toISOString());
console.log('Hora local:', new Date(fecha).toLocaleString('es-BR', {
  timeZone: 'America/Cuiaba'
}));