function requireUser(req, res, next) {
  if (!req.headers.authorization) {
    res.send({
      message: "You must be logged in to perform this action",
      error: "Any<String>",
      name: "Any<String>",
    });
  }
  next();
}

module.exports = {
  requireUser,
};
