import moment from "moment";

const UserProfile = ({ profilePic, profileName, createdDate }) => {
  return (
    <div className="d-flex align-items-center">
      <div
        style={{
          width: "55px",
          height: "55px",
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${profilePic}`}
          className="object-fit-cover rounded-circle border border-secondary border-1"
          width="55px"
          height="55px"
        />
      </div>
      <div className="ms-3">
        <div className="fw-semibold">{profileName}</div>
        <div>Posted on {moment(createdDate).format("DD MMMM YYYY h:mm A")}</div>
      </div>
    </div>
  );
};

export default UserProfile;
