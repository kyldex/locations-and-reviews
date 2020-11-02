import React from 'react';
import makeResizable from '../helpers/makeResizable';

import '../styles/Filter.css';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minValue: 0,
            maxValue: 5
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let value = e.target.value
            // Remove all non-digits
            .replace(/\D+/, '')
            // Remove digits > 5
            .replace(/[6-9]+/, '')
            // Stick to first number, ignore later digits
            .slice(0, 1)

        if (e.target.classList.contains('filter-input-min')) {
            this.setState({ minValue: parseInt(value) });
        } else if (e.target.classList.contains('filter-input-max')) {
            this.setState({ maxValue: parseInt(value) });
        }
    }

    componentDidMount() {
        makeResizable('.resizable');
    }

    render() {
        return (
            <div className="filter">
                <div className="filter-selector-line">
                    <div className="resizable">
                        <div className="resizer left"></div>
                        <div className="resizer right"></div>
                    </div>
                </div>
                <div className="filter-selector-inputs">
                    <label htmlFor="filter-input-min"> 
                        <input
                            type="number"
                            name="filter-input-min"
                            value={this.state.minValue}
                            onChange={this.handleChange}
                            className="filter-input-min"
                            min="0"
                            max="5"
                            step="1"
                        />
                    </label>
                    <label htmlFor="filter-input-max">
                        <input
                            type="number"
                            name="filter-input-max"
                            value={this.state.maxValue}
                            onChange={this.handleChange}
                            className="filter-input-max"
                            min="0"
                            max="5"
                            step="1"
                        />
                    </label>
                </div>
            </div>
        );
    }
}

export default Filter;