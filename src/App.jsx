import routes from './config/routes';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthProvider from "./providers/AuthProvider";
import "./App.scss"
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => (
                <Route 
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={<route.component />}
                />
          ))}
        </Routes>
      </Router>
    </AuthProvider> 

  );
}

export default App
