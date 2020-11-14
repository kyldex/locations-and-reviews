import React from 'react';
import PropTypes from 'prop-types';

import RatingInput from '../../common/RatingInput.jsx';

import './RatingForm.css';

class RatingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ratingStars: 5,
            ratingComment: 'Rédigez votre commentaire ici'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.handleSubmitNewRating({
            ratingId: '',
            ratingStars: this.state.ratingStars,
            ratingComment: this.state.ratingComment,
            storeId: this.props.selectedLocation.properties.storeid
        });
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

    handleButtonClick(e) {
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

    render() {
        return (
            <div className="rating-form">
                <form action="" onSubmit={this.handleSubmit}>
                    <h2>Ajoutez un avis en remplissant le formulaire</h2>
                    <div className="rating-form-content">
                        <div className="rating-form-content-inner">
                            <div className="rating-input-block">
                                <label htmlFor="rating">Votre note /5 :</label>
                                <RatingInput
                                    inputName="ratingStars"
                                    inputValue={this.state.ratingStars}
                                    buttonUpName="button-up"
                                    buttonDownName="button-down"
                                    handleInputChange={(e) => this.handleInputChange(e)}
                                    handleButtonClick={this.handleButtonClick}
                                />
                            </div>
                            <textarea
                                name="ratingComment"
                                value={this.state.ratingComment}
                                id="ratingComment"
                                onChange={this.handleTextAreaChange}
                                rows="10"
                                cols="38"
                            />
                            <button type="submit">Ajouter</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

RatingForm.propTypes = {
    handleSubmitNewRating: PropTypes.func.isRequired,
    minRatingAverage: PropTypes.number.isRequired,
    maxRatingAverage: PropTypes.number.isRequired,
    selectedLocation: PropTypes.object.isRequired
}

export default RatingForm;
