import React, { useEffect, useState } from 'react';
import { useGlobal } from '../utils/globalHooks';
import { NODE_SERVER } from '../utils/variablesRepo';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

interface ItemJournal {
    Code: string;
    Name: string;
}

function Inventory() {
    const [inventories, setInventories] = useState<Array<ItemJournal>>([]),
        [globalState, globalActions] = useGlobal(),
        action = 'javascript:void(0)';

    function handleSelectChange(event) {
    }

    useEffect(() => {
        if (globalState.authUser) {
            fetch(NODE_SERVER + 'ERP/Inventories?timestamp=' + new Date().getTime(), {
                method: 'GET',
                credentials: 'include'
            }).then((wsRes) => {
                wsRes.json().then((data) => {
                    setInventories(data);
                    globalActions.setLoadPage(false);
                });
            }).catch(() => { });
        }
    }, [globalState.authUser]);

    return (
        <section className='famo-wrapper'>
            <div className='famo-content'>
                <form action={action} className='famo-grid famo-form-grid' noValidate>
                    <div className='famo-row'>
                        <div className='famo-cell famo-input-label'>
                            <span className='famo-text-11'>Inventário</span>
                        </div>
                        <div className='famo-cell'>
                            <select className='famo-input famo-text-10' name='inventoryCode' onChange={handleSelectChange}>
                                <option key=''></option>
                                {inventories.map((x) => {
                                    return <option key={x.Code}>{x.Name}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default withRouter(withTranslation()(Inventory));