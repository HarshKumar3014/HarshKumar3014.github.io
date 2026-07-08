import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ModeSelect from './pages/ModeSelect';
import World from './pages/World';
import OS from './pages/OS';
import Home from './pages/Home';
import Archive from './pages/Archive';
import PageNotFound from './lib/PageNotFound';

// React Router keeps scroll position across navigations; reset it per page.
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

// Public portfolio — no auth gate, no backend dependency.
function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<ModeSelect />} />
                <Route path="/standard" element={<Home />} />
                <Route path="/world" element={<World />} />
                <Route path="/os" element={<OS />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
