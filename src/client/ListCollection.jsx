import React from 'react';

class ListCollection extends React.Component {
    constructor() {
        super()
        this.state = {
            collection: []
        }
    }

    // {barcode, productname, manufacturer, brand, description, images}
    getItems() {
        const list = [];
        // ADD STYLING
        fetch('http://localhost:8080/getall')
            .then(request => request.json())
            .then(data => {
                data.forEach((item, i) => {
                    list.push(
                        <li keys={i}>
                            <img src={item.images} />
                            <p>{item.barcode}</p>
                            <p>{item.productname}</p>
                            <p>{item.manufacturer}</p>
                            <p>{item.brand}</p>
                            <p>{item.description}</p>
                        </li>
                    )
                })
                this.setState({ collection: list })
            })
    }

    render() {
        return (
            <div>
                <button onClick={() => { this.getItems() }}>Get Stored Items</button>
                <ul>{this.state.collection}</ul>
            </div>
        )
    }
}

export default ListCollection;