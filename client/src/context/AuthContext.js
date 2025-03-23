"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setAuthError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      console.error("Signup error:", error)
      setAuthError(formatAuthError(error))
      throw error
    }
  }

  // Login with email and password
  const login = async (email, password) => {
    try {
      setAuthError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      console.error("Login error:", error)
      setAuthError(formatAuthError(error))
      throw error
    }
  }

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setAuthError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (error) {
      console.error("Google login error:", error)
      setAuthError(formatAuthError(error))
      throw error
    }
  }

  // Login with GitHub
  const loginWithGithub = async () => {
    try {
      setAuthError(null)
      const provider = new GithubAuthProvider()
      // Add scopes for GitHub OAuth
      provider.addScope("user:email")

      const result = await signInWithPopup(auth, provider)
      return result
    } catch (error) {
      console.error("GitHub login error:", error)
      setAuthError(formatAuthError(error))
      throw error
    }
  }

  // Format authentication errors for better user experience
  const formatAuthError = (error) => {
    const errorCode = error.code

    switch (errorCode) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password"
      case "auth/email-already-in-use":
        return "Email is already in use"
      case "auth/weak-password":
        return "Password is too weak"
      case "auth/invalid-email":
        return "Invalid email address"
      case "auth/account-exists-with-different-credential":
        return "An account already exists with the same email address but different sign-in credentials"
      case "auth/popup-closed-by-user":
        return "Authentication cancelled. Please try again."
      case "auth/cancelled-popup-request":
        return "Authentication cancelled. Please try again."
      case "auth/popup-blocked":
        return "Authentication popup was blocked. Please allow popups for this site."
      default:
        return error.message || "An error occurred during authentication"
    }
  }

  // Logout
  const logout = () => {
    return signOut(auth)
  }

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    authError,
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

