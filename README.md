# Intervue Poll

**A real-time polling system for live feedback — teachers create polls and students vote instantly.**

##  Overview

Intervue Poll is a **real-time polling web app**, ideally suited for interactive classroom environments. Teachers can create timed polls, students can join rooms and vote live, and results are displayed instantly. It's built for speed, simplicity, and scalability using modern web technologies.
Preview: https://intervue-poll.web.app/
##  Features

### Teacher (Host) Features
- Create polls with customizable options and voting timer.
- View live poll results as students vote.
- Review poll history for past sessions.
- Remove ("kick") participants from a poll room.

### Student (Participant) Features
- Join a teacher’s poll room using a code/link.
- Vote in real time within the poll duration.
- Get redirected to a "kicked out" page if the teacher removes you.

##  Tech Stack
- **React** (frontend UI) powered by **Vite** for fast development and hot reload.
- **Socket.IO** for real-time, bidirectional communication.
- **Tailwind** for responsive and sleek styling.
- **Session Storage** for lightweight session management.

##  Getting Started

### Prerequisites
Make sure you have:
- **Node.js** (e.g., v22.5.1 is confirmed to be compatible),
- **npm** package manager installed.

## Usage

### As a teacher, start a poll:
Define poll options and set a countdown timer.
Share the room link with students.
Monitor votes as they come in and view results in real-time.
Optionally review past polls in the Poll History panel.

### As a student, participate:
Enter the room code or click the shared link.
View poll options and cast your vote.
See results update live; if you're removed by the teacher, you'll be redirected to a specific page.

