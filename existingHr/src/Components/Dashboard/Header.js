import React from 'react'
import devsinc_logo from '../Assets/Devsinc_logo.png'
import './Dashboard.module.css';


function Header({ setIsAdding }) {
    return (
        <>
            <div className="realLogo-container">
                <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
            </div>             

            <header>
            <h1 style={{ color: 'white' }}>Employee Management Software</h1>
                <div style={{ marginTop: '30px', marginLeft: '0px',marginBottom: '18px' }}>
                    <button onClick={() => setIsAdding(true)} className='round-button'>Add Button</button>
                </div>
            </header>
        </>
    )
}

export default Header
