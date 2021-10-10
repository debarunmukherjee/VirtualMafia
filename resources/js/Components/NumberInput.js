import React from "react";

export default function NumberInput({ value, setValue, elementId = '', placeholder, customClasses= '', disabled= false }) {
    return (
        <input
            type="number"
            disabled={disabled}
            id={elementId}
            className={`w-auto focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded sm:text-sm border-gray-300 ${disabled ? 'cursor-not-allowed' : ''} ${customClasses}`}
            placeholder={placeholder}
            value={Number(value).toString()}
            onChange={(e) => {
                let num = e.target.value;
                if (num === '') {
                    num = 0;
                } else {
                    num = parseInt(num);
                }
                if (num < 0) {
                    num = 0;
                }
                if (Number.isInteger(num)) {
                    setValue(num);
                }
            }}
        />
    )
}
