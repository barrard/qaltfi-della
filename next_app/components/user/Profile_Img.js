export const Profile_Img = ({ user, width }) => {
  const img = user.main_profile_img;
  var img_width = width || ''
  if (img) {
    return (
      <div>
        <img
          src={`/static/user_profile_imgs/${img}`}
          className="img-fluid"
          alt={user.firstname + " " + user.lastname}
          title={user.firstname + " " + user.lastname}
          width={img_width}
        />
      </div>
    );
  } else {
    return (
      <div style={{ position: "relative" }}>

        <img
          width={img_width}
          src="/static/img/profile-placeholder.jpg"
          className="img-fluid rounded"
          alt="new user"
          title="new user"
        />
      </div>
    );
  }
};

