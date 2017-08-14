import React from 'react';
import Header from './components/Header';
import Order from './components/Order';
import Inventory from './components/Inventory';
import sampleFishes from './sample-fishes';
import Fish from './components/Fish';
import base from './utils/firebase';

class App extends React.Component {
  constructor() {
    super();
    this.addFish = this.addFish.bind(this);
    this.loadFishes = this.loadFishes.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.state = {
      fishes: {},
      order: {}
    };
  }

  addFish(fish) {
    const fishes = {...this.state.fishes};

    const timestamp = Date.now();

    fishes[`fish-${timestamp}`] = fish;

    this.setState({ fishes });
  }

  loadFishes() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;

    this.setState({order});
  }

  componentWillMount() {
    this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish 
                  key={key} 
                  index={key}
                  details={this.state.fishes[key]} 
                  addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} />
        <Inventory addFish={this.addFish} loadSamples={this.loadFishes} />
      </div>
    );
  }
}

export default App;