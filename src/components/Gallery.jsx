import { useEffect, useRef, useState } from 'react';

const photos = [
  { src: '/images/1.jpeg', alt: 'Un recuerdo de la infancia, con mariposas en el pelo' },
  { src: '/images/2.jpeg', alt: 'Un paseo de pequeña, con anteojos de sol' },
  { src: '/images/3.jpeg', alt: 'Un recuerdo de pequeña, sonriendo con botas de lluvia' },
  { src: '/images/4.jpeg', alt: 'Un momento especial, con vestido negro' },
  { src: '/images/5.jpeg', alt: 'Un recuerdo al aire libre' },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const photo = selected === null ? null : photos[selected];

  useEffect(() => {
    if (selected !== null && !dialog.current.open) dialog.current.showModal();
    else if (selected === null && dialog.current.open) dialog.current.close();
  }, [selected]);

  function navigate(direction) {
    setSelected(index => (index + direction + photos.length) % photos.length);
  }

  return (
    <div className="gallery-block">
      <div className="photo-gallery" aria-label="Galería de recuerdos">
        {photos.map((item, index) => (
          <button className="photo-gallery-item" type="button" key={item.src}
            onClick={() => setSelected(index)} aria-label={`Ampliar foto ${index + 1}`} aria-haspopup="dialog">
            <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="gallery-lightbox" aria-label="Foto ampliada"
        onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
          if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
        }}>
        <div className="gallery-lightbox-content">
          <button type="button" className="gallery-close" onClick={() => setSelected(null)} aria-label="Cerrar foto">×</button>
          {photo && <img className="gallery-full-photo" src={photo.src} alt={photo.alt} />}
          <div className="gallery-controls">
            <button type="button" onClick={() => navigate(-1)}>Anterior</button>
            <span aria-live="polite">{selected === null ? '' : `${selected + 1} / ${photos.length}`}</span>
            <button type="button" onClick={() => navigate(1)}>Siguiente</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
