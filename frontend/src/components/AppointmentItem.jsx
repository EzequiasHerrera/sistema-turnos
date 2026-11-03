const AppointmentItem = ({ appointment }) => {
    return (
        <div className="appointment-item">
            <span>{appointment.start_time.slice(11, 16)}</span>
            <span>{appointment.end_time.slice(11, 16)}</span>
            <p>{appointment.name}</p>
            <p>{appointment.notes}</p>
        </div>
    )
}

export default AppointmentItem