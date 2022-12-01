import React, { useEffect, useState } from 'react'
import { auth, userExists } from '../utils/firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function AuthProvider({ 
    children, 
    onUserLoggedIn, 
    onUserNotLoggedIn,
    onUserNotRegistered
}) {
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const isRegistered = await userExists(user.uid);
                if (isRegistered) {
                    onUserLoggedIn(user);
                } else {
                    onUserNotRegistered(user);
                }
            } else {
                onUserNotLoggedIn();
            }
        });
    }, [navigate, onUserLoggedIn,onUserNotRegistered,onUserNotLoggedIn]);
    return <div>{children}</div>
}