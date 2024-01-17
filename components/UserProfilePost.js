import moment from "moment";

const UserProfile = ({
  profilePic,
  profileName,
  createdDate,
  creator,
  modifiedDate,
}) => {
  return (
    <div className="d-flex align-items-center">
      <div
        style={{
          width: "55px",
          height: "55px",
        }}
      >
        <img
          src={`http://localhost:8080/${profilePic}`}
          className="object-fit-cover rounded-circle border border-secondary border-1"
          width="55px"
          height="55px"
        />
      </div>
      <div className="ms-3">
        <div className="fw-semibold">{profileName}</div>
        <div>
          Posted by {creator} on {moment(createdDate).format("DD MMMM YYYY")} -
          Modified by {profileName} on{" "}
          {moment(modifiedDate).format("DD MMMM YYYY")}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
