import React from 'react';
import PropTypes from 'prop-types';

import './LocationForm.css';

class LocationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayForm: true,
            name: '',
            phone: '',
            hours: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePhoneInputChange = this.handlePhoneInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleThankYouClick = this.handleThankYouClick.bind(this);
    }

    handleInputChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        this.setState({ [name]: value });
    }

    handlePhoneInputChange(e) {
        const value = e.target.value
            .replace(/[^0-9]/g, '')
            // Add a space after any at-least-2-digit group followed by more digits
            .replace(/(\d{2,})(?=\d)/g, '$1 ')

        this.setState({ phone: value });
    }

    handleSubmit() {
        e.preventDefault();
        this.props.handleSubmitNewLocation({
            name: this.state.name,
            address: this.state.address,
            postalCode: this.state.postalCode,
            city: this.state.city,
            phone: this.state.phone,
            hours: this.state.hours
        });
        this.setState({ displayForm: false });
    }

    handleThankYouClick() {
        this.setState({ displayForm: true });
        this.props.handleCloseLocationForm();
    }

    render() {
        return (
            <div className="location-form">
                {this.state.displayForm ? (
                    <form action="" onSubmit={this.handleSubmit}>
                        <h2>
                            Ajouter un restaurant<br />
                            au {this.props.geocodingLocation.street}<br />
                            {this.props.geocodingLocation.city} ?
                        </h2>
                        <div className="location-form-content">
                            <div className="location-form-content-inner">
                                <label htmlFor="name">Nom :</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleInputChange}
                                    id="name"
                                    required
                                />

                                <label htmlFor="phone">Téléphone :</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={this.state.phone}
                                    onChange={this.handlePhoneInputChange}
                                    id="phone"
                                    required
                                />

                                <label htmlFor="hours">Horaires d'ouverture :</label>
                                <input
                                    type="text"
                                    name="hours"
                                    value={this.state.hours}
                                    onChange={this.handleInputChange}
                                    id="hours"
                                    required
                                />
                                <p className="hours-description">De préférence sous la forme : "11am - 11pm"</p>

                                <button type="submit">Valider</button>
                            </div>
                        </div>
                    </form>
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

LocationForm.propTypes = {
    geocodingLocation: PropTypes.object.isRequired,
    handleSubmitNewLocation: PropTypes.func.isRequired,
    handleCloseLocationForm: PropTypes.func.isRequired
};

export default LocationForm;
