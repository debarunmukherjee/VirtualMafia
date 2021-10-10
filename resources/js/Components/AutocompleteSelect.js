import {Autocomplete} from "@material-ui/lab";
import React, {useEffect, useState} from "react";
import {Popper} from "@material-ui/core";

export default function AutocompleteSelect({ itemsList, selectedValue, itemLabelKey, setSelectedValue, placeholder, customClasses='' }) {
    const [value, setValue] = useState(selectedValue);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setInputValue(itemLabelKey ? selectedValue[itemLabelKey] : selectedValue);
        setValue(selectedValue);
    }, [selectedValue]);

    return (
        <Autocomplete
            PopperComponent={(props) => {
                return (<Popper {...props} disablePortal={true} placement='bottom-start'/>);
            }}
            getOptionSelected={(opt, val) => (itemLabelKey ? opt[itemLabelKey] === val[itemLabelKey] : opt === val)}
            className={customClasses}
            options={itemsList}
            getOptionLabel={(option) => (itemLabelKey ? option[itemLabelKey] : option)}
            value={value}
            onChange={(event, newInputValue) => {
                if (newInputValue) {
                    setSelectedValue(newInputValue);
                }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <div ref={params.InputProps.ref} className="flex flex-col relative text-gray-600">
                    <input type="search" placeholder={placeholder} {...params.inputProps} className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"/>
                    <button type="submit"
                            className="absolute right-0 top-0 mt-2 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            )}
        />
    )
}
