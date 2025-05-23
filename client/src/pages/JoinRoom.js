"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import "../styles/Room.css"

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Set username from Firebase user if available
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.displayName || currentUser.email.split("@")[0])
    }
  }, [currentUser])

  const handleJoinRoom = () => {
    if (!username.trim()) {
      setError("Please enter your name")
      return
    }

    if (!roomId.trim()) {
      setError("Please enter a Room ID")
      return
    }

    localStorage.setItem("username", username)
    navigate(`/editor/${roomId}`)
  }

  return (
    <div className="room-page">
      <div className="home-button-container">
        <Link to="/" className="home-button">
          <i className="fas fa-home"></i>
          Home
        </Link>
      </div>
      <div className="room-container">
        <div className="room-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM16 28C9.373 28 4 22.627 4 16C4 9.373 9.373 4 16 4C22.627 4 28 9.373 28 16C28 22.627 22.627 28 16 28Z"
              fill="#6366F1"
            />
            <path
              d="M16 8C11.582 8 8 11.582 8 16C8 20.418 11.582 24 16 24C20.418 24 24 20.418 24 16C24 11.582 20.418 8 16 8ZM16 22C12.686 22 10 19.314 10 16C10 12.686 12.686 10 16 10C19.314 10 22 12.686 22 16C22 19.314 19.314 22 16 22Z"
              fill="#6366F1"
            />
            <path
              d="M16 12C13.791 12 12 13.791 12 16C12 18.209 13.791 20 16 20C18.209 20 20 18.209 20 16C20 13.791 18.209 12 16 12ZM16 18C14.895 18 14 17.105 14 16C14 14.895 14.895 14 16 14C17.105 14 18 14.895 18 16C18 17.105 17.105 18 16 18Z"
              fill="#6366F1"
            />
          </svg>
          <span>CodeCollab AI</span>
        </div>

        <motion.div
          className="room-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Enter the ROOM ID</h1>
          <p className="room-subtitle">Join an existing collaborative session</p>

          {error && <div className="room-error">{error}</div>}

          <div className="form-group">
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="ROOM ID"
              autoFocus
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USERNAME"
            />
          </div>

          <button className="room-button" onClick={handleJoinRoom}>
            JOIN
          </button>

          <div className="room-footer">
            <p>
              Don't have a room ID?{" "}
              <Link to="/create" className="new-room-link">
                New Room
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default JoinRoom

