const calculateAge = (birthDate) => {
  // Treat "TRANSFER_WINDOW_START" as the
  // date Summer Transfer Window Opened (2023/2024 Season)
  const TRANSFER_WINDOW_START = new Date('2023-06-14');
  let age = TRANSFER_WINDOW_START.getFullYear() - birthDate.getFullYear();
  const m = TRANSFER_WINDOW_START.getMonth() - birthDate.getMonth();
  if (
    m < 0 ||
    (m === 0 && TRANSFER_WINDOW_START.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export default calculateAge;
