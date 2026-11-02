import { toast } from "react-toastify";

const defaultStyle = {
  background: "#121212",
  color: "#ffffff",
  border: "1px solid #2a2a2a",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
};

export const showToast = (status, message) => {
  if (status === "success") {
    toast.success(message, {
      style: defaultStyle,
      iconTheme: {
        primary: "#22c55e",
        secondary: "#ffffff",
      },
    });
  } else {
    toast.error(message, {
      style: defaultStyle,
      iconTheme: {
        primary: "#E50914",
        secondary: "#ffffff",
      },
    });
  }
};