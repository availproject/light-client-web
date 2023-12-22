/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";

export default function Navbar({
  button,
  showButton = true,
}: {
  button: ReactNode;
  showButton?: boolean;
}) {
  return (
    <nav className="navbar bg-transparent px-4 pt-8 md:px-16 flex flex-row mb-10 lg:mb-0">
      <div className="flex-1">
        <a
          href="/"
          className="text-mono btn-ghost btn text-xl normal-case md:text-3xl"
        >
          <img
            src="/images/avail.png"
            alt="avail"
            className="max-h-[50px]"
          />
          <span className="text-mono hidden text-xl normal-case md:inline-flex md:text-2xl ml-2">
          </span>
        </a>
      </div>
      {showButton ? (
        <div className="invisible flex-none md:visible lg:visible xl:visible">
          {button}
        </div>
      ) : (
        <div className="flex-none">{button}</div>
      )}
    </nav>
  );
}