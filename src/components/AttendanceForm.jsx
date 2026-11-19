import { useState } from 'react';

const newGuest = () => ({ nombre: '', apellido: '', attendance: 'yes', food: 'NINGUNO', other: '', message: '' });
const foodOptions = ['NINGUNO', 'CELÍACO/A', 'VEGETARIANO/A', 'VEGANO/A', 'SIN LACTOSA', 'DIABÉTICO/A', 'OTRO'];

export default function AttendanceForm() {
  const [guests, setGuests] = useState([newGuest()]);
  const [feedback, setFeedback] = useState('');

  function update(index, field, value) {
    setGuests(previous => previous.map((guest, i) => i === index ? { ...guest, [field]: value } : guest));
    setFeedback('');
  }

  function setCount(count) {
    setGuests(previous => Array.from({ length: count }, (_, i) => previous[i] || newGuest()));
    setFeedback('');
  }

  function submit(event) {
    event.preventDefault();
    try {
      const key = 'lu-confirmaciones-locales';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const record = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), guests };
      localStorage.setItem(key, JSON.stringify([...(Array.isArray(existing) ? existing : []), record]));
      setFeedback('Confirmación guardada en este dispositivo. No se envió a la organización.');
    } catch {
      setFeedback('No se pudo guardar la confirmación. Revisá que el navegador permita almacenamiento local.');
    }
  }

  return <div className="ltd-confirm-wrapper">
    <div className="ltd-person-count"><label htmlFor="guest-count">NÚMERO DE PERSONAS A CONFIRMAR</label><select id="guest-count" className="ltd-count-select" value={guests.length} onChange={e => setCount(Number(e.target.value))}>{Array.from({ length: 10 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? 'PERSONAS' : 'PERSONA'}</option>)}</select></div>
    <form className="ltd-confirm-form" onSubmit={submit}>
      <div className="ltd-guests">{guests.map((guest, index) => <section className="ltd-guest-card" key={index}>
        <h3>INVITADO {index + 1}</h3>
        <div className="ltd-fields-grid">
          {['nombre', 'apellido'].map(field => <div className="ltd-field ltd-floating" key={field}>
            <input id={`${field}-${index}`} autoComplete={field === 'nombre' ? 'given-name' : 'family-name'} placeholder=" " required pattern=".*\S.*" maxLength={100} value={guest[field]} onChange={e => update(index, field, e.target.value)} /><label htmlFor={`${field}-${index}`}>{field.toUpperCase()} *</label>
          </div>)}
          <div className="ltd-field ltd-confirm-question ltd-confirm-pills"><div className="ltd-radio-group" role="group" aria-label={`Asistencia del invitado ${index + 1}`}>
            {['yes', 'no'].map(value => <label className="ltd-radio-option" key={value}><input type="radio" name={`attendance-${index}`} value={value} checked={guest.attendance === value} onChange={() => update(index, 'attendance', value)} required /><span className="ltd-radio-circle" /><span>{value === 'yes' ? '¡CONFIRMO!' : 'NO PODRÉ ASISTIR'}</span></label>)}
          </div></div>
          {guest.attendance === 'yes' && <>
            <div className="ltd-field"><label htmlFor={`food-${index}`}>¿ALGÚN REQUERIMIENTO EN LA ALIMENTACIÓN? *</label><select id={`food-${index}`} required value={guest.food} onChange={e => update(index, 'food', e.target.value)}>{foodOptions.map(option => <option key={option}>{option}</option>)}</select></div>
            {guest.food === 'OTRO' && <div className="ltd-field ltd-floating"><input id={`other-${index}`} placeholder=" " required pattern=".*\S.*" maxLength={300} value={guest.other} onChange={e => update(index, 'other', e.target.value)} /><label htmlFor={`other-${index}`}>DETALLAR REQUERIMIENTO *</label></div>}
          </>}
          <div className="ltd-field ltd-floating"><textarea id={`message-${index}`} rows={2} placeholder=" " maxLength={1000} value={guest.message} onChange={e => update(index, 'message', e.target.value)} /><label htmlFor={`message-${index}`}>COMENTÁ TUS BUENOS DESEOS</label></div>
        </div>
      </section>)}</div>
      <p className="local-note">La confirmación se guarda únicamente en este dispositivo.</p>
      <button className="ltd-confirm-submit" type="submit">CONFIRMAR</button>
      <p className="ltd-confirm-feedback" role="status">{feedback}</p>
    </form>
  </div>;
}
