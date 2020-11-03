import React from 'react';

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

    // To create this algorithm,
    // Refer to this article by Hung Nguyen
    // https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
    makeResizable(divClass) {
        const resizable = document.querySelector(divClass);
        const resizers = document.querySelectorAll(divClass + ' .resizer');
        const thisFilterComponent = this;
    
        const originalResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
        let resizableWidth = originalResizableWidth;

        const minMouseX = resizable.getBoundingClientRect().left;
        const maxMouseX = resizable.getBoundingClientRect().right;
        let originalMouseX;

        const oneStarWidth = Math.floor(originalResizableWidth / 5);
        const twoStarsWidth = Math.floor(originalResizableWidth * (2 / 5));
        const threeStarsWidth = Math.floor(originalResizableWidth * (3 / 5));
        const fourStarsWidth = Math.floor(originalResizableWidth * (4 / 5));
    
        let resizableLeft = 0;
        let previousResizableLeft = resizableLeft;
        let resizableRight = 0;
        let previousResizableRight = resizableRight;
    
        for (let i = 0; i < resizers.length; i++) {
            const currentResizer = resizers[i];
    
            currentResizer.addEventListener('mousedown', function(e) {
                e.preventDefault();
                originalMouseX = e.pageX;

                window.addEventListener('mousemove', resize);
                window.addEventListener('mouseup', stopResize);
    
                function resize(e) {
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
                    resizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
                    resizableLeft = parseFloat(getComputedStyle(resizable, null).getPropertyValue('left'));
                    resizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));

                    if (resizableLeft !== previousResizableLeft) {

                        if (resizableLeft < oneStarWidth) {
                            resizableWidth += resizableLeft;
                            resizable.style.width = resizableWidth + 'px';
                            resizableLeft = 0;
                            resizable.style.left = resizableLeft + 'px';
        
                        } else if (resizableLeft >= oneStarWidth && resizableLeft < twoStarsWidth) {
                            resizableWidth += (resizableLeft - oneStarWidth);
                            resizable.style.width = resizableWidth + 'px';
                            resizableLeft = oneStarWidth;
                            resizable.style.left = resizableLeft + 'px';

                        } else if (resizableLeft >= twoStarsWidth && resizableLeft < threeStarsWidth) {
                            resizableWidth += (resizableLeft - twoStarsWidth);
                            resizable.style.width = resizableWidth + 'px';
                            resizableLeft = twoStarsWidth;
                            resizable.style.left = resizableLeft + 'px';

                        } else if (resizableLeft >= threeStarsWidth && resizableLeft < fourStarsWidth) {
                            resizableWidth += (resizableLeft - threeStarsWidth);
                            resizable.style.width = resizableWidth + 'px';
                            resizableLeft = threeStarsWidth;
                            resizable.style.left = resizableLeft + 'px';

                        } else {
                            resizableWidth += (resizableLeft - fourStarsWidth);
                            resizable.style.width = resizableWidth + 'px';
                            resizableLeft = fourStarsWidth;
                            resizable.style.left = resizableLeft + 'px';
                        }

                        previousResizableLeft = resizableLeft;
                    }

                    if (resizableRight !== previousResizableRight) {

                        if (resizableRight < oneStarWidth) {
                            resizableWidth += resizableRight;
                            resizable.style.width = resizableWidth + 'px';
        
                        } else if (resizableRight >= oneStarWidth && resizableRight < twoStarsWidth) {
                            resizableWidth += (resizableRight - oneStarWidth);
                            resizable.style.width = resizableWidth + 'px';

                        } else if (resizableRight >= twoStarsWidth && resizableRight < threeStarsWidth) {
                            resizableWidth += (resizableRight - twoStarsWidth);
                            resizable.style.width = resizableWidth + 'px';

                        } else if (resizableRight >= threeStarsWidth && resizableRight < fourStarsWidth) {
                            resizableWidth += (resizableRight - threeStarsWidth);
                            resizable.style.width = resizableWidth + 'px';

                        } else {
                            resizableWidth += (resizableRight - fourStarsWidth);
                            resizable.style.width = resizableWidth + 'px';
                        }

                        resizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));
                        previousResizableRight = resizableRight;
                    }
                }
            });
        }
    }

    componentDidMount() {
        this.makeResizable('.resizable');
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
                                <div className="resizer left"></div>
                                <div className="resizer right"></div>
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