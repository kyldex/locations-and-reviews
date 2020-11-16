import React from 'react';
import PropTypes from 'prop-types';

import './LocationForm.css';

class LocationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayForm: true,
            name: '',
            address: '',
            postalCode: '',
            city: '',
            phone: '',
            openingHours: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleThankYouClick = this.handleThankYouClick.bind(this);
    }

    handleInputChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit() {
        e.preventDefault();
        this.props.handleSubmitNewLocation({
            name: this.state.name,
            address: this.state.address,
            postalCode: this.state.postalCode,
            city: this.state.city,
            phone: this.state.phone,
            openingHours: this.state.openingHours
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
                        <h2>Ajouter un nouveau restaurant</h2>
                        <div className="location-form-content">
                            <div className="location-form-content-inner">
                                <label htmlFor="name">Nom :</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleInputChange}
                                    id="name"
                                />

                                <label htmlFor="address">Adresse :</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.handleInputChange}
                                    id="address"
                                />

                                <label htmlFor="postal-code">Adresse :</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.handleInputChange}
                                    id="postal-code"
                                />
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
    handleCloseLocationForm: PropTypes.func.isRequired,
    handleSubmitNewLocation: PropTypes.func.isRequired
};

export default LocationForm;
