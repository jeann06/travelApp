import { useState } from "react";
import { Button } from "reactstrap";
import Lightbox from "yet-another-react-lightbox";

const ObjectFitImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
);

const PlacesImageGrid = ({ items, defaultHeight = 500 }) => {
  const style = { maxHeight: defaultHeight };
  const halfStyle = { maxHeight: Math.floor(defaultHeight / 2) };

  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div>
      <div className="rounded-2 overflow-hidden">
        <div className="row g-1">
          {items.length === 1 && (
            <div className="col-12 col-md-12" style={style}>
              <ObjectFitImage src={items[0].src} alt={items[0].alt} />
            </div>
          )}
          {items.length === 2 && (
            <>
              <div className="col-12 col-md-6" style={style}>
                <ObjectFitImage src={items[0].src} alt={items[0].alt} />
              </div>
              <div className="col-12 col-md-6" style={style}>
                <ObjectFitImage src={items[1].src} alt={items[1].alt} />
              </div>
            </>
          )}
          {items.length === 3 && (
            <>
              <div className="col-12 col-md-6" style={style}>
                <ObjectFitImage src={items[0].src} alt={items[0].alt} />
              </div>
              <div className="col-12 col-md-6" style={style}>
                <div className="row g-1">
                  <div className="col-6 col-md-12" style={halfStyle}>
                    <ObjectFitImage src={items[1].src} alt={items[1].alt} />
                  </div>
                  <div className="col-6 col-md-12" style={halfStyle}>
                    <ObjectFitImage src={items[2].src} alt={items[2].alt} />
                  </div>
                </div>
              </div>
            </>
          )}
          {items.length > 3 && (
            <>
              <div className="col-12 col-md-6" style={style}>
                <ObjectFitImage src={items[0].src} alt={items[0].alt} />
              </div>
              <div className="col-12 col-md-6" style={style}>
                <div className="row g-1">
                  <div className="col-6 col-md-12" style={halfStyle}>
                    <ObjectFitImage src={items[1].src} alt={items[1].alt} />
                  </div>
                  <div className="col-6 col-md-6" style={halfStyle}>
                    <ObjectFitImage src={items[2].src} alt={items[2].alt} />
                  </div>
                  <div
                    className="col-12 col-md-6 position-relative"
                    style={halfStyle}
                  >
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{ zIndex: 1, background: "rgba(0,0,0,0.5)" }}
                    >
                      <Button
                        className="position-absolute top-50 start-50 translate-middle"
                        color="primary"
                        onClick={() => setLightboxOpen(true)}
                      >
                        <span className="text-white">View gallery</span>
                      </Button>
                    </div>

                    <ObjectFitImage src={items[3].src} alt={items[3].alt} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={items.map((item) => ({
          src: item.src,
        }))}
      />
    </div>
  );
};

export default PlacesImageGrid;
