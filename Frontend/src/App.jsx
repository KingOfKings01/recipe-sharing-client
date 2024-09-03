import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import LogIn from './pages/LogIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RecipeForm from './pages/RecipeFrom';
import RecipeDetails from './pages/RecipeDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Default route */}  
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe-form" element={<RecipeForm />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="*" element={<>404 Page not found</>} />

      </Routes>
    </Router>
  );
}

export default App;