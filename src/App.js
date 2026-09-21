import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './component/Header/Header';
import Home from './component/Home/Home';
import CardDetail from './component/Card/CardDetail'
import Checkout from './component/Checkout/Checkout';
import Tracking from './component/Tracking/Tracking';
import Offers from './component/Pages/Offers';
import About from './component/Pages/About';
import Contact from './component/Pages/Contact';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import NotFound from './component/NotFound/NotFound';
import Footer from './component/Footer/Footer';

//react router
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Header />

      <main className="app-main">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<CardDetail />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order-tracking' element={<Tracking />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
