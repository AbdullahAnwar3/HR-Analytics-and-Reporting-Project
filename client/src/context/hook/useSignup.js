import { useState } from "react";
import { useAuthorize } from "./useAuthorization";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthorize();

    const signup = async (email, fname, lname, salary, occupation) => {
        setIsLoading(true);
        setError(null);

        const result = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({email, password: 'hassan', fname, lname, salary, occupation}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            // Saving web tokens and user info to local storage
            localStorage.setItem('user', JSON.stringify(resultJson));

            // Updating user authorization
            dispatch({type: 'LOGIN', payload: resultJson})

            setIsLoading(false)
            // setError(null);
            // setBlankFields([]);
            // setTitle('');
            // setDescript('');
            // setWebsite('')
            // console.log("New course added: ",resultJson);

        }
        else
        {
            setIsLoading(false);
            setError(resultJson.error);
        }
    }

    return {signup, isLoading, error};
}