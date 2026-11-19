import { invitation as data } from '../data/invitation.js';

export default function DressCodeSection({ onOpen }) {
  return (
    <div className="wp-block-uagb-container uagb-block-b7a83ed1 alignfull uagb-is-root-container">
      <div className="uagb-container-inner-blocks-wrap">
        <div className="wp-block-uagb-container uagb-block-667f74fb">
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="wp-block-uagb-info-box uagb-block-b4b60011 uagb-infobox__content-wrap  uagb-infobox-icon-above-title uagb-infobox-image-valign-top">
            <div className="uagb-ifb-content">
              <div className="uagb-ifb-image-content">
                <img decoding="async" src="/assets/ffffff-blanco-icono-20_Pcyz.gif" alt="" width="70" height="70" loading="lazy" />
              </div>
              <div className="uagb-ifb-title-wrap">
                <span className="uagb-ifb-title-prefix">
                  {"DRESS CODE"}
                </span>
                <h4 className="uagb-ifb-title">
                  {data.dressCode}
                </h4>
                <p className="dress-code-note">Color reservado: Plateado</p>
              </div>
              <div className="uagb-ifb-separator">
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
