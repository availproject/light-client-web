/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";

export default function Navbar({
  button,
  networkSwitcher,
  showButton = true,
}: {
  button: ReactNode;
  networkSwitcher: ReactNode;
  showButton?: boolean;
}) {
  return (
    <nav className="navbar bg-transparent pt-8 md:px-16 mb-10 lg:mb-0">
      <div className="flex flex-row items-center justify-between px-4">
        <div className="">
          {" "}
          <img src="/images/availlogo.png" alt="" className="max-h-[40px]" />
        </div>
        <div className="flex flex-row items-center space-x-4">{networkSwitcher} <div className="hidden md:flex">{button}</div></div>
      </div>
      {!showButton && (
        <div className="flex-none">{button}</div>
      )}
    </nav>
  );
}
