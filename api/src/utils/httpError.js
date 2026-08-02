const sendServerError = (res, error) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

const sendWriteError = (res, error) => {
  if (error?.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "A record with those details already exists",
    });
  }

  return sendServerError(res, error);
};

module.exports = { sendServerError, sendWriteError };
