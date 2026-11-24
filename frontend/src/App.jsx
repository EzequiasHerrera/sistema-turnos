import { NavLink, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CalendarPage from "./pages/CalendarPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import FinancesPage from "./pages/FinancesPage.jsx";
import logo from "./assets/logo.jpg";

function App() {
    const { t, i18n } = useTranslation();

    return (
        <main className="app">
            <nav className="main-navigation" aria-label={t("navigation")}>
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
                    {t("calendar")}
                </NavLink>

                <NavLink
                    to="/clients"
                    className={({ isActive }) =>
                        `nav-button ${isActive ? "is-active" : ""}`
                    }
                >
                    {t("clients")}
                </NavLink>

                <NavLink
                    to="/finances"
                    end
                    className={({ isActive }) =>
                        `nav-button ${isActive ? "is-active" : ""}`
                    }
                >
                    {t("finances")}
                </NavLink>
            </nav>

            <div className="language-selector">
                <button
                    className={i18n.resolvedLanguage === "es" ? "active" : ""}
                    onClick={() => i18n.changeLanguage("es")}
                >
                    ES
                </button>

                <button
                    className={i18n.resolvedLanguage === "pt-BR" ? "active" : ""}
                    onClick={() => i18n.changeLanguage("pt-BR")}
                >
                    PT
                </button>
            </div>

            <Routes>
                <Route path="/" element={<CalendarPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/finances" element={<FinancesPage />} />
            </Routes>
        </main>
    );
}

export default App;