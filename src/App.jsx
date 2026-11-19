import { useState } from 'react';
import Modal from './components/Modal.jsx';
import DressCodeSection from './template/DressCodeSection.jsx';
import VenueSection from './template/VenueSection.jsx';
import DateSection from './template/DateSection.jsx';
import AttendanceSection from './template/AttendanceSection.jsx';
import InstagramSection from './template/InstagramSection.jsx';
import GiftsSection from './template/GiftsSection.jsx';
import ClosingBanner from './template/ClosingBanner.jsx';
import Hero from './template/Hero.jsx';
import CountdownSection from './template/CountdownSection.jsx';

export default function App() {
  const [modal, setModal] = useState(null);
  return (
    <div className="wp-site-blocks">
      <main className="entry-content wp-block-post-content has-global-padding is-layout-constrained">
      <Hero />
      <CountdownSection />
      <DateSection />
      <VenueSection onOpen={setModal} />
      <DressCodeSection />
      <GiftsSection onOpen={setModal} />
      <InstagramSection />
      <AttendanceSection />
      <div style={{"height": "30px"}} aria-hidden="true" className="wp-block-spacer">
      </div>
      <ClosingBanner />
      <div style={{"height": "30px"}} aria-hidden="true" className="wp-block-spacer">
      </div>
      </main>
      <Modal type={modal} onClose={() => setModal(null)} />
    </div>
  );
}
