import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Filter.css';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minValue: this.props.minRatingAverage,
            maxValue: this.props.maxRatingAverage,
            resizableValues: {
                resizable: null,
                resizableWidth: null,
                originalResizableWidth: null,
                resizableLeft: null,
                resizableRight: null,
                halfResizerWidth: null,
                minMouseX: null,
                maxMouseX: null,
                oneStarWidth: null,
                twoStarsWidth: null,
                threeStarsWidth: null,
                fourStarsWidth: null
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    makeResizable() {
        const resizable = document.querySelector('.resizable');
        const originalResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
        const resizableWidth = originalResizableWidth;

        const resizableLeft = 0;
        const resizableRight = 0;

        const resizer = document.querySelector('.resizer');
        const halfResizerWidth = Math.floor(parseFloat(getComputedStyle(resizer, null).getPropertyValue('width')) / 2); 

        const minMouseX = resizable.getBoundingClientRect().left;
        const maxMouseX = resizable.getBoundingClientRect().right;

        const oneStarWidth = Math.floor(originalResizableWidth / 5);
        const twoStarsWidth = Math.floor(originalResizableWidth * (2 / 5));
        const threeStarsWidth = Math.floor(originalResizableWidth * (3 / 5));
        const fourStarsWidth = Math.floor(originalResizableWidth * (4 / 5));

        this.setState({
            resizableValues: {
                resizable,
                resizableWidth,
                originalResizableWidth,
                resizableLeft,
                resizableRight,
                halfResizerWidth,
                minMouseX,
                maxMouseX,
                oneStarWidth,
                twoStarsWidth,
                threeStarsWidth,
                fourStarsWidth
            }
        });
    }

    handleInput(value, input) {
        const { minValue, maxValue } = this.state;
        const {
            resizable,
            resizableWidth,
            originalResizableWidth,
            resizableLeft,
            resizableRight,
            halfResizerWidth,
            oneStarWidth
        } = this.state.resizableValues;

        let newMinValue, newMaxValue, newResizableWidth, newResizableLeft, newResizableRight;

        // Minimum input
        if (input === 'filter-input-min') {

            if (parseInt(value) || parseInt(value) === 0) {

                if (value < maxValue) {
                    newResizableLeft = value * oneStarWidth;
                    newResizableWidth = originalResizableWidth - (newResizableLeft + resizableRight);
                    resizable.style.left = newResizableLeft + 'px';
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableRight = resizableRight;

                    newMinValue = parseInt(value);
                    newMaxValue = maxValue;

                // Resizers are at the same position
                } else if (value === maxValue) {
                    newResizableLeft = value * oneStarWidth - halfResizerWidth;
                    newResizableWidth = halfResizerWidth;
                    resizable.style.left = newResizableLeft + 'px';
                    resizable.style.width = halfResizerWidth + 'px';
                    newResizableRight = resizableRight;

                    newMinValue = parseInt(value);
                    newMaxValue = maxValue;

                } else {
                    newResizableLeft = 0;
                    newResizableWidth = resizableWidth + resizableLeft;
                    resizable.style.left = '0px';
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableRight = resizableRight;

                    newMinValue = 0;
                    newMaxValue = maxValue;
                }

            } else {
                newResizableWidth = resizableWidth;
                newResizableLeft = resizableLeft;
                newResizableRight = resizableRight;

                newMinValue =  '';
                newMaxValue = maxValue;
            }

        // Maximum input
        } else if (input === 'filter-input-max') {

            if (parseInt(value) || parseInt(value) === 0) {

                if (value > minValue) {
                    newResizableRight = originalResizableWidth - value * oneStarWidth;
                    newResizableWidth = originalResizableWidth - (resizableLeft + newResizableRight);
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableLeft = resizableLeft;

                    newMinValue = minValue;
                    newMaxValue = parseInt(value);

                // Resizers are at the same position
                } else if (value === minValue) {
                    console.log('hello');
                    newResizableRight = originalResizableWidth - value * oneStarWidth + halfResizerWidth;
                    newResizableWidth = halfResizerWidth;
                    resizable.style.width = halfResizerWidth + 'px';
                    newResizableLeft = resizableLeft;

                    newMinValue = minValue;
                    newMaxValue = parseInt(value);

                } else {
                    newResizableLeft = resizableLeft;
                    newResizableRight = resizableRight;
                    newResizableWidth = resizableWidth + resizableRight;
                    resizable.style.width = newResizableWidth + 'px';

                    newMinValue = minValue;
                    newMaxValue = 5;
                }

            } else {
                newResizableWidth = resizableWidth;
                newResizableLeft = resizableLeft;
                newResizableRight = resizableRight;

                newMinValue = minValue;
                newMaxValue = '';
            }
        }

        return {newMinValue, newMaxValue, newResizableWidth, newResizableLeft, newResizableRight};
    }

    handleInputChange(e) {
        const value = e.target.value
            // Only numbers between 0 and 5
            .replace(/[^0-5]/g, '')
            // Stick to first number, ignore later digits
            .slice(0, 1);
        const input = e.target.id;

        const newFilterValues = this.handleInput(value, input);

        this.props.onChangeFilterInputs(newFilterValues.newMinValue, newFilterValues.newMaxValue);

        this.setState((prevState) => (
            {
                resizableValues: {
                    ...prevState.resizableValues,
                    resizableWidth: newFilterValues.newResizableWidth,
                    resizableLeft: newFilterValues.newResizableLeft,
                    resizableRight: newFilterValues.newResizableRight
                }
            }
        ));
    }

    handleButtonClick(e) {
        let newFilterValues;

        if (e.target.classList.contains('button-min-up') && this.state.minValue < 5) {
            const newMinValue = this.state.minValue + 1;

            if (newMinValue <= this.state.maxValue) {
                newFilterValues = this.handleInput(newMinValue, 'filter-input-min');
            }

        } else if (e.target.classList.contains('button-min-down') && this.state.minValue > 0) {
            const newMinValue = this.state.minValue - 1;
            newFilterValues = this.handleInput(newMinValue, 'filter-input-min');

        } else if (e.target.classList.contains('button-max-up') && this.state.maxValue < 5) {
            const newMaxValue = this.state.maxValue + 1;
            newFilterValues = this.handleInput(newMaxValue, 'filter-input-max');

        } else if (e.target.classList.contains('button-max-down') && this.state.maxValue > 0) {
            const newMaxValue = this.state.maxValue - 1;

            if (newMaxValue >= this.state.minValue) {
                newFilterValues = this.handleInput(newMaxValue, 'filter-input-max');
            }
        }

        if (newFilterValues) {
            this.props.onChangeFilterInputs(newFilterValues.newMinValue, newFilterValues.newMaxValue);

            this.setState((prevState) => (
                {
                    resizableValues: {
                        ...prevState.resizableValues,
                        resizableWidth: newFilterValues.newResizableWidth,
                        resizableLeft: newFilterValues.newResizableLeft,
                        resizableRight: newFilterValues.newResizableRight
                    }
                }
            ));
        }
    }

    // To create this algorithm,
    // Refer to this article by Hung Nguyen
    // https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
    handleMouseDown(e) {
        // e.preventDefault();
        const currentResizer = e.target;
        let originalMouseX = e.pageX;
        const thisFilterComponent = this;

        const { minValue, maxValue } = this.state;
        const {
            resizable,
            resizableWidth,
            originalResizableWidth,
            resizableLeft,
            resizableRight,
            halfResizerWidth,
            minMouseX,
            maxMouseX,
            oneStarWidth,
            twoStarsWidth,
            threeStarsWidth,
            fourStarsWidth
        } = this.state.resizableValues;

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);

        function resize(e) {
            let newMinValue = minValue;
            let newMaxValue = maxValue;
            let currentResizableWidth = resizableWidth;
            let currentResizableLeft = resizableLeft;
            let currentResizableRight = resizableRight;

            // Moving left resizer
            if (currentResizer.classList.contains('left')) {
                currentResizableWidth = resizableWidth - (e.pageX - originalMouseX);

                if (currentResizableWidth > 0 && e.pageX >= minMouseX) {
                    resizable.style.width = currentResizableWidth + 'px';
                    // Evolves the opposite way to width
                    resizable.style.left = resizableLeft + (e.pageX - originalMouseX) + 'px';
                    currentResizableLeft = parseFloat(getComputedStyle(resizable, null).getPropertyValue('left'));

                    if (currentResizableLeft < oneStarWidth) {
                        newMinValue = 0;
                    } else if (currentResizableLeft >= oneStarWidth && currentResizableLeft < twoStarsWidth) {
                        newMinValue = 1;
                    } else if (currentResizableLeft >= twoStarsWidth && currentResizableLeft < threeStarsWidth) {
                        newMinValue = 2;
                    } else if (currentResizableLeft >= threeStarsWidth && currentResizableLeft < fourStarsWidth) {
                        newMinValue = 3;
                    } else {
                        newMinValue = 4;
                    }

                // Resizers are at the same position
                } else if (currentResizableWidth <= 0) {
                    newMinValue = maxValue;

                } else if (currentResizableWidth > originalResizableWidth) {
                    newMinValue = 0;
                }

            // Moving right resizer
            } else if (currentResizer.classList.contains('right')) {
                currentResizableWidth = resizableWidth + (e.pageX - originalMouseX);

                if (currentResizableWidth > 0 && e.pageX <= maxMouseX) {
                    resizable.style.width = currentResizableWidth + 'px';
                    currentResizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));

                    if (currentResizableRight < oneStarWidth) {
                        newMaxValue = 5;
                    } else if (currentResizableRight >= oneStarWidth && currentResizableRight < twoStarsWidth) {
                        newMaxValue = 4;
                    } else if (currentResizableRight >= twoStarsWidth && currentResizableRight < threeStarsWidth) {
                        newMaxValue = 3;
                    } else if (currentResizableRight >= threeStarsWidth && currentResizableRight < fourStarsWidth) {
                        newMaxValue = 2;
                    } else {
                        newMaxValue = 1;
                    }

                // Resizers are at the same position
                } else if (currentResizableWidth <= 0) {
                    newMaxValue = minValue;

                } else if (currentResizableWidth > originalResizableWidth) {
                    newMaxValue = 5;
                }
            }

            currentResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));

            thisFilterComponent.props.onChangeFilterInputs(newMinValue, newMaxValue);
            
            thisFilterComponent.setState((prevState) => (
                {
                    resizableValues: {
                        ...prevState.resizableValues,
                        resizableWidth: currentResizableWidth,
                        resizableLeft: currentResizableLeft,
                        resizableRight: currentResizableRight
                    }
                }
            ));
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
            let newResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
            let newResizableLeft = parseFloat(getComputedStyle(resizable, null).getPropertyValue('left'));
            let newResizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));

            if (newResizableLeft !== resizableLeft) {

                if (newResizableLeft < oneStarWidth) {
                    newResizableWidth += newResizableLeft;
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableLeft = 0;
                    resizable.style.left = newResizableLeft + 'px';

                } else if (newResizableLeft >= oneStarWidth && newResizableLeft < twoStarsWidth) {
                    newResizableWidth += (newResizableLeft - oneStarWidth);
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableLeft = oneStarWidth;
                    resizable.style.left = newResizableLeft + 'px';

                } else if (newResizableLeft >= twoStarsWidth && newResizableLeft < threeStarsWidth) {
                    newResizableWidth += (newResizableLeft - twoStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableLeft = twoStarsWidth;
                    resizable.style.left = newResizableLeft + 'px';

                } else if (newResizableLeft >= threeStarsWidth && newResizableLeft < fourStarsWidth) {
                    newResizableWidth += (newResizableLeft - threeStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableLeft = threeStarsWidth;
                    resizable.style.left = newResizableLeft + 'px';

                } else if (newResizableLeft >= fourStarsWidth && newResizableLeft < originalResizableWidth - halfResizerWidth) {
                    newResizableWidth += (newResizableLeft - fourStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableLeft = fourStarsWidth;
                    resizable.style.left = newResizableLeft + 'px';

                } else {
                    newResizableWidth = halfResizerWidth;
                    resizable.style.width = halfResizerWidth + 'px';
                    newResizableLeft = originalResizableWidth - halfResizerWidth;
                    resizable.style.left = newResizableLeft + 'px';
                }
            }

            if (newResizableRight !== resizableRight) {

                if (newResizableRight < oneStarWidth) {
                    newResizableWidth += newResizableRight;
                    resizable.style.width = newResizableWidth + 'px';

                } else if (newResizableRight >= oneStarWidth && newResizableRight < twoStarsWidth) {
                    newResizableWidth += (newResizableRight - oneStarWidth);
                    resizable.style.width = newResizableWidth + 'px';

                } else if (newResizableRight >= twoStarsWidth && newResizableRight < threeStarsWidth) {
                    newResizableWidth += (newResizableRight - twoStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';

                } else if (newResizableRight >= threeStarsWidth && newResizableRight < fourStarsWidth) {
                    newResizableWidth += (newResizableRight - threeStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';

                } else if (newResizableRight >= fourStarsWidth && newResizableRight < originalResizableWidth - halfResizerWidth) {
                    newResizableWidth += (newResizableRight - fourStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';

                } else {
                    newResizableWidth = halfResizerWidth;
                    resizable.style.width = halfResizerWidth + 'px';
                }

                newResizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));
            }

            thisFilterComponent.setState((prevState) => (
                {
                    resizableValues: {
                        ...prevState.resizableValues,
                        resizableWidth: newResizableWidth,
                        resizableLeft: newResizableLeft,
                        resizableRight: newResizableRight
                    }
                }
            ));

            window.removeEventListener('mouseup', stopResize);
        }
    }

    componentDidMount() {
        this.makeResizable();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            minValue: nextProps.minRatingAverage,
            maxValue: nextProps.maxRatingAverage
        };
    }

    render() {
        return (
            <div className="filter">
                <form action="">
                    <div className="filter-title">Trier par notes</div>

                    <div className="filter-labels">
                        <label htmlFor="filter-input-min">Min</label>
                        <label htmlFor="filter-input-max">Max</label>
                    </div>

                    <div className="filter-selectors">
                        <div className="filter-selector-input">
                            <div className="filter-selector-input-1">
                                <input
                                    type="number"
                                    name="filter-input-min"
                                    value={this.state.minValue}
                                    onChange={this.handleInputChange}
                                    id="filter-input-min"
                                    min="0"
                                    max="5"
                                    step="1"
                                />
                                <div className="filter-buttons">
                                    <div className="button">
                                        <img src="/src/assets/img/chevron-up.svg"
                                            className="button-min-up"
                                            onClick={this.handleButtonClick}
                                            alt="chevron-up"
                                        />
                                    </div>
                                    <div className="button">
                                        <img
                                            src="/src/assets/img/chevron-down.svg"
                                            className="button-min-down"
                                            onClick={this.handleButtonClick}
                                            alt="chevron-down"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="filter-selector-line">
                            <div className="filter-selector-line-inner">
                                <div className="resizable">
                                    <div
                                        className="resizer left"
                                        onMouseDown={this.handleMouseDown}
                                    />
                                    <div
                                        className="resizer right"
                                        onMouseDown={this.handleMouseDown}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="filter-selector-input">
                            <div className="filter-selector-input-2">
                                <input
                                    type="number"
                                    name="filter-input-max"
                                    value={this.state.maxValue}
                                    onChange={this.handleInputChange}
                                    id="filter-input-max"
                                    min="0"
                                    max="5"
                                    step="1"
                                />
                                <div className="filter-buttons">
                                    <div className="button">
                                        <img
                                            src="/src/assets/img/chevron-up.svg"
                                            className="button-max-up"
                                            onClick={this.handleButtonClick}
                                            alt="chevron-up"
                                        />
                                    </div>
                                    <div className="button">
                                        <img
                                            src="/src/assets/img/chevron-down.svg"
                                            className="button-max-down"
                                            onClick={this.handleButtonClick}
                                            alt="chevron-down"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

Filter.propTypes = {
    // String type when filter input is empty
    minRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
    maxRatingAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
    onChangeFilterInputs: PropTypes.func.isRequired
}

export default Filter;
