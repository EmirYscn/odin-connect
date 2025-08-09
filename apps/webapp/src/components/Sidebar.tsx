'use client';

import Logo from './Logo';
import Searchbar from './Searchbar';
import { RiHomeLine, RiNotification3Line } from 'react-icons/ri';
import Button from './Button';
import { IoSearch, IoSettingsOutline, IoSunny } from 'react-icons/io5';
import { MdDarkMode, MdOutlineMail } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import ProfileImage from './ProfileImage';
import { BsThreeDots } from 'react-icons/bs';
import Menus from './Menus';
import { useRef } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { useDarkMode } from '../contexts/DarkMode/ThemeContextProvider';
import { useLogout } from '../hooks/useLogout';
import { useUser } from '../hooks/useUser';
import { getServerToken } from '../lib/api/auth';
import { env } from '../lib/env';
import { Link } from 'react-router-dom';
import { useUnreadNotificationsCount } from '../hooks/useUnreadNotificationsCount';

type SidebarItem = {
  name: string;
  icon: React.ReactNode;
  href?: string;
  class?: string;
  onClick?: () => void;
  isExternal?: boolean;
};

function Sidebar() {
  const profileRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout, isPending } = useLogout();
  const { user } = useUser();
  const { count } = useUnreadNotificationsCount();

  const handleMessagesClick = async () => {
    const serverToken = await getServerToken();
    const token = btoa(JSON.stringify(serverToken));
    // console.log(
    //   `${env.messagingAppClientUrl}/checkAccountStatus?data=${token}`
    // );
    window.location.href = `${env.messagingAppClientUrl}/checkAccountStatus?data=${token}`;
  };

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Home',
      icon: <RiHomeLine />,
      href: '/home',
    },
    {
      name: 'Explore',
      icon: <IoSearch />,
      href: '/explore',
    },
    {
      name: 'Notifications',
      icon: <RiNotification3Line />,
      href: '/notifications',
    },
    {
      name: 'Messages',
      icon: <MdOutlineMail />,
      isExternal: true,
      onClick: handleMessagesClick,
    },
    {
      name: 'Profile',
      icon: <FaRegUser />,
      href: `/profile/${user?.profile?.id}`,
      class: 'hidden md:flex',
    },
    {
      name: 'Settings',
      icon: <IoSettingsOutline />,
      href: '/settings',
    },
  ];
  return (
    <div className="flex justify-center h-full gap-4 px-4 md:flex-col md:py-2 md:justify-normal">
      <div className="items-center hidden gap-4 p-2 md:flex ">
        <Logo size="xs" />
        <span className="hidden lg:block font-semibold text-xl text-[var(--color-grey-700)]">
          OdinConnect
        </span>
      </div>

      <div className="hidden lg:block">
        <Searchbar />
      </div>

      <div className="flex gap-4 p-2 shadow-sm md:flex-col md:flex-1">
        {sidebarItems.map((item) =>
          item.isExternal ? (
            <a
              key={item.name}
              onClick={item.onClick}
              className={`flex items-center text-[var(--color-grey-600)] rounded-md hover:bg-[var(--color-grey-100)]/30 cursor-pointer  ${item.class}`}
            >
              <Button icon={item.icon} className="!text-2xl" />
              <span className="hidden lg:block">{item.name}</span>
            </a>
          ) : (
            <Link
              key={item.name}
              to={item.href || '#'}
              className={`flex items-center text-[var(--color-grey-600)] rounded-md hover:bg-[var(--color-grey-100)]/30  ${item.class}`}
            >
              <Button icon={item.icon} className="!text-2xl !relative">
                {item.name === 'Notifications' && count && count > 0 && (
                  <span className="absolute top-0 px-1 text-xs text-white rounded-full right-1 bg-red-500/80">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Button>
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          )
        )}
      </div>
      <Menus>
        <Menus.Menu>
          <Menus.Toggle
            id={'user'}
            position="above"
            toggleElement="profile"
            elementRef={profileRef}
          >
            <div
              ref={profileRef}
              className="hidden items-center gap-4 px-4 py-4 md:flex shadow-lg rounded-full hover:bg-[var(--color-grey-100)]/30 cursor-pointer transition-all duration-200 ease-in-out text-[var(--color-grey-700)]"
              id="sidebarProfile"
            >
              <div className="flex justify-center w-full lg:w-auto lg:justify-start">
                <ProfileImage size="xs" imgSrc={user?.avatar} />
              </div>
              <div className="flex-col hidden lg:flex text-start">
                <span className="font-semibold">{user?.displayName}</span>
                <span className="opacity-80">@{user?.username}</span>
              </div>
              <span className="hidden ml-auto lg:flex">
                <BsThreeDots />
              </span>
            </div>
          </Menus.Toggle>
          <Menus.List id={'user'}>
            <Menus.Button
              icon={isDarkMode ? <MdDarkMode /> : <IoSunny />}
              onClick={toggleDarkMode}
              shouldClose={false}
            >
              {isDarkMode ? 'Dark Theme' : 'Light Theme'}
            </Menus.Button>
            <Menus.Button
              icon={<IoIosLogOut />}
              onClick={logout}
              disabled={isPending}
            >
              <span>Log out</span>
            </Menus.Button>
          </Menus.List>
        </Menus.Menu>
      </Menus>
    </div>
  );
}

export default Sidebar;
