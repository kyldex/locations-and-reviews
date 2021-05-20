import React from 'react';
import PropTypes from 'prop-types';

import RatingInput from '../common/RatingInput.jsx';

import './FilterControls.scss';

import { MIN_RATING_AVERAGE, MAX_RATING_AVERAGE } from '../../config';

class FilterControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalResizableWidth: null,
      halfResizerWidth: null,
      minMouseX: null,
      maxMouseX: null,
      oneStarWidth: null,
      twoStarsWidth: null,
      threeStarsWidth: null,
      fourStarsWidth: null
    };
    this.resizable = React.createRef();
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    this.makeResizable();
    this.checkInputValues();
  }

  handleInput(value, input) {
    const {
      currentMinRatingAverage,
      currentMaxRatingAverage
    } = this.props;

    const resizable = this.resizable.current;
    let { originalResizableWidth, halfResizerWidth, oneStarWidth } = this.state;
    if (originalResizableWidth === null || halfResizerWidth === null || oneStarWidth === null) {
      originalResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
      const resizer = document.querySelector('.resizer');
      halfResizerWidth = Math.floor(parseFloat(getComputedStyle(resizer, null).getPropertyValue('width')) / 2);
      oneStarWidth = Math.floor(originalResizableWidth / 5);
    }
    const resizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
    const resizableLeft = parseFloat(getComputedStyle(resizable, null).getPropertyValue('left'));
    const resizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));

    let newMinValue;
    let newMaxValue;
    let newResizableWidth;
    let newResizableLeft;
    let newResizableRight;

    // Minimum input
    if (input === 'filter-input-min') {
      if (parseInt(value, 10) || parseInt(value, 10) === 0) {
        const newValue = parseInt(value, 10);

        if (newValue < currentMaxRatingAverage) {
          newResizableLeft = newValue * oneStarWidth;
          newResizableWidth = originalResizableWidth - (newResizableLeft + resizableRight);
          resizable.style.left = newResizableLeft + 'px';
          resizable.style.width = newResizableWidth + 'px';

          newMinValue = newValue;
          newMaxValue = currentMaxRatingAverage;
          // Resizers are at the same position
        } else if (newValue === currentMaxRatingAverage) {
          newResizableLeft = newValue * oneStarWidth - halfResizerWidth;
          resizable.style.left = newResizableLeft + 'px';
          resizable.style.width = halfResizerWidth + 'px';

          newMinValue = newValue;
          newMaxValue = currentMaxRatingAverage;
        } else {
          newResizableWidth = resizableWidth + resizableLeft;
          resizable.style.left = '0px';
          resizable.style.width = newResizableWidth + 'px';

          newMinValue = MIN_RATING_AVERAGE;
          newMaxValue = currentMaxRatingAverage;
        }
      } else {
        newMinValue = '';
        newMaxValue = currentMaxRatingAverage;
      }

      // Maximum input
    } else if (input === 'filter-input-max') {
      if (parseInt(value, 10) || parseInt(value, 10) === 0) {
        const newValue = parseInt(value, 10);

        if (newValue > currentMinRatingAverage) {
          newResizableRight = originalResizableWidth - newValue * oneStarWidth;
          newResizableWidth = originalResizableWidth - (resizableLeft + newResizableRight);
          resizable.style.width = newResizableWidth + 'px';

          newMinValue = currentMinRatingAverage;
          newMaxValue = newValue;

          // Resizers are at the same position
        } else if (newValue === currentMinRatingAverage) {
          resizable.style.width = halfResizerWidth + 'px';

          newMinValue = currentMinRatingAverage;
          newMaxValue = newValue;
        } else {
          newResizableWidth = resizableWidth + resizableRight;
          resizable.style.width = newResizableWidth + 'px';

          newMinValue = currentMinRatingAverage;
          newMaxValue = MAX_RATING_AVERAGE;
        }
      } else {
        newMinValue = currentMinRatingAverage;
        newMaxValue = '';
      }
    }

    return { newMinValue, newMaxValue };
  }

  handleInputChange(e) {
    const { handleChangeFilterInputs } = this.props;

    // Only numbers between minimum and maximum rating average
    const regex = new RegExp(`[^${MIN_RATING_AVERAGE}-${MAX_RATING_AVERAGE}]`, 'g');
    const value = e.target.value
      .replace(regex, '')
    // Stick to first number, ignore later digits
      .slice(0, 1);
    const input = e.target.id;

    const newFilterValues = this.handleInput(value, input);

    handleChangeFilterInputs(newFilterValues.newMinValue, newFilterValues.newMaxValue);
  }

  handleInputBlur(e) {
    const { handleChangeFilterInputs } = this.props;
    let value = e.target.value;
    const input = e.target.id;
    let newFilterValues;

    if (value === '' && input === 'filter-input-min') {
      value = MIN_RATING_AVERAGE;
      newFilterValues = this.handleInput(value, input);
    } else if (value === '' && input === 'filter-input-max') {
      value = MAX_RATING_AVERAGE;
      newFilterValues = this.handleInput(value, input);
    }

    if (newFilterValues) {
      handleChangeFilterInputs(newFilterValues.newMinValue, newFilterValues.newMaxValue);
    }
  }

  handleButtonClick(e) {
    const {
      handleChangeFilterInputs,
      currentMinRatingAverage,
      currentMaxRatingAverage
    } = this.props;
    let newFilterValues;

    if (e.target.classList.contains('button-min-up') && currentMinRatingAverage < MAX_RATING_AVERAGE) {
      const newMinValue = currentMinRatingAverage + 1;
      if (newMinValue <= currentMaxRatingAverage) {
        newFilterValues = this.handleInput(newMinValue, 'filter-input-min');
      }
    } else if (e.target.classList.contains('button-min-down') && currentMinRatingAverage > MIN_RATING_AVERAGE) {
      const newMinValue = currentMinRatingAverage - 1;
      newFilterValues = this.handleInput(newMinValue, 'filter-input-min');
    } else if (e.target.classList.contains('button-max-up') && currentMaxRatingAverage < MAX_RATING_AVERAGE) {
      const newMaxValue = currentMaxRatingAverage + 1;
      newFilterValues = this.handleInput(newMaxValue, 'filter-input-max');
    } else if (e.target.classList.contains('button-max-down') && currentMaxRatingAverage > MIN_RATING_AVERAGE) {
      const newMaxValue = currentMaxRatingAverage - 1;
      if (newMaxValue >= currentMinRatingAverage) {
        newFilterValues = this.handleInput(newMaxValue, 'filter-input-max');
      }
    }

    if (newFilterValues) {
      handleChangeFilterInputs(newFilterValues.newMinValue, newFilterValues.newMaxValue);
    }
  }

  // Algorithm created with the help of this article by Hung Nguyen :
  // https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
  handleMouseDown(e) {
    const currentResizer = e.target;
    const originalMouseX = e.pageX;

    const {
      currentMinRatingAverage,
      currentMaxRatingAverage,
      handleChangeFilterInputs
    } = this.props;
    const {
      originalResizableWidth,
      halfResizerWidth,
      minMouseX,
      maxMouseX,
      oneStarWidth,
      twoStarsWidth,
      threeStarsWidth,
      fourStarsWidth
    } = this.state;
    const resizable = this.resizable.current;
    const resizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
    const resizableLeft = parseFloat(getComputedStyle(resizable, null).getPropertyValue('left'));
    const resizableRight = parseFloat(getComputedStyle(resizable, null).getPropertyValue('right'));

    // Callback for the mousemove event
    function resize(event) {
      let newMinValue = currentMinRatingAverage;
      let newMaxValue = currentMaxRatingAverage;
      let currentResizableWidth = resizableWidth;
      let currentResizableLeft = resizableLeft;
      let currentResizableRight = resizableRight;

      // Moving left resizer
      if (currentResizer.classList.contains('left')) {
        currentResizableWidth = resizableWidth - (event.pageX - originalMouseX);

        if (currentResizableWidth > 0 && event.pageX >= minMouseX) {
          resizable.style.width = currentResizableWidth + 'px';
          // Evolves the opposite way to width
          resizable.style.left = resizableLeft + (event.pageX - originalMouseX) + 'px';
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
          newMinValue = currentMaxRatingAverage;
        } else if (currentResizableWidth > originalResizableWidth) {
          newMinValue = 0;
        }

      // Moving right resizer
      } else if (currentResizer.classList.contains('right')) {
        currentResizableWidth = resizableWidth + (event.pageX - originalMouseX);

        if (currentResizableWidth > 0 && event.pageX <= maxMouseX) {
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
          newMaxValue = currentMinRatingAverage;
        } else if (currentResizableWidth > originalResizableWidth) {
          newMaxValue = 5;
        }
      }

      currentResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));
      handleChangeFilterInputs(newMinValue, newMaxValue);
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
      window.removeEventListener('mouseup', stopResize);
    }

    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
  }

  makeResizable() {
    const resizable = this.resizable.current;
    const originalResizableWidth = parseFloat(getComputedStyle(resizable, null).getPropertyValue('width'));

    const resizer = document.querySelector('.resizer');
    const halfResizerWidth = Math.floor(parseFloat(getComputedStyle(resizer, null).getPropertyValue('width')) / 2);

    const minMouseX = resizable.getBoundingClientRect().left;
    const maxMouseX = resizable.getBoundingClientRect().right;

    const oneStarWidth = Math.floor(originalResizableWidth / 5);
    const twoStarsWidth = Math.floor(originalResizableWidth * (2 / 5));
    const threeStarsWidth = Math.floor(originalResizableWidth * (3 / 5));
    const fourStarsWidth = Math.floor(originalResizableWidth * (4 / 5));

    this.setState({
      originalResizableWidth,
      halfResizerWidth,
      minMouseX,
      maxMouseX,
      oneStarWidth,
      twoStarsWidth,
      threeStarsWidth,
      fourStarsWidth
    });
  }

  // Check if input values had been changed when returning to filter display
  checkInputValues() {
    const {
      currentMinRatingAverage,
      currentMaxRatingAverage
    } = this.props;

    if (currentMinRatingAverage !== MIN_RATING_AVERAGE) {
      this.handleInput(currentMinRatingAverage, 'filter-input-min');
    }

    if (currentMaxRatingAverage !== MAX_RATING_AVERAGE) {
      this.handleInput(currentMaxRatingAverage, 'filter-input-max');
    }
  }

  render() {
    return (
      <div className="filter-controls">
        <form action="">
          <h2 className="filter-title">Filtrer par notes</h2>

          <div className="filter-controls-inner">
            <div className="filter-labels">
              <label htmlFor="filter-input-min">Min</label>
              <label htmlFor="filter-input-max">Max</label>
            </div>

            <div className="filter-selectors">
              <RatingInput
                inputName="filter-input-min"
                inputValue={this.props.currentMinRatingAverage}
                buttonUpName="button-min-up"
                buttonDownName="button-min-down"
                handleInputBlur={this.handleInputBlur}
                handleInputChange={(e) => this.handleInputChange(e)}
                handleButtonClick={(e) => this.handleButtonClick(e)}
              />

              <div className="filter-selector-line">
                <div className="filter-selector-line-inner">
                  <div
                    className="resizable"
                    ref={this.resizable}
                  >
                    <div
                      aria-label="Min"
                      className="resizer left"
                      onMouseDown={this.handleMouseDown}
                      role="button"
                      tabIndex={0}
                    />
                    <div
                      aria-label="Max"
                      className="resizer right"
                      onMouseDown={this.handleMouseDown}
                      role="button"
                      tabIndex={0}
                    />
                  </div>
                </div>
              </div>

              <RatingInput
                inputName="filter-input-max"
                inputValue={this.props.currentMaxRatingAverage}
                buttonUpName="button-max-up"
                buttonDownName="button-max-down"
                handleInputBlur={this.handleInputBlur}
                handleInputChange={(e) => this.handleInputChange(e)}
                handleButtonClick={(e) => this.handleButtonClick(e)}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

FilterControls.propTypes = {
  // String type when filter input is empty
  currentMinRatingAverage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  currentMaxRatingAverage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  handleChangeFilterInputs: PropTypes.func.isRequired
};

export default FilterControls;
