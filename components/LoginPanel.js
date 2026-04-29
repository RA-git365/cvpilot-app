"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../lib/firebase";

export default function LoginPanel({ user }) {
  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Google");
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  const loginLinkedIn = () => {
    alert("LinkedIn login setup required in Firebase / OAuth app");
  };

  const logout = async () => {
    await signOut(auth);
    alert("Logged out");
  };

  if (user) {
    return (
      <div className="cvp-login-card cvp-login-card-auth cvp-login-compact">
        <div style={styles.userInfo}>
          <img
            src={user.photoURL || "https://via.placeholder.com/48"}
            alt="profile"
            style={styles.avatar}
          />
          <div style={styles.userText}>
            <span style={styles.kicker}>Signed in</span>
            <strong style={styles.title}>{user.displayName || "CVPilot Member"}</strong>
            <p style={styles.sub}>{user.email}</p>
          </div>
        </div>

        <div style={styles.authActions}>
          <span style={styles.invoice}>Invoice email ready</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cvp-login-card cvp-login-compact">
      <div style={styles.userInfo}>
        <div style={styles.guestIcon}>CV</div>
        <div style={styles.userText}>
          <span style={styles.kicker}>Account</span>
          <strong style={styles.title}>Login for paid packs</strong>
          <p style={styles.sub}>Free templates work without login.</p>
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button onClick={loginGoogle} style={styles.googleBtn}>
          Google
        </button>
        <button onClick={loginLinkedIn} style={styles.linkedinBtn}>
          LinkedIn
        </button>
      </div>
    </div>
  );
}

const styles = {
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  userText: {
    minWidth: 0,
  },
  guestIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg,#2563eb,#0f766e)",
    color: "#fff",
    fontWeight: 900,
    flexShrink: 0,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    objectFit: "cover",
    flexShrink: 0,
  },
  kicker: {
    display: "block",
    marginBottom: 3,
    color: "#2563eb",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  title: {
    display: "block",
    color: "#0f172a",
    fontSize: 17,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  sub: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.35,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  buttonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 9,
    marginTop: 12,
  },
  authActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
  },
  invoice: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: 900,
  },
  googleBtn: {
    width: "100%",
    minHeight: 40,
    borderRadius: 10,
    border: "1px solid #dbe4f0",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 900,
  },
  linkedinBtn: {
    width: "100%",
    minHeight: 40,
    borderRadius: 10,
    border: "none",
    background: "#0a66c2",
    color: "#ffffff",
    fontWeight: 900,
  },
  logoutBtn: {
    minHeight: 38,
    padding: "0 14px",
    borderRadius: 10,
    border: "none",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: 900,
    flexShrink: 0,
  },
};
