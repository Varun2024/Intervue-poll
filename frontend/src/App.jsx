import './index.css'
import Home from './components/Home'
import CreatePollPage from './components/TeacherQ'
import { Route , Routes , Router } from 'react-router-dom'
import LivePollResults from './components/LivePolls'
import IntervuePoll from './components/StudentHome'
import Vote from './components/StudentVote'
import ChatIcon from './components/ChatIcon'


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-poll" element={<CreatePollPage />} />
      <Route path="/live-polls" element={<LivePollResults />} />
      <Route path="/student-home" element={<IntervuePoll />} />
      <Route path="/student-vote" element={<Vote />} />
    </Routes>
    <ChatIcon />
    </>
  )
}

export default App
