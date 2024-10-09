const BAD_REQUEST_STATUS_CODE = {
  message: "Invalid data passed to the method(s)",
  error: 400,
};
const EXISTENTIAL_STATUS_CODE = {
  message: "Requested resource NOT found",
  error: 404,
};
const DEFAULT_STATUS_CODE = {
  message: "An error has occurred on the server.",
  error: 500,
};
module.exports = {
  BAD_REQUEST_STATUS_CODE,
  EXISTENTIAL_STATUS_CODE,
  DEFAULT_STATUS_CODE,
};
