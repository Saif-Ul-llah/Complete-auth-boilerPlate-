const filterUserData = (user) => {
  const { password, createdAt, verification, ...filteredUser } = user;
  return filteredUser;
};

module.exports = { filterUserData };
