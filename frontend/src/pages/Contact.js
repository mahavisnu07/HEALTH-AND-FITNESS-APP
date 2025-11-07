import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import "./Pages.css";

function Contact() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    const res = await fetch("http://localhost:5000/api/contact");
    const data = await res.json();
    setMessages(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message: text }),
    });
    setName("");
    setEmail("");
    setText("");
    fetchMessages();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/contact/${id}`, { method: "DELETE" });
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="page-container">
      <h2>Queries 🎫</h2>
      <form onSubmit={handleSubmit} className="form-section">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button className="btn" type="submit">
          Send
        </button>
      </form>

      <ul className="list-section">
        {messages.map((m) => (
          <li key={m.id}>
            <strong>{m.name}</strong> ({m.email}): {m.message}
            <button
              className="delete-btn"
              onClick={() => handleDelete(m.id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Contact;
