import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../config/context";
import { editProfile } from "../services/user";
import Header from "../components/Header";
import Loading from "../components/Loading";

export default function EditProfile(props) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [website, setWebsite] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [banner, setBanner] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [bannerUrl, setBannerUrl] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDescription(user.description);
      setLocation(user.location);
      setWebsite(user.website);
      setImageUrl(user.profile_image_url);
      setBannerUrl(user.banner_image_url);
    }
  }, [user]);

  const handleClick = () => {
    setLoading(true);
    editProfile({
      name,
      description,
      website,
      location,
      profile_image_url: image,
      banner_image_url: banner,
    })
      .then(() => navigate(`/${user.account_name}`, { replace: true }))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="edit-profile">
      <Header
        title="Edit Profile"
        subtitle={"@" + user.account_name}
        backArrow="full"
      />
      <div className="editprofile pb-5">
        <div className="poster">
          {bannerUrl && (
            <img className="w-100 h-100" src={bannerUrl} alt="banner" />
          )}
          <div className="backdrop-banner"></div>
          <div
            className="camera-plus rounded-circle btn bg-primary hover"
            onClick={(e) => {
              e.currentTarget.firstChild.click();
            }}
          >
            <input
              type="file"
              className="d-none"
              onChange={(e) => {
                setBanner(e.currentTarget.files[0]);
                setBannerUrl(URL.createObjectURL(e.currentTarget.files[0]));
              }}
            />
            <i className="bi bi-camera fs-2"></i>
          </div>
        </div>
        <div className="photo-btn d-flex justify-content-between px-3">
          <div className="photo w-25">
            <img
              className="w-100 rounded-circle"
              src={imageUrl}
              alt="profile"
            />
            <div className="backdrop-image"></div>
            <div
              className="camera-plus rounded-circle btn bg-primary hover"
              onClick={(e) => {
                e.currentTarget.firstChild.click();
              }}
            >
              <input
                type="file"
                className="d-none"
                onChange={(e) => {
                  setImage(e.currentTarget.files[0]);
                  setImageUrl(URL.createObjectURL(e.currentTarget.files[0]));
                }}
              />
              <i className="bi bi-camera fs-2"></i>
            </div>
          </div>
          <div className="btns py-2">
            <div
              onClick={handleClick}
              className={`btn text-white btn-primary fw-bold rounded-pill py-1 px-3${
                loading ? " disabled" : ""
              }`}
            >
              {loading ? (
                <Loading
                  show={true}
                  style={{
                    width: "1rem",
                    height: "1rem",
                    margin: "0 9.5px",
                  }}
                  className="text-white"
                />
              ) : (
                "Save"
              )}
            </div>
            
          </div>
        </div>
        <div className="form-floating mx-4 my-4">
          <input
            type="text"
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            onChange={(e) => setName(e.currentTarget.value)}
            value={name}
          />
          <label htmlFor="email-input">Name</label>
        </div>
        <div className="form-floating mx-4 my-4">
          <textarea
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent", height: "200%" }}
            maxLength={256}
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value);
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + 2 + "px";
            }}
          ></textarea>
          <label htmlFor="email-input">Description</label>
        </div>
        <div className="form-floating mx-4 my-4">
          <input
            type="text"
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            onChange={(e) => setLocation(e.currentTarget.value)}
            value={location}
          />
          <label htmlFor="email-input">Location</label>
        </div>
        <div className="form-floating mx-4 my-4">
          <input
            type="text"
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            onChange={(e) => setWebsite(e.currentTarget.value)}
            value={website}
          />
          <label htmlFor="email-input">Website</label>
        </div>
      </div>
      <div className="py-5"></div>
    </div>
  );
}
