import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import SignIn from './pages/SignIn';
import LogIn from './pages/LogIn';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import Nav from './components/Nav';
import MyRecipes from './pages/MyRecipes';
import MyFollowers from './pages/MyFollowers';
import MyFollowing from './pages/MyFollowing';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="/my-followers" element={<MyFollowers />} />
        <Route path="/my-following" element={<MyFollowing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="*" element={<>404 Page not found</>} />
      </Routes>
    </Router>
  );
}

export default App;
