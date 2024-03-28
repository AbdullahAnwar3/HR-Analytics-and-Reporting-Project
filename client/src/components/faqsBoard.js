import React, { useState, useEffect} from "react";

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/courses.css'
import '../styles/faqs.css'

// Importing icon images to be used in course cards
import no_record_icon from './Images/Record/no-record-img.png'

// Date formatting
import {format} from "date-fns";

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";

const FaqsBoard = (prop)=>{
    
    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [faqs, setFaqs] = useState(null);
    const [faqsExist, setExist] = useState(true);

    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {
        const fetchFaqs = async () => {
            const result = await fetch('/api/faqs/', {
                headers: {
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });
    
            // Parsing json results as array of objects.
            const resultJson = await result.json();
    
            if (result.ok)
            {
                setFaqs(resultJson);
                if(resultJson.length !== 0)
                    setExist(true);
                else
                    setExist(false);

            }

            console.log(resultJson);
        }
           
        if(userAccount && userAccount.occupation === 'employee')
            fetchFaqs();
            
    }, [userAccount]);

    return (   
        <div className="faqspage">

            {/* Main Nav Bar */}
            <NavMenu breadcrum="FAQS" pagePath="/faqs"/>
            
            {/* Faq Cards */}
            <div className="faq-management faq-access">
                <div className="faqs">
                    {!faqsExist && 
                        <div className="no-faqs no-faqs-view">
                            <img src={no_record_icon} alt="Record None" />
                            <h2>No Questions Available</h2>
                        </div>
                    }
                    {faqs && faqs.map((faq) => (
                        <div key={faq._id} className="faq-card">
                            <div className="faq-card-content-wrapper">
                                <h2>{faq.question}</h2>
                                <p>{faq.answer}</p>
                            </div>
                            <div className="faq-card-date-wrapper">
                                <div className="faq-card-date">
                                    {format(new Date(faq.createdAt), "dd/MM/yyyy")}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default FaqsBoard