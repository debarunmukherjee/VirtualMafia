import React from "react";
import {usePage} from "@inertiajs/inertia-react";

export default function GameEnded() {
    const {winner} = usePage().props;
    return (
        <div className="p-3 text-center text-2xl">
            {winner} won the game!
        </div>
    )
}
