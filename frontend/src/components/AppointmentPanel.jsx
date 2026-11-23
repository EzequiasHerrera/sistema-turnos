import { useState } from "react";
import AppointmentItem from "./AppointmentItem.jsx";

const AppointmentPanel = ({ selectedDate, appointments, loading, error, onStatusChanged, panelState, setPanelState, onEditAppointment }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const renderAppointments = () => {
        if (loading) {
            return <p>Cargando turnos...</p>;
        }

        if (error) {
            return <p>Error al cargar los turnos.</p>;
        }

        if (appointments.length === 0) {
            return (
                <p>
                    {selectedDate
                        ? "No hay turnos para esta fecha."
                        : "No hay turnos registrados."}
                </p>
            );
        }

        return appointments.map((appointment) => (
            <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                onStatusChanged={onStatusChanged}
                onEditAppointment={onEditAppointment}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            />
        ));
    };


    return (
        <>
            <section className={`appointments-panel ${panelState}`}>

                <button
                    type="button" className={`appointments-handle ${panelState}`}
                    onClick={() => {
                        panelState === "closed" ?
                            setPanelState("half")
                            :
                            setPanelState("expanded");
                    }}>
                    <span className="handle-indicator" aria-hidden="true" />
                </button>

                <h1>{selectedDate
                    ? selectedDate.toLocaleDateString("es-AR")
                    : "Todos los turnos"}
                </h1>

                <div className="appointments-content">
                    {renderAppointments()}
                </div>

            </section>


            {panelState !== "closed" && (
                <span className="backdrop"
                    onClick={() => { setPanelState("closed"); setIsMenuOpen(false); }}
                ></span>
            )}
        </>
    );
}

export default AppointmentPanel