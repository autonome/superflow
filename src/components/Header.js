import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Header = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full flex  justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial ml-5">
        <a href="/">
          <img src="assets/blockticket.png" className="w-16" />
        </a>
      </div>
      <ul className="ml-20 text-white md:flex  hidden list-none desc opacity-50 flex-row justify-between items-center">
        {["Litepaper", "Guide", "How to use", "Contact"].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}

        <li className="bg-black hidden md:block text-white py-2 px-7 mx-4 cursor-pointer heading hover:bg-primary hover:bg-black">
          CONNECT WALLET
        </li>
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-0 p-3 w-full h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end black-glassmorphism text-white animate-slide-in desc"
          >
            <li className="text-3xl mb-10 mt-5 my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => (
                <NavBarItem
                  key={item + index}
                  title={item}
                  classprops="my-2 text-lg"
                />
              )
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Header;
