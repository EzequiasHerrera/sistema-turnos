import Calendar from './components/Calendar.jsx';
import { getCalendarDays } from './utils/calendarUtils'
function App() {
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

      <Calendar />

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