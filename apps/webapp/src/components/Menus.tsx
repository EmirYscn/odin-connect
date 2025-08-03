import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";

import { useOutsideClick } from "../hooks/useOutsideClick";

type Position = { x: number; y: number } | null;

type MenusContextType = {
  openId: number | string;
  close: () => void;
  open: React.Dispatch<React.SetStateAction<number | string>>;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
};

type MenusProps = {
  children: React.ReactNode;
};

const MenusContext = createContext<MenusContextType | undefined>(undefined);

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState<number | string>("");
  const [position, setPosition] = useState<Position>(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

type ToggleProps = {
  id: number | string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  position?: "above" | "below";
  toggleElement?: "button" | "profile";
  elementRef?: React.RefObject<HTMLDivElement | null>;
};

function Toggle({
  id,
  children,
  icon,
  className,
  position = "below",
  toggleElement = "button",
  elementRef,
}: ToggleProps) {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }

  const { openId, close, open, setPosition } = context;

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    let rect: DOMRect | undefined;

    if (toggleElement === "profile" && elementRef?.current) {
      rect = elementRef.current.getBoundingClientRect();
    } else {
      const toggleEl = (e.target as HTMLElement).closest("button");
      if (toggleEl) rect = toggleEl.getBoundingClientRect();
    }
    if (rect) {
      setPosition({
        x: rect.left,
        y:
          position === "above"
            ? rect.top - 120 // 8px above the profile div
            : rect.bottom + 8,
      });
      if (openId === "" || openId !== id) open(id);
      else close();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full bg-none border-none p-2 hover:bg-[var(--color-brand-100)]/10 rounded-md focus:outline-none cursor-pointer ${className}`}
    >
      {children || icon || (
        <HiEllipsisVertical className="w-6 h-6 text-[var(--color-grey-700)]" />
      )}
    </button>
  );
}

type ListProps = {
  id: number | string;
  children: React.ReactNode;
  className?: string;
};

function List({ id, children, className }: ListProps) {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }
  const { openId, position, close } = context;

  const ref = useOutsideClick<HTMLUListElement>(close);

  if (openId !== id) return null;

  return createPortal(
    <ul
      className={`fixed bg-[var(--color-grey-0)]/50 shadow-xl rounded-xl w-55 z-[200] ${className} `}
      style={{
        left: position?.x,
        top: position?.y,
        minWidth: 180,
      }}
      ref={ref}
    >
      {children}
    </ul>,
    document.body
  );
}

type ButtonProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean | undefined;
  isSelected?: boolean | undefined;
  className?: string;
  shouldClose?: boolean;
};

function Button({
  children,
  icon,
  onClick,
  isSelected,
  className,
  shouldClose = true,
}: ButtonProps) {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }
  const { close } = context;

  if (!context) {
    throw new Error("Toggle must be used within a MenusProvider");
  }

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    onClick?.();
    if (shouldClose) close();
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className={`text-[var(--color-grey-800)] w-full text-left bg-none border-none px-7 py-4 text-sm flex items-center gap-4 hover:bg-[var(--color-grey-100)]/50 [&_svg]:w-[1rem] [&_svg]:h-[1rem] rounded-xl cursor-pointer ${
          isSelected ? "bg-[var(--color-brand-900)]" : ""
        } ${className}`}
      >
        {icon}
        {children && <span>{children}</span>}
      </button>
    </li>
  );
}

function Menu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex items-center ${className}`}>{children}</div>;
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
