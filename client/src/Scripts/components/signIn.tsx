import Authentication from '../utils/authentication';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useGlobal } from '../utils/globalHooks';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

interface SignInState {
    username: string;
    password: string;
    usernameErrorMsg: boolean;
    passwordErrorMsg: boolean;
    authSuccess: boolean;
    authError: boolean;
    authHttpCode: number;
}

function SignIn(props: any) {
    const { t, location } = props,
        [, globalActions] = useGlobal(),
        [state, setState] = useState<SignInState>({
            username: '',
            password: '',
            usernameErrorMsg: false,
            passwordErrorMsg: false,
            authSuccess: false,
            authError: false,
            authHttpCode: -1
        }),
        usernameRef: React.RefObject<any> = React.createRef();

    // handleChangeInput = event => {
    //     this.setState(({ [event.target.name]: event.target.value } as any));
    // }

    function manageUsernameInput(event: React.FocusEvent<HTMLInputElement>) {
        if (!state.username) {
            setState(x => { return { ...x, usernameErrorMsg: event.type === 'blur' ? true : false }; });
        }
    }

    function managePasswordInput(event: React.FocusEvent<HTMLInputElement>) {
        if (!state.password) {
            setState(x => { return { ...x, passwordErrorMsg: event.type === 'blur' ? true : false }; });
        }
    }

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!state.username || !state.password) {
            setState(x => { return { ...x, hideUserMsg: state.username ? true : false, hidePwdMsg: state.password ? true : false }; });
        }
        else {
            const signInRes = await Authentication.signIn(state.username, state.password);

            // Reset.
            setState(x => { return { ...x, authError: false, authHttpCode: -1 }; });

            if (signInRes.ok) {
                setState(x => { return { ...x, authSuccess: true }; });
                globalActions.setAuthUser(await signInRes.json());
            }
            else {
                const httpCode = signInRes.status;

                if (httpCode !== 400 && httpCode !== 500) {
                    console.log(t('key_416') + ' - ' + httpCode);
                }

                setState(x => { return { ...x, password: '', hidePwdMsg: true, authError: true, authHttpCode: httpCode }; });
                usernameRef.current.focus();
            }
        }
    }

    useEffect(() => {
        usernameRef.current.focus();
    }, []);


    if (state.authSuccess) {
        return <Redirect to={location.state || { from: { pathname: '/' } }} />;
    }
    else {
        return (
            <section className='famo-grid signin'>
                <div className='famo-row'>
                    <div className='famo-cell'>
                        <div className='signin-body'>
                            <div className='signin-famo-logo'>
                                <img src={process.env.REACT_APP_CODE_URL + 'Content/Images/logo-famo-black-normal.png'} alt='FAMO' />
                            </div>
                            <div className='signin-form'>
                                <div className='signin-app-name'>
                                    <span className='famo-text-2'>{process.env.REACT_APP_NAME}</span>
                                </div>
                                <form method='POST' onSubmit={event => submit(event)}>
                                    <div className='signin-input-wrapper'>
                                        <input type='text' className={'famo-input signin-form-input famo-text-3 ' + (state.usernameErrorMsg ? 'famo-input-error' : '')} placeholder={t('key_397')} ref={usernameRef} name='username' value={this.state.username} autoComplete='off' onChange={this.handleChangeInput} onFocus={event => manageUsernameInput(event)} onBlur={event => manageUsernameInput(event)} />
                                        <SignInInputMsg className={'signin-error-input ' + (!state.usernameErrorMsg ? 'hide' : '')} text={t('key_196')} />
                                    </div>
                                    <div className='signin-input-wrapper'>
                                        <input type='password' className={'famo-input signin-form-input famo-text-3 ' + (state.passwordErrorMsg ? 'famo-input-error' : '')} placeholder={t('key_314')} name='password' value={this.state.password} onChange={this.handleChangeInput} onFocus={event => managePasswordInput(event)} onBlur={event => managePasswordInput(event)} />
                                        <SignInInputMsg className={'signin-error-input ' + (!state.passwordErrorMsg ? 'hide' : '')} text={t('key_195')} />
                                    </div>
                                    <div className={'signin-error-submit' + (!state.authError ? 'hide' : '')}>
                                        {state.authError && state.authHttpCode === 400 && <span className='famo-text-7'>{t('key_398')}</span>}
                                        {state.authError && state.authHttpCode === 500 && <span className='famo-text-7'>{t('key_306')}</span>}
                                    </div>
                                    <button className='famo-button famo-confirm-button signin-button-submit' type='submit'>
                                        <span className='famo-text-5'>{t('key_238')}</span>
                                    </button>
                                    <button type='button' className='famo-button famo-transparent-button signup-button'>
                                        <span className='famo-text-27'>{t('key_648')}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='famo-row'>
                    <div className='famo-cell famo-cell-bottom'>
                        <div className='signin-footer text-center'>
                            <span className='famo-text-1'>{new Date().getFullYear()} &copy; FAMO - {process.env.REACT_APP_NAME}</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


const SignInInputMsg = React.forwardRef((props: any, ref: any) => {
    const { className, text } = props;

    return (
        <div className={className}>
            <span className='famo-text-7'>{text}</span>
        </div>);
});

export default withRouter(withTranslation()(SignIn));