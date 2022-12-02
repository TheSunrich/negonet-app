import React, { useEffect, useState } from 'react'
import { auth, registerNewUser, existsUser } from '../utils/firebase';
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
                const isRegistered = await existsUser(user.email);
                if (isRegistered) {
                    onUserLoggedIn(user);
                } else {
                    await registerNewUser({
                        uid: user.uid,
                        imageUrl: '',
                        email: '',
                        processCompleted: false
                    });
                    onUserNotRegistered(user);
                }
            } else {
                onUserNotLoggedIn();
            }
        });
    }, [navigate, onUserLoggedIn,onUserNotRegistered,onUserNotLoggedIn]);
    return <div>{children}</div>
}