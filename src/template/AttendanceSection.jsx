import { invitation as data } from '../data/invitation.js';

export default function AttendanceSection() {
  return (
    <div className="wp-block-uagb-container uagb-block-d13f1392 alignfull uagb-is-root-container">
      <div className="uagb-container-inner-blocks-wrap">
        <div className="wp-block-uagb-container uagb-block-0f9cbbef">
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="wp-block-uagb-info-box uagb-block-115d966b uagb-infobox__content-wrap  uagb-infobox-icon-above-title uagb-infobox-image-valign-top wp-block-uagb-info-box--has-margin">
            <div className="uagb-infobox-margin-wrapper">
              <div className="uagb-ifb-content">
                <div className="uagb-ifb-image-content">
                  <img decoding="async" src="/assets/ffffff-blanco-icono-8_Pcyz.gif" alt="" width="70" height="70" loading="lazy" />
                </div>
                <div className="uagb-ifb-title-wrap">
                  <h5 className="uagb-ifb-title">
                    {"CONFIRMÁ TU ASISTENCIA"}
                  </h5>
                </div>
                <p className="uagb-ifb-desc">
                  {data.rsvpDeadline}
                </p>
              </div>
            </div>
          </div>
          <div style={{"height": "20px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="attendance-action">
            <button className="reference-button" type="button">Confirmar</button>
          </div>
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
        </div>
      </div>
    </div>
  );
}
