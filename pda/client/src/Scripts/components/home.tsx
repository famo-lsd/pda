import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useGlobal } from '../utils/globalHooks';
import { withTranslation } from 'react-i18next';

function Home() {
    const [, globalActions] = useGlobal(),
        [inventoryRedirect, setRedirection] = useState(false);

    // #region Events
    function handleRedirection(event) {
        setRedirection(true);
    }
    // #endregion

    useEffect(() => {
        globalActions.setLoadPage(false);
    }, []);

    if (inventoryRedirect) {
        return <Redirect push to='/Inventory' />;
    }
    else {
        return (
            <section className='famo-wrapper'>
                <div className='famo-content'>
                    <div className='famo-grid'>
                        <div className='famo-row'>
                            <div className='famo-cell text-center'>
                                <button type='button' className='famo-button famo-normal-button' onClick={handleRedirection}>
                                    <span className='famo-text-5'>Inventário</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(withTranslation()(Home));