import Gallery from '../components/Gallery.jsx';

export default function InstagramSection() {
  return (
    <div className="wp-block-uagb-container uagb-block-c7955cd4 gallery-section alignfull uagb-is-root-container">
      <div className="uagb-container-inner-blocks-wrap">
        <div className="wp-block-uagb-container uagb-block-28ef10bd">
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
          <div className="wp-block-uagb-info-box uagb-block-9f9d6aed uagb-infobox__content-wrap  uagb-infobox-icon-above-title uagb-infobox-image-valign-top">
            <div className="uagb-ifb-content">
              <div className="uagb-ifb-image-content">
                <img decoding="async" src="/assets/2e2e2e-gris-oscuro-icono-6_Pcyz.gif" alt="" width="70" height="70" loading="lazy" />
              </div>
              <div className="uagb-ifb-title-wrap">
                <h5 className="uagb-ifb-title">
                  {"Galería"}
                </h5>
              </div>
            </div>
          </div>
          <Gallery />
          <div style={{"height": "40px"}} aria-hidden="true" className="wp-block-spacer">
          </div>
        </div>
      </div>
    </div>
  );
}
