import { invitation as data } from '../data/invitation.js';

export default function DateSection({ onOpen }) {
  return (
    <div className="wp-block-uagb-container uagb-block-3ace2072 alignfull uagb-is-root-container">
      <div className="uagb-container-inner-blocks-wrap">
        <div className="wp-block-uagb-container uagb-block-bb17593e">
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="wp-block-uagb-info-box uagb-block-3e652f7c uagb-infobox__content-wrap uagb-infobox-icon-above-title uagb-infobox-image-valign-top wp-block-uagb-info-box--has-margin">
            <div className="uagb-infobox-margin-wrapper">
              <div className="uagb-ifb-content">
                <div className="uagb-ifb-image-content">
                  <img decoding="async" src="/assets/ffffff-blanco-icono-3_Pcyz.gif" alt="" width="60" height="60" loading="lazy" />
                </div>
                <div className="uagb-ifb-title-wrap">
                  <h4 className="uagb-ifb-title">
                    {"¿CUÁNDO?"}
                  </h4>
                </div>
                <p className="uagb-ifb-desc">
                  {data.dateLabel}
                  <br />
                  {`| ${data.timeLabel} |`}
                </p>
              </div>
            </div>
          </div>
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
        </div>
      </div>
    </div>
  );
}
