import React from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={
                active
                    ? 'inline-flex items-center px-1 pt-1 border-b-4 border-blue-400 text-sm font-medium leading-5 text-gray-50 focus:outline-none focus:border-blue-700 transition duration-150 ease-in-out'
                    : 'inline-flex items-center px-1 pt-1 border-b-4 border-transparent text-sm font-medium leading-5 text-gray-100 hover:text-gray-300 hover:border-gray-200 focus:outline-none focus:text-gray-200 focus:border-gray-300 transition duration-150 ease-in-out'
            }
        >
            {children}
        </Link>
    );
}
