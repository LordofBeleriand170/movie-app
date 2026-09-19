import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: "7d",
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // in seconds
    path: "/",
  });

  return token;
};

export default generateTokenAndSetCookie;
