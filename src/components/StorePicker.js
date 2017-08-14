import React from 'react';
import { getFunName } from '../utils/helpers';

class StorePicker extends React.Component {
    goToStore(event) {
        event.preventDefault();
        const storeId = this.storeInput.value;
        this.props.history.push(`/store/${storeId}`);
    }

    render() {
        return (
            <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
                <h2>Please enter A Store</h2>
                <input 
                    type="text" 
                    required placeholder="Store Name" 
                    defaultValue={getFunName()} 
                    ref={(input) =>{this.storeInput = input}} />
                <button type="submit">Visit Store</button>
            </form>
        )
    }
}

export default StorePicker;