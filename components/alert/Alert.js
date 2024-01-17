import { default as SwalBootstrap } from "./SwalBootstrap";

export const successAlertNotification = (title, text) => {
  return SwalBootstrap.fire({
    icon: "success",
    title: title,
    text: text,
    showConfirmButton: true,
    showDenyButton: false,
  });
};
