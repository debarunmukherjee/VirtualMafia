import React, {useState} from "react";
import {usePage} from "@inertiajs/inertia-react";
import {Alert} from "@material-ui/lab";
import {Inertia} from "@inertiajs/inertia";
import Authenticated from "@/Layouts/Authenticated";
import Modal from "@/Components/Modal";

export default function ViewInvites() {
    const props = usePage().props;
    const { invitesList } = props;

    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [rejectedInviteId, setRejectedInviteId] = useState(0);

    const onClickAccept = (index) => {
        Inertia.put('/invite/accept', {
            slug: invitesList[index].slug
        })
    }
    const sendRejectRequest = () => {
        Inertia.put('/invite/reject', {
            slug: invitesList[rejectedInviteId].slug
        })
    }
    const onClickReject = (index) => {
        setOpenRejectModal(true);
        setRejectedInviteId(index);
    }

    const getInvitesContent = () => invitesList.length > 0 ? (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Mafia Session
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    God
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Accept
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Reject
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {invitesList.map((listItem, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{listItem.sessionName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            <p>{listItem.godName}</p>
                                            <p className="text-xs">{listItem.godEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-blue-400">
                                        <span onClick={() => {onClickAccept(index)}} className="text-green-400 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-blue-400">
                                        <span onClick={() => {onClickReject(index)}} className="text-red-400 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal title="Reject Invite" open={openRejectModal} setOpen={setOpenRejectModal} actionText="Reject" onClickAction={sendRejectRequest} isDangerAction={true}>
                <div className="mt-4">
                    <p className="block text-base font-medium">
                        Are you sure you want to reject your invite for <span className="font-bold">{invitesList && invitesList[rejectedInviteId].sessionName}</span>?
                    </p>
                </div>
            </Modal>
        </div>
    ) : (<Alert severity="info">You have no pending invites!</Alert>);

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Game Invites</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {getInvitesContent()}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
