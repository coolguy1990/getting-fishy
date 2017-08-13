import React from 'react';
import Header from './components/Header';
import Order from './components/Order';
import Inventory from './components/Inventory';

class App extends React.Component {
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="testing 1..2...3"/>
        </div>
        <Order />
        <Inventory />
      </div>
    );
  }
}

export default App;