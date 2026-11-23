
export function getCalendarDays(date) {
  const year = date.getFullYear()
  const month = date.getMonth()

  // Día de la semana en que comienza el mes.
  // JavaScript: domingo = 0, lunes = 1, ..., sábado = 6.
  const firstDayOfMonth = new Date(year, month, 1)

  // const mondayOffset = (firstDayOfMonth.getDay() + 6) % 7 //SI QUISIERA QUE COMIENCE CON EL LUNES
  const sundayOffset = firstDayOfMonth.getDay()

  // Cantidad de días del mes actual.
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Calculamos cuántas celdas necesita la cuadrícula.
  const totalCells =
    Math.ceil((sundayOffset + daysInMonth) / 7) * 7

  // Generamos todas las fechas de la cuadrícula.
  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - sundayOffset + 1
    const currentDate = new Date(year, month, dayNumber)

    return {
      date: currentDate,
      isCurrentMonth: currentDate.getMonth() === month,
    }
  })
}
