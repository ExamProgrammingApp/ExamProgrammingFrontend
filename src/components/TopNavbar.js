import React, { useEffect } from "react";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Fragment } from "react";
import { useAuth } from "../auth/AuthContext";
import LogoutModal from "./LogoutModal";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";

const TopNavbar = ({ userType }) => {
  const [userName, setUserName] = useState("");
  const [notificationsButton, setNotificationsButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(JSON.parse(storedName));
    }
  }, [location.pathname]);

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
  };

  const toggleFalse = () => {
    setNotificationsButton(false);
  };
  const ShowModal = () => {
    setShowModal(true);
    setNotificationsButton(false);
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
        {userType !== "user" && (
          <h1 className="text-2xl text-white">{userName}</h1>
        )}
        {userType !== "user" && (
          <FaRegBell
            className={`w-8 h-8 hover:text-orange-1 ${
              notificationsButton ? "text-orange-1" : "text-white"
            }`}
            onClick={() => toggleNotificationsButton()}
          />
        )}
        <TbLogout
          className="w-8 h-8 text-white hover:text-orange-1"
          onClick={() => ShowModal()}
        />
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
