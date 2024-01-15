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
          src={`http://localhost:8080/${profilePic}`}
          className="object-fit-cover rounded-circle border border-secondary border-1"
          width="55px"
          height="55px"
        />
      </div>
      <div className="ms-3">
        <div>{profileName}</div>
        <div>Posted on {moment(createdDate).format("DD MMMM YYYY h:mm A")}</div>
      </div>
    </div>
  );
};

export default UserProfile;
