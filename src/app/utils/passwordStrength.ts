export const getStrength = (pass: string) => {
  let strength = 0;
  if (pass.length >= 6) strength++;
  if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
  if (pass.match(/[\d]/)) strength++;
  if (pass.match(/[^a-zA-Z\d]/)) strength++;

  return strength;
};
