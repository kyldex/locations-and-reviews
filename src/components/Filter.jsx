import React from 'react';

import '../styles/Filter.css';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minValue: 0,
            maxValue: 5,
            resizableValues: {
                resizable: null,
                resizableWidth: null,
                resizableLeft: null,
                resizableRight: null,
                minMouseX: null,
                maxMouseX: null,
                oneStarWidth: null,
                twoStarsWidth: null,
                threeStarsWidth: null,
                fourStarsWidth: null
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
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
        } else if (e.target.classList.contains('button-min-down') && this.state.minValue > 0) {
            this.setState((prevState) => ({ minValue: prevState.minValue - 1 }));
        } else if (e.target.classList.contains('button-max-up') && this.state.maxValue < 5) {
            this.setState((prevState) => ({ maxValue: prevState.maxValue + 1 }));
        } else if (e.target.classList.contains('button-max-down') && this.state.maxValue > 0) {
            this.setState((prevState) => ({ maxValue: prevState.maxValue - 1 }));
        }
    }

    // To create this algorithm,
    // Refer to this article by Hung Nguyen
    // https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
    handleMouseDown(e) {
        e.preventDefault();
        const currentResizer = e.target;
        let originalMouseX = e.pageX;
        const thisFilterComponent = this;

        const {
            resizable,
            resizableWidth,
            resizableLeft,
            resizableRight,
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

            // Moving left resizer
            if (currentResizer.classList.contains('left')) {
                const width = resizableWidth - (e.pageX - originalMouseX);

                if (width >= oneStarWidth && e.pageX >= minMouseX) {

                    resizable.style.width = width + 'px';
                    // Evolves the opposite way to width
                    resizable.style.left = resizableLeft + (e.pageX - originalMouseX) + 'px';
                    const currentResizableLeft = parseFloat(getComputedStyle(resizable, null).getPropertyValue('left'));

                    if (currentResizableLeft < oneStarWidth) {
                        thisFilterComponent.setState({ minValue: 0 });
                    } else if (currentResizableLeft >= oneStarWidth && currentResizableLeft < twoStarsWidth) {
                        thisFilterComponent.setState({ minValue: 1 });
                    } else if (currentResizableLeft >= twoStarsWidth && currentResizableLeft < threeStarsWidth) {
                        thisFilterComponent.setState({ minValue: 2 });
                    } else if (currentResizableLeft >= threeStarsWidth && currentResizableLeft < fourStarsWidth) {
                        thisFilterComponent.setState({ minValue: 3 });
                    } else {
                        thisFilterComponent.setState({ minValue: 4 });
                    }
                }

            // Moving right resizer
            } else if (currentResizer.classList.contains('right')) {
                const width = resizableWidth + (e.pageX - originalMouseX);

                if (width >= oneStarWidth && e.pageX <= maxMouseX) {
                    resizable.style.width = width + 'px';
                    const currentResizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));

                    if (currentResizableRight < oneStarWidth) {
                        thisFilterComponent.setState({ maxValue: 5 });
                    } else if (currentResizableRight >= oneStarWidth && currentResizableRight < twoStarsWidth) {
                        thisFilterComponent.setState({ maxValue: 4 });
                    } else if (currentResizableRight >= twoStarsWidth && currentResizableRight < threeStarsWidth) {
                        thisFilterComponent.setState({ maxValue: 3 });
                    } else if (currentResizableRight >= threeStarsWidth && currentResizableRight < fourStarsWidth) {
                        thisFilterComponent.setState({ maxValue: 2 });
                    } else {
                        thisFilterComponent.setState({ maxValue: 1 });
                    }
                }
            }
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

                } else {
                    newResizableWidth += (newResizableLeft - fourStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';
                    newResizableLeft = fourStarsWidth;
                    resizable.style.left = newResizableLeft + 'px';
                }

                thisFilterComponent.setState((prevState) => (
                    {
                        resizableValues: {
                            ...prevState.resizableValues,
                            resizableWidth: newResizableWidth,
                            resizableLeft: newResizableLeft
                        }
                    }
                ));
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

                } else {
                    newResizableWidth += (newResizableRight - fourStarsWidth);
                    resizable.style.width = newResizableWidth + 'px';
                }

                newResizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));
                thisFilterComponent.setState((prevState) => (
                    {
                        resizableValues: {
                            ...prevState.resizableValues,
                            resizableWidth: newResizableWidth,
                            resizableRight: newResizableRight
                        }
                    }
                ));
            }
        }
    }

    makeResizable() {
        const resizable = document.querySelector('.resizable');
        const originalResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
        const resizableWidth = originalResizableWidth;

        const resizableLeft = 0;
        const resizableRight = 0;

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
                resizableLeft,
                resizableRight,
                minMouseX,
                maxMouseX,
                oneStarWidth,
                twoStarsWidth,
                threeStarsWidth,
                fourStarsWidth
            }
        });
    }

    componentDidMount() {
        this.makeResizable();
    }

    render() {
        return (
            <div className="filter">
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
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
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
            </div>
        );
    }
}

export default Filter;