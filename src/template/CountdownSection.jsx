import Countdown from '../components/Countdown.jsx';
import { invitation as data } from '../data/invitation.js';

export default function CountdownSection() {
  return (
    <section className="countdown-section alignfull" aria-label="Cuenta regresiva">
      <Countdown date={data.date} />
    </section>
  );
}
