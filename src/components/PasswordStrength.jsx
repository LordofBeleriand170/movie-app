import { getStrength } from "@/app/utils/passwordStrength";
import { X, Check } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    {
      label: "Password is at least long 6 letters",
      met: password.length >= 6,
    },
    {
      label: "Password has lowercase and uppercase letter",
      met: password.match(/[a-z]/) && password.match(/[A-Z]/),
    },
    {
      label: "Password has number",
      met: password.match(/[\d]/),
    },
    { label: "Password has sign", met: password.match(/[^a-zA-Z\d]/) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          <span className={`${item.met ? "text-green-500" : "text-gray-500"}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const strengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";

    return "Excellent";
  };

  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    else if (strength === 1) return "bg-red-400";
    else if (strength === 2) return "bg-yellow-500";
    else if (strength === 3) return "bg-yellow-400";

    return "bg-green-500";
  };

  const strength = getStrength(password);

  return (
    <div className="mt-2">
      <div className="w-full flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">{strengthText(strength)}</span>
      </div>
      <div className="w-full flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 ${
              index < strength ? getColor(strength) : "bg-gray-500"
            }`}
          />
        ))}
      </div>
      <div>
        <PasswordCriteria password={password} />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
