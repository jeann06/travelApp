export default function AuthLayout(props) {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <div style={{ flex: 1 }}>
        <div
          className="bg-dark min-vh-100 d-grid"
          style={{
            placeItems: "center",
            backgroundImage: `url('https://wallpapers.com/images/hd/jakarta-city-roundabout-957wm6er9fu1zp8p.jpg')`, // Path relative to the domain name
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* OVERLAY */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          ></div>
          {/* END OVERLAY */}

          <div className="w-100">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
