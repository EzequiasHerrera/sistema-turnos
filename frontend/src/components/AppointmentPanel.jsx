import { useState } from "react";

const AppointmentPanel = () => {
    const [panelState, setPanelState] = useState("closed");

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

                <div className="appointments-content">
                    {/*Lista de turnos*/}
                </div>

            </section>


            {panelState !== "closed" && (
                <span className="backdrop"
                    onClick={() => setPanelState("closed")}
                ></span>
            )}
        </>
    );
}

export default AppointmentPanel