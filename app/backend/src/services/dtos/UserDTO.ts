const regexEmail = /^\S+@\S+\.\S+$/;

const validateLogin = (email: string, password: string): boolean => {
  const validadeEmail = regexEmail.test(email);
  if (!validadeEmail) {
    return false;
  }
  if (password.length < 6) {
    return false;
  }
  return true;
};

// só pra não reclamar do default;
const validade = () => {};

export { validateLogin, validade };
