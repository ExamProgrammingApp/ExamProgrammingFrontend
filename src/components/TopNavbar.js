import React from "react";
import {useState} from "react";
import {FaRegBell} from "react-icons/fa";
import {CgProfile} from "react-icons/cg";
import {Link} from "react-router-dom";

const TopNavbar = () => {
  const [notificationsButton, setNotificationsButton] = useState(false);
  const [profileButton, setProfileButton] = useState(false);

  //False data
  const notifications = Array.from({length: 10}, (_, index) => `Notificare ${index + 1}`);
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

  return (
    <fragment className="sticky top-0">
      <div className="w-full min-h-16 bg-blue-1 flex items-center px-4  justify-end space-x-6 pr-8">
        <FaRegBell
          className={`w-8 h-8 text-white ${notificationsButton ? "text-orange-1" : "text-white"}`}
          onClick={() => toggleNotificationsButton()}
        />
        <CgProfile
          className={`w-8 h-8 text-white ${profileButton ? "text-orange-1" : "text-white"}`}
          onClick={() => toggleProfileButton()}
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
      {profileButton && (
        <div className="fixed top-16 right-0 bg-orange-1 h-fit min-w-60">
          <h1 className="text-xl">
            <Link to="/auth">
              <h1 className="text-xl" onClick={() => toggleFalse()}>
                Logout
              </h1>
            </Link>
          </h1>
        </div>
      )}
    </fragment>
  );
};

export default TopNavbar;
