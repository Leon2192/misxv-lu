import { invitation as data } from '../data/invitation.js';

export default function VenueSection({ onOpen }) {
  return (
    <div className="wp-block-uagb-container uagb-block-889711ae alignfull uagb-is-root-container">
      <div className="uagb-container-inner-blocks-wrap">
        <div className="wp-block-uagb-container uagb-block-67af5daf">
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="wp-block-uagb-info-box uagb-block-c10c4589 uagb-infobox__content-wrap uagb-infobox-icon-above-title uagb-infobox-image-valign-top wp-block-uagb-info-box--has-margin">
            <div className="uagb-infobox-margin-wrapper">
              <div className="uagb-ifb-content">
                <div className="uagb-ifb-image-content">
                  <img decoding="async" src="/assets/2e2e2e-gris-oscuro-icono-25_Pcyz.gif" alt="" width="70" height="70" loading="lazy" />
                </div>
                <div className="uagb-ifb-title-wrap">
                  <h4 className="uagb-ifb-title">
                    {"¿DÓNDE?"}
                  </h4>
                </div>
                <p className="uagb-ifb-desc">
                  {data.venue.name}
                  <br />
                  {data.venue.address}
                </p>
              </div>
            </div>
          </div>
          <div className="venue-directions">
            <button className="reference-button" type="button" onClick={() => onOpen('map')}>CÓMO LLEGAR</button>
          </div>
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
        </div>
      </div>
    </div>
  );
}
