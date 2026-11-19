import { invitation as data } from '../data/invitation.js';

export default function GiftsSection({ onOpen }) {
  return (
    <div className="wp-block-uagb-container uagb-block-f2353bd3 alignfull uagb-is-root-container">
      <div className="uagb-container-inner-blocks-wrap">
        <div className="wp-block-uagb-container uagb-block-6547d8b7">
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="wp-block-uagb-info-box uagb-block-0a7491bf uagb-infobox__content-wrap  uagb-infobox-icon-above-title uagb-infobox-image-valign-top">
            <div className="uagb-ifb-content">
              <div className="uagb-ifb-image-content">
                <img decoding="async" src="/assets/ffffff-blanco-icono-12_Pcyz.gif" alt="" width="70" height="70" loading="lazy" />
              </div>
              <div className="uagb-ifb-title-wrap">
                <h5 className="uagb-ifb-title">
                  {"REGALOS"}
                </h5>
              </div>
              <p className="uagb-ifb-desc">
                {"Tu presencia es el mejor regalo, pero si queres hacerme un obsequio..."}
              </p>
            </div>
          </div>
          <button className="reference-button" type="button" onClick={() => onOpen("gifts")}>VER</button>
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
        </div>
      </div>
    </div>
  );
}
