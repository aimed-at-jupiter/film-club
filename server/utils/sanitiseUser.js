function sanitiseUser(user) {
  if (!user) return null;

  const { user_id, username, email, role } = user;
  return { user_id, username, email, role };
}

module.exports = { sanitiseUser };
