import { useEffect, useRef, useState } from 'react';
import { invitation as data } from '../data/invitation.js';

export default function Modal({ type, onClose }) {
  const dialog = useRef(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (type) { setStatus(''); dialog.current.showModal(); }
    else if (dialog.current.open) dialog.current.close();
  }, [type]);

  async function copy(value) {
    try { await navigator.clipboard.writeText(value); setStatus('¡Copiado!'); }
    catch { setStatus('Seleccioná el dato para copiarlo manualmente.'); }
  }

  return <dialog ref={dialog} className={`reference-modal ${type === 'gifts' ? 'gift-modal' : ''}`} aria-labelledby="modal-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-inner">
      <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">×</button>
      <h2 id="modal-title">{type === 'map' ? data.venue.name : 'REGALOS'}</h2>
      {type === 'map' && <><iframe src={data.venue.embedUrl} title={`Mapa de ${data.venue.name}`} loading="lazy" allowFullScreen /><a className="reference-button" href={data.venue.mapsUrl} target="_blank" rel="noreferrer">ABRIR EN GOOGLE MAPS</a></>}
      {type === 'gifts' && <>
        <img src="/assets/ffffff-blanco-icono-12_Pcyz.gif" width="70" height="70" alt="" />
        <p><strong>ALIAS:</strong><br /><span>{data.giftAlias}</span></p><button className="reference-button" type="button" onClick={() => copy(data.giftAlias)}>COPIAR ALIAS</button>
        <p><strong>CVU:</strong><br /><span>{data.giftCvu}</span></p><button className="reference-button" type="button" onClick={() => copy(data.giftCvu)}>COPIAR CVU</button>
        <p role="status">{status}</p>
      </>}
    </div>
  </dialog>;
}
