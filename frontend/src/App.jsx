import { NavLink, Route, Routes } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";

function App() {

	return (
		<main className="app">
			<nav className="main-navigation" aria-label="Navegación principal">
				<NavLink
					to="/"
					end
					className={({ isActive }) =>
						`nav-button ${isActive ? "is-active" : ""}`
					}
				>
					Calendario
				</NavLink>

				<NavLink
					to="/clients"
					className={({ isActive }) =>
						`nav-button ${isActive ? "is-active" : ""}`
					}
				>
					Clientes
				</NavLink>
			</nav>
			<Routes>
				<Route path="/" element={<CalendarPage />} />
				<Route path="/clients" element={<ClientsPage />} />
			</Routes>
		</main>
	);
}

export default App;
