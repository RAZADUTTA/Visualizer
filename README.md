# Application Layer Protocol Visualizer

## Computer Networks — Application Layer

This project is an interactive web dashboard that visualizes common Application Layer protocols through three activities:

- Web Browsing
- Email
- Video Streaming

The dashboard uses a dual-panel interface. The left panel contains the user activities, while the right panel visualizes the underlying protocol messages.

---

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- Visual Studio Code

---

## Protocols Demonstrated

### 1. Web Browsing

The browsing simulation demonstrates:

DNS Query  
→ DNS Response  
→ HTTP GET Request  
→ HTTP 200 Response

### 2. Email

The mail simulation demonstrates an SMTP conversation including:

EHLO  
→ 250 Response  
→ MAIL FROM  
→ RCPT TO  
→ DATA  
→ 354 Response  
→ Message  
→ 250 Response  
→ QUIT  
→ 221 Response

### 3. Video Streaming

The streaming simulation demonstrates:

DNS Query  
→ DNS Response  
→ HTTP Manifest Request  
→ HTTP Manifest Response  
→ Segment Requests  
→ Segment Responses

---

## Features

- Dual-panel dashboard
- Browsing, Mail and Streaming activities
- DNS, HTTP and SMTP visualization
- Client-to-server and server-to-client directions
- Step-by-step protocol visualization
- Previous and Next controls
- Pause and Resume
- Replay
- Activity log
- Streaming quality selection
- Responsive web interface

---

## Project Structure

```text
Assignment/
│
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
├── docs/
│   ├── AI_USAGE_LOG.md
│   └── REFLECTION.md
│
└── screenshots/
```
