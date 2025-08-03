"use client";

import Button from "./Button";
import Logo from "./Logo";

import { FaRegUser } from "react-icons/fa";

function Header() {
  return (
    <div className="flex items-center px-4 py-2 gap-10 bg-[var(--color-grey-0)]/20">
      <div className="flex items-center gap-2 flex-1">
        <Button icon={<FaRegUser />} className="!text-2xl" />
      </div>
      <div className="flex-1 flex justify-center">
        <Logo size="xs" />
      </div>
      <div className="flex-1" />
    </div>
  );
}

export default Header;
