import { useState } from 'react';
import Calendar from './components/Calendar.jsx';
import AppointmentPanel from './components/AppointmentPanel.jsx';

function App() {
  const [panelState, setPanelState] = useState("closed");

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

      <AppointmentPanel />
    </main>
  )
}

export default App;