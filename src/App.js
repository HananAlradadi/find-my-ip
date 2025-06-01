import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FindMyIp from './components/FinMyIp'
function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<FindMyIp />} />
        </Routes>
     
    </Router>
  );
}

export default App;
