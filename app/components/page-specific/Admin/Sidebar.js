import Link from "next/link";
import { FaUsers, FaBook, FaPlusCircle, FaEnvelope } from "react-icons/fa";

const Sidebar = () => (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
        <div className="p-4 font-bold text-xl">Admin Dashboard</div>
        <nav className="flex-1">
            <ul>
                <li className="p-4 hover:bg-gray-700">
                    <Link href="/dashboard/admin/users">
                        <span className="flex items-center space-x-2 cursor-pointer">
                            <FaUsers />
                            <span>Manage Users</span>
                        </span>
                    </Link>
                </li>
                <li className="p-4 hover:bg-gray-700">
                    <Link href="/dashboard/admin/bookings">
                        <span className="flex items-center space-x-2 cursor-pointer">
                            <FaBook />
                            <span>Manage Bookings</span>
                        </span>
                    </Link>
                </li>                
                <li className="p-4 hover:bg-gray-700">
                    <Link href="/dashboard/admin/contact-us">
                        <span className="flex items-center space-x-2 cursor-pointer">
                            <FaEnvelope />
                            <span>Contact Us Requests</span>
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    </div>
);

export default Sidebar;
