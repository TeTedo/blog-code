import React from "react";

import { useRoutes } from "react-router";
import { Home } from "./Home";
import { ReactMemo } from "./reactMemo/ReactMemo";
import { UseCallback } from "./useCallback/UseCallback";
import { UseMemo } from "./useMemo/UseMemo";

export const Router = () => {
  const routes = [
    {
      path: "/",
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/react-memo",
          element: <ReactMemo />,
        },
        {
          path: "/useMemo",
          element: <UseMemo />,
        },
        {
          path: "/useCallback",
          element: <UseCallback />,
        },
      ],
    },
  ];

  return useRoutes(routes);
};
