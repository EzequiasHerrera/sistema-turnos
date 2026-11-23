import { useState, useRef } from "react";
import AppointmentItem from "./AppointmentItem.jsx";

const AppointmentPanel = ({ selectedDate, appointments, loading, error, onStatusChanged, panelState, setPanelState, onEditAppointment }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const panelRef = useRef(null);
    const dragRef = useRef(null);

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
                isMenuOpen={openMenuId === appointment.id}
                setIsMenuOpen={(isOpen) => {
                    setOpenMenuId(isOpen ? appointment.id : null);
                }}
            />
        ));
    };

    const getPosition = (state) => {
        const vh = window.innerHeight;

        if (state === "closed") return vh * 0.83;
        if (state === "half") return vh * 0.30;
        return 0;
    };

    const handlePointerDown = (e) => {
        if (e.button !== 0) return;

        const panel = panelRef.current;
        if (!panel) return;

        dragRef.current = {
            startY: e.clientY,
            startPosition: getPosition(panelState),
            moved: false,
        };

        e.currentTarget.setPointerCapture(e.pointerId);
        panel.style.transition = "none";
    };

    const handlePointerMove = (e) => {
        if (!dragRef.current || !panelRef.current) return;

        const drag = dragRef.current;
        const distance = e.clientY - drag.startY;

        if (Math.abs(distance) > 5) {
            drag.moved = true;
        }

        const position = Math.max(
            0,
            Math.min(getPosition("closed"), drag.startPosition + distance)
        );

        panelRef.current.style.transform = `translateY(${position}px)`;
    };

    const handlePointerUp = (e) => {
        if (!dragRef.current || !panelRef.current) return;

        const drag = dragRef.current;
        const distance = e.clientY - drag.startY;

        dragRef.current = null;

        panelRef.current.style.transition = "";
        panelRef.current.style.transform = "";

        if (!drag.moved) {
            setPanelState((prev) =>
                prev === "closed" ? "half" : "expanded"
            );
            return;
        }

        const finalPosition = drag.startPosition + distance;

        const states = ["expanded", "half", "closed"];

        const closestState = states.reduce((closest, state) => {
            return Math.abs(getPosition(state) - finalPosition) <
                Math.abs(getPosition(closest) - finalPosition)
                ? state
                : closest;
        });

        setPanelState(closestState);
        setOpenMenuId(null);
    };

    return (
        <>
            <section
                ref={panelRef}
                className={`appointments-panel ${panelState}`}
            >

                <button
                    type="button"
                    className={`appointments-handle ${panelState}`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
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
                    onClick={() => {
                        setPanelState("closed");
                        setOpenMenuId(null);
                    }}
                ></span>
            )}
        </>
    );
}

export default AppointmentPanel