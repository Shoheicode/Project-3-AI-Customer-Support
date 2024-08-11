import {auth} from "@/app/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) =>{
    return createUserWithEmailAndPassword(auth, email, password);
}
export const doSignInWithEmailAndPassword = () =>{
    return signInWithEmailAndPassword(auth, email, password);
}

export const doSignOut = () => {
    return auth.signOut();
}

export const doPasswordReset = (email) =>{
    return sendPasswordResetEmail(auth, email)
}

export const doPassowrdChange = (password) =>{
    updatePassword(auth.currentUser, password);
}

