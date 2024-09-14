export const validateEmail = (email, allowEmpty = false) => {
  if (allowEmpty && email.length === 0) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
