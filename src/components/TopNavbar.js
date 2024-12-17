import React, { useEffect } from "react";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { useAuth } from "../auth/AuthContext";
import LogoutModal from "./LogoutModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from 'socket.io-client';

// const socket = io(process.env.REACT_APP_BACKEND_URL, {
//   query: {
//     token: localStorage.getItem("access_token"),
//   },
// });

const TopNavbar = ({ userType }) => {
  const [userName, setUserName] = useState("");
  const [notificationsButton, setNotificationsButton] = useState(false);
  const [profileButton, setProfileButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(JSON.parse(storedName));
    }
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data); // Stochează notificările în stare
        setHasUnreadNotifications(response.data.some(notification => !notification.isRead));

      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // socket.on('notification', (notification) => {
    //   console.log('New notification received:', notification);
    //   // Actualizează notificările
    //   setNotifications(prevNotifications => [notification, ...prevNotifications]);
    //   setHasUnreadNotifications(true);  // Setează că există notificări necitite
    // });
    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  //Path without navbar
  if (location.pathname === "/auth") return null;



  const toggleNotificationsButton = async () => {
    setNotificationsButton(!notificationsButton);
    if (profileButton) toggleProfileButton();

    // Filtrare notificări necitite la deschiderea listei
    if (!notificationsButton) {
      setNotifications((prevNotifications) =>
        prevNotifications.sort((a, b) => Number(a.isRead) - Number(b.isRead)) // Necitite primele
      );
    }
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

  const handleNotificationClick = async (notificationId) => {
    try {
      const token = localStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BACKEND_URL}/notifications/${notificationId}/mark-as-read`;
      await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const notification = notifications.find(
        (notif) => notif.notificationId === notificationId
      );

      if (!notification) {
        console.error("Notification not found in state.");
        return;
      }
      console.log("Notification Type:", notification.type);

      if (notification.type === 'rejected')
        navigate("/modify_exam");
      else if (notification.type === 'approved')
        navigate("/exams");
      else if (notification.type === 'pending')
        navigate("/confirm_exam");

      // Actualizează starea locală pentru a reflecta modificarea
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Elimină notificarea din lista de notificări
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.notificationId !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <Fragment>
      <div className="w-full min-h-16 bg-blue-1 flex items-center px-4  justify-end space-x-6 pr-8 sticky top-0">
        <div className="relative">
          <FaRegBell
            className={`w-8 h-8 ${notificationsButton ? "text-orange-1" : "text-white"}`}
            onClick={() => {
              toggleNotificationsButton();
            }}
          />
          {hasUnreadNotifications && (
            <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500"></div> // Bulina roșie
          )}
        </div>

        <CgProfile
          className={`w-8 h-8  ${profileButton ? "text-orange-1" : "text-white"
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
              <h1
                key={index}
                className={`text-xl ${notification.isRead ? "text-gray-500" : "text-black"}`}
                onClick={() => handleNotificationClick(notification.notificationId)} // Marcare notificare ca citită
              >
                {notification.message}
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