import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

interface HomeState {
    inventoryRedirect: boolean;
}

class Home extends React.Component<any, HomeState> {
    constructor(props) {
        super(props);

        this.state = {
            inventoryRedirect: false
        };
    }

    handleButtonClick = (event) => {
        this.setState({ inventoryRedirect: true });
    }

    render() {
        if (this.state.inventoryRedirect) {
            return <Redirect to="/Inventory" />
        }

        return (
            <React.Fragment>
                <section className="famo-wrapper">
                    <div className="famo-content">
                        <div className="famo-grid">
                            <div className="famo-row">
                                <div className="famo-cell text-center">
                                    <button type="button" className="famo-button famo-normal-button" onClick={this.handleButtonClick}>
                                        <span className="famo-text-5">Inventário</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default withRouter(withTranslation()(Home));