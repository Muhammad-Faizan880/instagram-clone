import React from "react";
import {
  Home,
  Search,
  Compass,
  Clapperboard,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
} from "lucide-react";

const items = [
  { name: "Home", icon: <Home size={24} /> },
  { name: "Search", icon: <Search size={24} /> },
  { name: "Explore", icon: <Compass size={24} /> },
  { name: "Reels", icon: <Clapperboard size={24} /> },
  { name: "Messages", icon: <MessageCircle size={24} /> },
  { name: "Notifications", icon: <Heart size={24} /> },
  { name: "Create", icon: <PlusSquare size={24} /> },
  { name: "Profile", icon: <User size={24} /> },
];

const Sidebar = () => {
  return (
    <div className="h-full w-full">
      <div className="text-xl font-bold mb-6">Instagram</div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded cursor-pointer"
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;


