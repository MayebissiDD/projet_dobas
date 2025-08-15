import { toast as notify, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toast = notify;
export const ToastProvider = ToastContainer;
