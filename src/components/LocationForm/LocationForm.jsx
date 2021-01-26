import React from 'react';
import PropTypes from 'prop-types';

import './LocationForm.scss';

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
    const value = e.target.value.replace(/[^0-9+\s]/g, '');
    this.setState({ phone: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const newLocation = { ...this.props.geocodedLocation };
    newLocation.properties.name = this.state.name;
    newLocation.properties.phone = this.state.phone;
    newLocation.properties.hours = this.state.hours;

    this.props.handleSubmitNewLocation(newLocation);
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
              au {this.props.geocodedLocation.properties.address.street_number} {this.props.geocodedLocation.properties.address.street}<br />
              {this.props.geocodedLocation.properties.address.postal_code} {this.props.geocodedLocation.properties.address.city} ?
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

                <label htmlFor="hours">Horaires d&#39ouverture :</label>
                <input
                  type="text"
                  name="hours"
                  value={this.state.hours}
                  onChange={this.handleInputChange}
                  id="hours"
                  required
                />
                <p className="hours-description">De préférence sous la forme : &#3411am - 11pm&#34</p>

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
  geocodedLocation: PropTypes.object,
  handleSubmitNewLocation: PropTypes.func.isRequired,
  handleCloseLocationForm: PropTypes.func.isRequired
};

export default LocationForm;
