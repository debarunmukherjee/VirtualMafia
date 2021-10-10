import React from "react";
import {Alert} from "@mui/material";

export default function UserInviteList({userList}) {
    return userList && userList.length > 0 ? (
        <ul className="shadow-md p-3 max-h-72 overflow-scroll mt-6 border border-gray-300">
            {userList.map((user) => {
                let pillClass = "rounded-full py-0.5 px-2 text-sm text-white inline-block";
                if (user.status === 'Pending') {
                    pillClass += " bg-blue-600";
                } else if (user.status === 'Accepted') {
                    pillClass += " bg-green-600";
                } else {
                    pillClass += " bg-red-600";
                }
                return (
                    <li key={user.email} className="flex invite-list-br-1:flex-row md:flex-col invite-list-br-2:flex-row flex-col mt-6 rounded-md p-3 border border-gray-300 shadow-md items-center">
                        <div className="ml-2">
                            <img src="https://via.placeholder.com/300" alt="User Profile Image" className="rounded-full h-10 w-10 max-w-min"/>
                        </div>
                        <div className="w-40 invite-list-br-1:text-left md:text-center invite-list-br-2:text-left text-center invite-list-br-1:ml-6 md:ml-0 invite-list-br-2:ml-6 ml-0">
                            {user.status === 'Accepted' ? (<div className="text-lg">{user.fullname}</div>) : ''}
                            <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                        <div className="mx-auto">
                            <div className={pillClass}>{user.status}</div>
                            {user.status === 'Rejected' ? (
                                <div className="lg:inline-block invite-list-br-1:block inline-block text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 inline-block cursor-pointer text-blue-400 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                            ) : ''}
                        </div>
                    </li>
                )
            })}
        </ul>
    ) : (<Alert severity="info" className="mt-6">No user is added.</Alert>);
}
