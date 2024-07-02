import { LoginForm } from "@/modules/auth/components/login-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  return (
    <>
      <LoginForm />
      <ToastContainer />
    </>
  );
}
