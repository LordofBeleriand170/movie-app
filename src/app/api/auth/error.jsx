import { useSearchParams } from "next/navigation";

export default function ErrorLoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let message = "Unknown error occurred.";

  if (error === "OAuthAccountNotLinked") {
    message = "This email is already registered. Please use email & password.";
  } else if (error === "EmailAlreadyRegistered") {
    message = "Google login not allowed. Use credentials login instead.";
  } else if (error === "User not verified") {
    message = "Please verify your email before logging in.";
  } else if (error === "account_link_conflict") {
    message = "This email is already linked to a credentials-based account.";
  } else if (error === "Callback") {
    message = "There was an error during the sign-in process.";
  }

  return (
    <div className="text-center mt-10 te`xt-red-600 text-lg">
      <p>{message}</p>
    </div>
  );
}
