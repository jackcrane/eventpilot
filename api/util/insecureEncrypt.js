import CryptoJS from "crypto-js";

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(
    data,
    "p9syfd8asd9fa8psd9fy8asdp9fgy8ads",
  ).toString();
};

export const decrypt = (data) => {
  return CryptoJS.AES.decrypt(
    data,
    "p9syfd8asd9fa8psd9fy8asdp9fgy8ads",
  ).toString(CryptoJS.enc.Utf8);
};
