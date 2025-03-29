import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { editProfile } from "../services/user";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [banner, setBanner] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const descRef = useRef();

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

  useEffect(() => {
    descRef.current.style.height = descRef.current.scrollHeight + 2 + "px";
  }, [description]);

  const handleClick = () => {
    setLoading(true);
    editProfile(
      {
        name,
        description,
        website,
        location,
        profile_image_url: image,
        banner_image_url: banner,
      },
      user._id
    )
      .then((res) => {
        setUser(res);
        navigate(`/${user.account_name}`, { replace: true });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="edit-profile">
      <Helmet>
        <title>Edit profile / Twitter</title>
      </Helmet>
      <Header
        title="Edit Profile"
        subtitle={"@" + user.account_name}
        backArrow="full"
      />
      <div className="editprofile pb-5">
        <div className="poster bg-muted position-relative overflow-hidden">
          {bannerUrl && (
            <img className="w-100 h-100" src={bannerUrl} alt="banner" />
          )}
          <div className="backdrop-banner position-absolute w-100 h-100 top-0 left-0"></div>
          <div
            className="camera-plus rounded-circle btn bg-primary filter"
            onClick={(e) => e.currentTarget.firstChild.click()}
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
          <div className="photo w-25 position-relative">
            <img
              className="w-100 rounded-circle square"
              src={imageUrl}
              alt="profile"
            />
            <div className="backdrop-image rounded-circle position-absolute"></div>
            <div
              className="camera-plus rounded-circle btn bg-primary filter"
              onClick={(e) => e.currentTarget.firstChild.click()}
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
              className={`btn text-white bg-app filter fw-bold rounded-pill py-1 px-3${
                loading ? " disabled" : ""
              }`}
            >
              {loading ? (
                <Loading show size="small" className="text-white" />
              ) : (
                "Save"
              )}
            </div>
          </div>
        </div>
        <div className="form-floating mx-4 my-4">
          <input
            type="text"
            className="form-control rounded-5 bg-transparent"
            onChange={(e) => setName(e.currentTarget.value)}
            value={name}
          />
          <label htmlFor="email-input">Name</label>
        </div>
        <div className="form-floating mx-4 my-4">
          <textarea
            className="form-control rounded-5 bg-transparent"
            ref={descRef}
            maxLength={256}
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          ></textarea>
          <label htmlFor="email-input">Description</label>
        </div>
        <div className="form-floating mx-4 my-4">
          <input
            type="text"
            maxLength={64}
            className="form-control rounded-5 bg-transparent"
            onChange={(e) => setLocation(e.currentTarget.value)}
            value={location}
          />
          <label htmlFor="email-input">Location</label>
        </div>
        <div className="form-floating mx-4 my-4">
          <input
            type="url"
            className="form-control rounded-5 bg-transparent"
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
