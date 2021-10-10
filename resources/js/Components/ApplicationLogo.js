import React from 'react';
import Logo from './Logo.svg';

export default function ApplicationLogo({ imgWidth }) {
    return (
        <img src={Logo} alt="logo" style={{width: imgWidth}}/>
    );
}
