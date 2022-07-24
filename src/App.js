import { Container, Navbar, Nav } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Product from './components/Product';
import Cart from './components/Cart';

function App() {
  return (
    <Router>

      <div className="App">
        <Container fluid>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="#home">Ecom Assignment</Navbar.Brand>
              <Nav className="me-auto">
                <Link to="/" className="nav-link">
                  Products
                </Link>
                <Link to="/cart" className="nav-link">
                  Current Cart
                </Link>
              </Nav>
            </Container>
          </Navbar>
          <Routes>
            <Route exact path='/' element={< Product />}></Route>
            <Route exact path='/cart' element={< Cart />}></Route>
          </Routes>

        </Container>
      </div>
    </Router>

  );
}

export default App;
