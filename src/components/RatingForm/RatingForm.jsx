import React from 'react';
import PropTypes from 'prop-types';

import RatingInput from '../common/RatingInput.jsx';

import './RatingForm.css';

class RatingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayForm: true,
            ratingStars: 5,
            ratingComment: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleButtonsInputClick = this.handleButtonsInputClick.bind(this);
        this.handleThankYouClick = this.handleThankYouClick.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.handleSubmitNewRating({
            ratingId: '',
            ratingStars: this.state.ratingStars,
            ratingComment: this.state.ratingComment,
            storeId: this.props.selectedLocation.properties.storeid
        });
        this.setState({ displayForm: false });
    }

    handleInputChange(e) {
        const { minRatingAverage, maxRatingAverage } = this.props;
        
        const regex = new RegExp(`[^${minRatingAverage}-${maxRatingAverage}]`, 'g');
        const value = e.target.value
            .replace(regex, '')
            // Stick to first number, ignore later digits
            .slice(0, 1);

        this.setState({ ratingStars: value });
    }

    handleTextAreaChange(e) {
        const value = e.target.value;
        this.setState({ ratingComment: value });
    }

    handleButtonsInputClick(e) {
        const { minRatingAverage, maxRatingAverage } = this.props;

        if (e.target.classList.contains('button-up') && parseInt(this.state.ratingStars) < maxRatingAverage) {
            this.setState((prevState) => ({ ratingStars: prevState.ratingStars + 1 }));

        } else if (e.target.classList.contains('button-up') && this.state.ratingStars === '') {
            this.setState({ ratingStars: 5 });

        } else if (e.target.classList.contains('button-down') && parseInt(this.state.ratingStars) > minRatingAverage) {
            this.setState((prevState) => ({ ratingStars: prevState.ratingStars - 1 }));
            
        } else if (e.target.classList.contains('button-down') && this.state.ratingStars === '') {
            this.setState({ ratingStars: 5 });
        }
    }

    handleThankYouClick() {
        this.setState({ displayForm: true });
        this.props.handleCloseRatingForm();
    }

    render() {
        const locationName = `"${this.props.selectedLocation.properties.name}"`;

        return (
            <div className="rating-form">
                {this.state.displayForm ? (
                    <div className="rating-form-inner">
                        <form action="" onSubmit={this.handleSubmit}>
                            <h2>
                                Ajoutez un avis sur le restaurant<br />
                                {locationName}
                            </h2>
                            <div className="rating-form-content">
                                <div className="rating-form-content-inner">
                                    <div className="rating-input-block">
                                        <label htmlFor="rating-stars">Votre note /5 :</label>
                                        <RatingInput
                                            inputName="rating-stars"
                                            inputValue={this.state.ratingStars}
                                            buttonUpName="button-up"
                                            buttonDownName="button-down"
                                            handleInputChange={(e) => this.handleInputChange(e)}
                                            handleButtonClick={this.handleButtonsInputClick}
                                        />
                                    </div>
                                    <textarea
                                        name="rating-comment"
                                        value={this.state.ratingComment}
                                        id="rating-comment"
                                        onChange={this.handleTextAreaChange}
                                        placeholder="Rédigez votre commentaire ici"
                                        rows="10"
                                        cols="38"
                                    />
                                    <button type="submit">Valider</button>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="thank-you">
                        <p>Merci !</p>
                        <button type="button" onClick={this.handleThankYouClick}>Retour aux résultats</button>
                    </div>
                )}
            </div>
        );
    }
}

RatingForm.propTypes = {
    handleSubmitNewRating: PropTypes.func.isRequired,
    handleCloseRatingForm: PropTypes.func.isRequired,
    minRatingAverage: PropTypes.number.isRequired,
    maxRatingAverage: PropTypes.number.isRequired,
    selectedLocation: PropTypes.object
};

export default RatingForm;
