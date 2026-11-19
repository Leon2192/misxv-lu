import { invitation as data } from '../data/invitation.js';
import Trivia from '../components/Trivia.jsx';

export default function TriviaSection({ onOpen }) {
  return (
    <div className="wp-block-uagb-container uagb-block-46f7d45f alignfull uagb-is-root-container">
      <div className="uagb-container-inner-blocks-wrap">
        <div className="wp-block-uagb-container uagb-block-547993b4">
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="wp-block-uagb-info-box uagb-block-c6fe1e54 uagb-infobox__content-wrap  uagb-infobox-icon-above-title uagb-infobox-image-valign-top">
            <div className="uagb-ifb-content">
              <div className="uagb-ifb-image-content">
                <img decoding="async" src="/assets/2e2e2e-gris-oscuro-icono-36_Pcyz.gif" alt="" width="70" height="70" loading="lazy" />
              </div>
              <div className="uagb-ifb-title-wrap">
                <h4 className="uagb-ifb-title">
                  {"¿CUÁNTO ME CONOCES?"}
                </h4>
              </div>
              <p className="uagb-ifb-desc">
                {"JUGUEMOS UN POCO"}
              </p>
            </div>
          </div>
          <Trivia />
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
        </div>
      </div>
    </div>
  );
}
