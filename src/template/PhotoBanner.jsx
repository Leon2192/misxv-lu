import { invitation as data } from '../data/invitation.js';

export default function PhotoBanner({ onOpen }) {
  return (
    <div className="wp-block-uagb-container uagb-block-0d8aefcf alignfull uagb-is-root-container">
      <div className="wp-block-uagb-advanced-heading uagb-block-e2340451">
        <h3 className="uagb-heading-text">
          {"MIS "}
          <strong>
            {"XV"}
          </strong>
          <br />
          {data.name.toUpperCase()}
        </h3>
      </div>
    </div>
  );
}
