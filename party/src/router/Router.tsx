import { DefaultLayout } from "layout/DefaultLayout";
import { RegistrationPage } from "pages/RegistrationPage";
import { InvitationPage } from "pages/InvitationPage";
import React from "react";
import { useRoutes } from "react-router-dom";
import AdminLoginPage from "pages/admin/AdminLoginPage";
import AdminDashboardPage from "pages/admin/AdminDashboardPage";
import { RegistrationSuccessPage } from "pages/RegistrationSuccessPage";
import { MiniHomepage } from "pages/MiniHomepage";
import { LandingPage } from "pages/LandingPage";
import { LoginPage } from "pages/LoginPage";
import Second from "pages/Second";
import QRPage from "pages/QRPage";
import { Final } from "pages/Final";

export const Router = () => {
  const routes = [
    {
      path: "/",
      element: <DefaultLayout />,
      children: [{ path: "/invite/:code", element: <InvitationPage /> }],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [{ path: "/registration", element: <RegistrationPage /> }],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [{ path: "/admin/login", element: <AdminLoginPage /> }],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [{ path: "/admin/dashboard", element: <AdminDashboardPage /> }],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        { path: "/registration-success", element: <RegistrationSuccessPage /> },
      ],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "/mini-homepage/:personalNumber",
          element: <MiniHomepage />,
        },
      ],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "/landing/:code",
          element: <LandingPage />,
        },
      ],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
      ],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "/qr",
          element: <QRPage />,
        },
      ],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "/second",
          element: <Second />,
        },
      ],
    },
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          path: "/final",
          element: <Final />,
        },
      ],
    },
  ];
  return useRoutes(routes);
};
