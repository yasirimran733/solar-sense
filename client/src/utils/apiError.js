/**
 * Normalize axios / fetch errors into a user-facing string.
 */
export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const msg = error?.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  const err = error?.response?.data?.error;
  if (typeof err === "string" && err.trim()) return err;
  if (typeof error?.message === "string" && error.message.includes("Network")) {
    return "Network error. Check your connection and API URL.";
  }
  return fallback;
}
