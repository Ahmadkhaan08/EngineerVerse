import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Define and export the provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const localData = localStorage.getItem('User');
    try {
      return localData ? JSON.parse(localData) : null; // Parse if exists, else null
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
      return null; // Return null in case of error
    }
  });

  useEffect(() => {
    console.log("UserData: ",userData)
    console.log("Again");
    // Fetch user data from the API if not present in context
    const fetchUserData = async () => {
      if (!userData) {
        const userId = localStorage.getItem('_id'); // Retrieve user ID from localStorage
        if (userId) {
          try {
            const response = await axios.get(`http://localhost:8000/api/v1/users/${userId}`);
            setUserData(response.data.data.user); // Set user data from the API
            localStorage.setItem('User', JSON.stringify(response.data.data.user)); // Store user data in localStorage
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const setUser = (data) => {
    setUserData(data);
    localStorage.setItem('User', JSON.stringify(data)); // Save user data to localStorage whenever it's updated
  };

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Export the hook to consume the context
export const useUserContext = () => {
  return useContext(UserContext);
};
