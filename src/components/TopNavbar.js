import React, { useEffect } from "react";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { useAuth } from "../auth/AuthContext";
import LogoutModal from "./LogoutModal";
import { useNavigate } from "react-router-dom";

const TopNavbar = ({ userType }) => {
  const [userName, setUserName] = useState("");
  const [notificationsButton, setNotificationsButton] = useState(false);
  const [profileButton, setProfileButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(JSON.parse(storedName));
    }
  }, []);

  //Path without navbar
  if (location.pathname === "/auth") return null;

  //False data
  const notifications = Array.from(
    { length: 10 },
    (_, index) => `Notification ${index + 1}`
  );
  //const notifications = "";

  const toggleNotificationsButton = () => {
    setNotificationsButton(!notificationsButton);
    if (profileButton) toggleProfileButton();
  };

  const toggleProfileButton = () => {
    setProfileButton(!profileButton);
    if (notificationsButton) toggleNotificationsButton();
  };

  const toggleFalse = () => {
    setNotificationsButton(false);
    setProfileButton(false);
  };
  const ShowModal = () => {
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    setShowModal(false);
    toggleFalse();
    logout();
    navigate("/auth");
  };

  return (
    <Fragment>
      <div className="w-full min-h-16 bg-blue-1 flex items-center px-4  justify-end space-x-6 pr-8 sticky top-0">
        <FaRegBell
          className={`w-8 h-8  ${
            notificationsButton ? "text-orange-1" : "text-white"
          }`}
          onClick={() => toggleNotificationsButton()}
        />
        <CgProfile
          className={`w-8 h-8  ${
            profileButton ? "text-orange-1" : "text-white"
          }`}
          onClick={() => toggleProfileButton()}
        />
        {userType !== "user" && (
          <h1 className="text-1xl text-white">{userName}</h1>
        )}
      </div>
      {notificationsButton && (
        <div className="fixed top-16 right-0 bg-orange-1 min-w-60 w-fit max-h-40 h-fit overflow-auto space-y-1">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <h1 key={index} className="text-xl">
                {notification}
              </h1>
            ))
          ) : (
            <h1 className="text-xl">No notifications</h1>
          )}
        </div>
      )}
      {profileButton && (
        <div className="fixed top-16 right-0 bg-orange-1 h-fit min-w-60">
          <h1 className="text-xl" onClick={() => ShowModal()}>
            Logout
          </h1>
        </div>
      )}
      {showModal && (
        <LogoutModal
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </Fragment>
  );
};

export default TopNavbar;
