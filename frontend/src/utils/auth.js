// Save token & role
export const saveAuth = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

// Get token (NEW – needed by AdminProfile)
export const getAuth = () => {
  return localStorage.getItem("token");
};

// Get role
export const getRole = () => {
  return localStorage.getItem("role");
};

// Logout (RENAMED but same behavior)
export const logoutAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};
