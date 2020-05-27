import { lazy } from 'react';

const Login = lazy(() => import('@api-auth/Login'/* webpackChunkName: "login" */));
const Logout = lazy(() => import('@api-auth/Logout'/* webpackChunkName: "logout" */));
const ConfirmEmail = lazy(() => import('@api-auth/ConfirmEmail'/* webpackChunkName: "confirmemail" */));
const ForgotPassword = lazy(() => import('@api-auth/ForgotPassword'/* webpackChunkName: "forgotpassword" */));
const ResetPassword = lazy(() => import('@api-auth/ResetPassword'/* webpackChunkName: "resetpassword" */));
const Register = lazy(() => import('@api-auth/Register'/* webpackChunkName: "register" */));
const AdminIndex = lazy(() => import('@components/Admin'/* webpackChunkName: "admin" */));
const AccountIndex = lazy(() => import('@components/Account'/* webpackChunkName: "account" */));

export {
  Login,
  Logout,
  ConfirmEmail,
  ForgotPassword,
  ResetPassword,
  Register,
  AdminIndex,
  AccountIndex
}
