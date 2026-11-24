import { NavLink, Route, Routes } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import logo from "./assets/logo.jpg";
import FinancesPage from "./pages/FinancesPage.jsx";

function App() {

	return (
		<main className="app">
			<nav className="main-navigation" aria-label="Navegación principal">
				<img
					src={logo}
					alt="Logo"
					className="nav-logo"
				/>

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
				<NavLink
					to="/finances"
					end
					className={({ isActive }) =>
						`nav-button ${isActive ? "is-active" : ""}`
					}
				>
					Finanzas
				</NavLink>
			</nav>
			<Routes>
				<Route path="/" element={<CalendarPage />} />
				<Route path="/clients" element={<ClientsPage />} />
				<Route path="/finances" element={<FinancesPage />} />
			</Routes>
		</main>
	);
}

export default App;
