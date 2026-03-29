import { toast } from "react-toastify";

export function notifySuccess(message) {
  toast.success(message);
}

export function notifyError(message) {
  toast.error(message);
}

export function notifyInfo(message) {
  toast.info(message);
}
