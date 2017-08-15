import React from 'react';
import AddFishForm from './AddFishForm';
import firebase from 'firebase';
import PropTypes from 'prop-types';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: null,
            owner: null
        };
    }

    componentDidMount() {
        const that = this;
        firebase.auth().onAuthStateChanged((user) => {
            const result = {};
            result.user = user;
            that.authHandler(null, result);
        });
    }

    handleChange(event, key){
        const fish = this.props.fishes[key];

        const updatedFish = {
            ...fish,
            [event.target.name]: [event.target.value]
        };

        this.props.updateFish(key, updatedFish);
    }

    authenticate(provider) {
        if (provider === 'facebook') {
            const fbProvider = new firebase.auth.FacebookAuthProvider();
            fbProvider.setCustomParameters({
                display: 'popup'
            });
            const that = this;
            firebase.auth().signInWithPopup(fbProvider).then(function(result) {
                that.authHandler(null, result);
            }).catch(function(err) {
                console.warn(err);
                return;
            });
        } else if (provider === 'twitter') {
            const twProvider = new firebase.auth.TwitterAuthProvider();
            const that = this;
            firebase.auth().signInWithPopup(twProvider).then(function(result) {
                that.authHandler(null, result);
            }).catch(function(err) {
                console.warn(err);
                return;
            });
        } else if (provider === 'github') {
            const gitProvider = new firebase.auth.GithubAuthProvider();
            const that = this;
            firebase.auth().signInWithPopup(gitProvider).then(function(result) {
                that.authHandler(null, result);
            }).catch(function(err) {
                console.warn(err);
                return;
            });
        }
    }

    logout() {
        const that = this;
        firebase.auth().signOut().then(function () {
            that.setState({ uid: null });
        });
    }

    authHandler(err, authData) {
        if (err) {
            console.warn(err);
            return;
        }

        const storeRef = firebase.database().ref(this.props.storeId);
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            if (authData && authData.user) {
                if (!data.owner) {
                    storeRef.set({
                        owner: authData.user.uid
                    });
                }

                this.setState({
                    uid: authData.user.uid,
                    owner: data.owner || authData.user.uid
                });
            }
        });
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage you store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
            </nav>
        );
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];

        return (
            <div className="fish-edit" key={key}>
                <input onChange={(e) => this.handleChange(e, key)} type="text" name="name" value={fish.name} placeholder="Fish Name"/>
                <input onChange={(e) => this.handleChange(e, key)} type="text" name="price" value={fish.price} placeholder="Fish Price"/>
                <select onChange={(e) => this.handleChange(e, key)} name="status" value={fish.status}>
                    <option value="available">Fresh!!</option>
                    <option value="unavailable">Sold Out!!</option>
                </select>
                <textarea onChange={(e) => this.handleChange(e, key)} type="text" name="desc" value={fish.desc} placeholder="Fish Desc"></textarea>
                <input onChange={(e) => this.handleChange(e, key)} type="text" name="image" value={fish.image} placeholder="Fish Image"/>
                <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        );
    }

    render() {
        const logout = <button onClick={() => this.logout()}>Log Out!!</button>;

        if (!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry you are not the owner of this store!!</p>
                    {logout}
                </div>
            )
        }

        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                {
                    Object
                        .keys(this.props.fishes)
                        .map(this.renderInventory)
                }
                <AddFishForm addFish={this.props.addFish}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        );
    }
}

Inventory.propTypes = {
    storeId: PropTypes.string.isRequired
};

export default Inventory;