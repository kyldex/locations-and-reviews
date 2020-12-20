import React from 'react';
import PropTypes from 'prop-types';

import './RatingInput.scss';

const RatingInput = ({
    buttonUpName,
    buttonDownName,
    inputName,
    inputValue,
    handleButtonClick,
    handleInputBlur,
    handleInputChange,
    required
}) => {
    return (
        <div className="rating-input">
            <div className="rating-input-inner">
                <input
                    type="number"
                    name={inputName}
                    value={inputValue}
                    onBlur={handleInputBlur}
                    onChange={(e) => handleInputChange(e)}
                    id={inputName}
                    min="0"
                    max="5"
                    step="1"
                    required={required}
                />
                
                <div className="rating-input-buttons">
                    <div className="button">
                        <img src="/src/assets/img/chevron-up.svg"
                            className={buttonUpName}
                            onClick={handleButtonClick}
                            alt="chevron-up"
                        />
                    </div>
                    <div className="button">
                        <img
                            src="/src/assets/img/chevron-down.svg"
                            className={buttonDownName}
                            onClick={handleButtonClick}
                            alt="chevron-down"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

RatingInput.defaultProps = {
    required: false
}

RatingInput.propTypes = {
    buttonUpName: PropTypes.string.isRequired,
    buttonDownName: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    // String type when filter input is empty
    inputValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    handleButtonClick: PropTypes.func.isRequired,
    handleInputBlur: PropTypes.func,
    handleInputChange: PropTypes.func.isRequired,
    required: PropTypes.bool
};

export default RatingInput;
