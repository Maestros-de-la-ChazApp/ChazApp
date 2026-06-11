"use client";

import { ReactNode } from "react";

interface ListContainerProps {
  children: ReactNode;
}

export const ListContainer = ({ children }: ListContainerProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};