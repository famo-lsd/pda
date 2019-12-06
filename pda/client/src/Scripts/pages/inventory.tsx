import React from 'react';
import store from '../redux/store';
import { NODE_SERVER } from '../utils/variablesRepo';
import { setLoadPage } from '../redux/actions';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

interface ItemJournal {
    Code: string;
    Name: string;
}

interface InventoryState {
    inventories: Array<ItemJournal>;
}

class Inventory extends React.Component<any, InventoryState>{
    constructor(props: any) {
        super(props);

        this.state = {
            inventories: []
        }

        store.dispatch(setLoadPage(true));
    }

    handleSelectChange = (event) => {
        store.dispatch(setLoadPage(true));
    }

    componentDidMount() {
        fetch(NODE_SERVER + 'ERP/Inventories?timestamp=' + new Date().getTime(), {
            method: 'GET',
            credentials: 'include'
        }).then((wsRes) => {
            wsRes.json().then((data) => {
                this.setState({ inventories: data });
                store.dispatch(setLoadPage(false));
            });
        }).catch(() => { });
    }

    render() {
        let action = "javascript:void(0)",
            options = [<option key=""></option>];

        if (this.state.inventories.length > 0) {
            this.state.inventories.forEach((x) => {
                options.push(<option key={x.Code}>{x.Name}</option>);
            });
        }

        return (
            <section className="famo-wrapper">
                <div className="famo-content">
                    <form action={action} className="famo-grid famo-form-grid" noValidate>
                        <div className="famo-row">
                            <div className="famo-cell famo-input-label">
                                <span className="famo-text-11">Inventário</span>
                            </div>
                            <div className="famo-cell">
                                <select className="famo-input famo-text-10" name="inventoryCode" onChange={this.handleSelectChange}>
                                    {options}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

export default withRouter(withTranslation()(Inventory));