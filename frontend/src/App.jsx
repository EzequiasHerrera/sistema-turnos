import { getCalendarDays } from './utils/calendarUtils'
function App() {
  const calendarDays = getCalendarDays(new Date(2026, 9, 1))

  console.log(
    calendarDays.map(({ date, isCurrentMonth }) => ({
      day: date.getDate(),
      month: date.getMonth() + 1,
      isCurrentMonth,
    })),
  )
  return (
    <main className="app">
      <nav className="main-navigation" aria-label="Navegación principal">
        <button
          type="button"
          className="nav-button is-active"
          aria-current="page"
        >
          Calendario
        </button>

        <button type="button" className="nav-button">
          Clientes
        </button>
      </nav>

      <section className="calendar-panel" aria-label="Calendario mensual">
        <header className="calendar-header">
          <h1>Octubre 2026</h1>
        </header>

        <div className="calendar-placeholder">
          <p>Acá construiremos el calendario</p>
        </div>
      </section>

      <div className="calendar-actions">
        <button
          type="button"
          className="add-appointment"
          aria-label="Agregar turno"
        >
          +
        </button>
      </div>

      <button type="button" className="today-handle">
        <span className="handle-indicator" aria-hidden="true" />
        <span>Hoy</span>
      </button>
    </main>
  )
}

export default App;