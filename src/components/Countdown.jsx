import { useEffect, useState } from 'react';

function remaining(date) {
  const difference = Math.max(0, new Date(date).getTime() - Date.now());
  return [
    Math.floor(difference / 86400000),
    Math.floor(difference / 3600000) % 24,
    Math.floor(difference / 60000) % 60,
    Math.floor(difference / 1000) % 60,
  ];
}

export default function Countdown({ date }) {
  const [values, setValues] = useState(() => remaining(date));
  useEffect(() => {
    const update = () => setValues(remaining(date));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [date]);

  return (
    <div className="wp-block-uagb-countdown uagb-block-8392c130" role="timer" aria-label="Tiempo restante para la fiesta" aria-live="off">
      {values.map((value, i) => (
        <div className={`wp-block-uagb-countdown__box wp-block-uagb-countdown__box-${['days', 'hours', 'minutes', 'seconds'][i]}`} key={i}>
          <div className="wp-block-uagb-countdown__time">{String(value).padStart(2, '0')}</div>
          <div className="wp-block-uagb-countdown__label">{['DÍAS', 'HORAS', 'MINUTOS', 'SEGUNDOS'][i]}</div>
        </div>
      ))}
    </div>
  );
}
