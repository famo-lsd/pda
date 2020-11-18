import Authentication from '../utils/authentication';
import httpStatus from 'http-status';
import React, { useEffect, useState } from 'react';
import { logHttpError, logPromiseError } from '../utils/log';
import { isAndroidApp } from '../utils/platform';
import { Redirect } from 'react-router-dom';
import { useGlobal } from '../utils/globalHooks';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

interface SignInState {
    username: string;
    password: string;
    usernameErrorMsg: boolean;
    passwordErrorMsg: boolean;
    authError: boolean;
    authHttpCode: number;
}

function SignIn(props: any) {
    const { location } = props,
        { t } = useTranslation(),
        [globalState, globalActions] = useGlobal(),
        [state, setState] = useState<SignInState>({
            username: '',
            password: '',
            usernameErrorMsg: false,
            passwordErrorMsg: false,
            authError: false,
            authHttpCode: -1
        }),
        [submitting, setSubmitting] = useState<boolean>(false),
        usernameRef: React.RefObject<any> = React.createRef();

    function changeUsername(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist();
        setState(x => { return { ...x, username: event.target.value }; });
    }

    function changePassword(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist();
        setState(x => { return { ...x, password: event.target.value }; });
    }

    function manageUsernameInput(event: React.FocusEvent<HTMLInputElement>) {
        if (!state.username) {
            event.persist();
            setState(x => { return { ...x, usernameErrorMsg: event.type === 'blur' ? true : false }; });
        }
    }

    function managePasswordInput(event: React.FocusEvent<HTMLInputElement>) {
        if (!state.password) {
            event.persist();
            setState(x => { return { ...x, passwordErrorMsg: event.type === 'blur' ? true : false }; });
        }
    }

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Reset.
        setSubmitting(true);

        if (!state.username || !state.password) {
            setState(x => { return { ...x, usernameErrorMsg: state.username ? false : true, passwordErrorMsg: state.password ? false : true }; });
        }
        else {
            // Reset.
            setState(x => { return { ...x, authError: false, authHttpCode: -1 }; });

            await Authentication.signIn(state.username, state.password).then(async result => {
                if (result.ok && result.status === httpStatus.OK) {
                    await result.json().then(async data => {
                        await isAndroidApp(data, globalActions, t);
                    });
                }
                else {
                    throw result;
                }
            }).catch(error => {
                if (error as Response) {
                    logHttpError(error);

                    setState(x => { return { ...x, password: '', passwordErrorMsg: false, authError: true, authHttpCode: error.status }; });
                    if (error.status !== httpStatus.BAD_REQUEST && error.status !== httpStatus.INTERNAL_SERVER_ERROR) {
                        console.log(t('key_416') + ' - ' + error.status);
                    }
                }
                else {
                    logPromiseError(error);
                    alert(t('key_416'));
                }
            });
        }

        setSubmitting(false);
    }

    useEffect(() => {
        if (state.authError) {
            usernameRef.current.focus();
        }
    }, [state.authError]);

    if (!submitting && globalState.authUser) {
        return <Redirect to={location.state?.from || { pathname: '/' }} />;
    }
    else {
        return (
            <section className='famo-grid signin'>
                <div className='famo-row'>
                    <div className='famo-cell'>
                        <div className='signin-body'>
                            <div className='signin-famo-logo'>
                                <img src={process.env.REACT_APP_CODE_URL + 'Content/Images/logo-famo-black.png'} alt='FAMO' />
                            </div>
                            <div className='signin-container'>
                                <div className='signin-app-name'>
                                    <span className='famo-text-2'>{process.env.REACT_APP_NAME}</span>
                                </div>
                                <div className={'famo-loader-wrapper ' + (submitting ? '' : 'hide')}>
                                    <div className='famo-loader'></div>
                                </div>
                                <form className={submitting ? 'hide' : ''} onSubmit={event => submit(event)}>
                                    <div className='signin-input'>
                                        <input type='text' className={'famo-input famo-text-3 ' + (state.usernameErrorMsg ? 'famo-input-error' : '')} placeholder={t('key_397')} ref={usernameRef} name='username' value={state.username} autoComplete='off' autoFocus={true} onChange={event => changeUsername(event)} onFocus={event => manageUsernameInput(event)} onBlur={event => manageUsernameInput(event)} />
                                        <SignInInputMsg className={'signin-input-error ' + (!state.usernameErrorMsg ? 'hide' : '')} text={t('key_196')} />
                                    </div>
                                    <div className='signin-input'>
                                        <input type='password' className={'famo-input famo-text-3 ' + (state.passwordErrorMsg ? 'famo-input-error' : '')} placeholder={t('key_314')} name='password' value={state.password} onChange={event => changePassword(event)} onFocus={event => managePasswordInput(event)} onBlur={event => managePasswordInput(event)} />
                                        <SignInInputMsg className={'signin-input-error ' + (!state.passwordErrorMsg ? 'hide' : '')} text={t('key_195')} />
                                    </div>
                                    <div className={'signin-form-error ' + (!state.authError ? 'hide' : '')}>
                                        {state.authError && state.authHttpCode === httpStatus.BAD_REQUEST && <span className='famo-text-7'>{t('key_398')}</span>}
                                        {state.authError && state.authHttpCode === httpStatus.INTERNAL_SERVER_ERROR && <span className='famo-text-7'>{t('key_306')}</span>}
                                    </div>
                                    <button className='famo-button famo-confirm-button signin-button signin-button-submit' type='submit'>
                                        <span className='famo-text-5'>{t('key_238')}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='famo-row'>
                    <div className='famo-cell famo-cell-bottom'>
                        <div className='signin-footer text-center'>
                            <span className='famo-text-1'>{new Date().getFullYear()} &copy; FAMO - {process.env.REACT_APP_NAME}</span>
                        </div>
                    </div>
                </div> */}
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

export default withRouter(SignIn);