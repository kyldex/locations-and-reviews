import React from 'react';
import PropTypes from 'prop-types';

import './ThankYou.css';

const ThankYou = ({ handleButtonClick }) => {

    return (
        <div className="thank-you">
            <p>Merci !</p>
            <button type="button" onClick={handleButtonClick}>Retour aux résultats</button>
        </div>
    );
}

ThankYou.propTypes = {
    // addedLocation: PropTypes.object,
    // addedRating: PropTypes.object
    handleButtonClick: PropTypes.func.isRequired
}

export default ThankYou;
