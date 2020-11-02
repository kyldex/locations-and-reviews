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
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleChange(e) {
        let value = e.target.value
            // Remove all non-digits
            .replace(/\D+/, '')
            // Remove digits > 5
            .replace(/[6-9]+/, '')
            // Stick to first number, ignore later digits
            .slice(0, 1)

        if (e.target.id === 'filter-input-min') {
            this.setState({ minValue: parseInt(value) });
        } else if (e.target.id === 'filter-input-max') {
            this.setState({ maxValue: parseInt(value) });
        }
    }

    handleButtonClick(e) {
        if (e.target.classList.contains('button-min-up') && this.state.minValue < 5) {
            this.setState((prevState) => ({ minValue: prevState.minValue + 1 }));
            console.log('hello');
        } else if (e.target.classList.contains('button-min-down') && this.state.minValue > 0) {
            this.setState((prevState) => ({ minValue: prevState.minValue - 1 }));
        } else if (e.target.classList.contains('button-max-up') && this.state.maxValue < 5) {
            this.setState((prevState) => ({ maxValue: prevState.maxValue + 1 }));
        } else if (e.target.classList.contains('button-max-down') && this.state.maxValue > 0) {
            this.setState((prevState) => ({ maxValue: prevState.maxValue - 1 }));
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
                    <label htmlFor="filter-input-min">Min</label>
                    <div className="filter-selector-input-1">
                        <input
                            type="number"
                            name="filter-input-min"
                            value={this.state.minValue}
                            onChange={this.handleChange}
                            id="filter-input-min"
                            min="0"
                            max="5"
                            step="1"
                        />
                        <div className="filter-buttons">
                            <div className="button">
                                <img src="/src/assets/img/chevron-up.svg" className="button-min-up" onClick={this.handleButtonClick} alt="chevron-up" />
                            </div>
                            <div className="button">
                                <img src="/src/assets/img/chevron-down.svg" className="button-min-down" onClick={this.handleButtonClick} alt="chevron-down" />
                            </div>
                        </div>
                    </div>
                    <label htmlFor="filter-input-max">Max</label>
                    <div className="filter-selector-input-2">
                        <input
                            type="number"
                            name="filter-input-max"
                            value={this.state.maxValue}
                            onChange={this.handleChange}
                            id="filter-input-max"
                            min="0"
                            max="5"
                            step="1"
                        />
                        <div className="filter-buttons">
                            <div className="button">
                                <img src="/src/assets/img/chevron-up.svg" className="button-max-up" onClick={this.handleButtonClick} alt="chevron-up" />
                            </div>
                            <div className="button">
                                <img src="/src/assets/img/chevron-down.svg" className="button-max-down" onClick={this.handleButtonClick} alt="chevron-down" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Filter;