import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Welcome(props) {
    return (
        <>
            <Head title="Virtual Mafia" />
            <div className="relative flex items-top justify-center min-h-screen bg-nav-blue sm:items-center sm:pt-0">
                <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                    {props.auth.user ? (
                        <Link href="/dashboard" className="text-sm text-gray-100 underline">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-sm text-gray-100 underline">
                                Log in
                            </Link>

                            <Link href={route('register')} className="ml-4 text-sm text-gray-100 underline">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Link href="/">
                            <ApplicationLogo imgWidth={'100%'} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
