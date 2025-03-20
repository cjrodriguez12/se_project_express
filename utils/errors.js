const UNAUTHORIZED_STATUS_CODE = {
  message: "Invalid data passed to the method(s)",
  error: 401,
};
const BAD_REQUEST_STATUS_CODE = {
  message: "Invalid data passed to the method(s)",
  error: 400,
};
const FORBIDDEN_STATUS_CODE = {
  message: "Forbidden to access the requested resource",
  error: 403,
};
const EXISTENTIAL_STATUS_CODE = {
  message: "Requested resource NOT found",
  error: 404,
};
const DEFAULT_STATUS_CODE = {
  message: "An error has occurred on the server.",
  error: 500,
};
const CONFLICT_STATUS_CODE = {
  message:
    "request cannot be completed because it conflicts with the current state of a resource",
  error: 409,
};
module.exports = {
  BAD_REQUEST_STATUS_CODE,
  EXISTENTIAL_STATUS_CODE,
  DEFAULT_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
};
