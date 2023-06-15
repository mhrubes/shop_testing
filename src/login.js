import React, { useState, useContext } from 'react';
import { AppContext } from './contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorStr, setErrorStr] = useState('');

    const { handleLogin, users } = useContext(AppContext);
    const navigate = useNavigate();

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFormSubmit = () => {
        const user = users.find((user) => user.name === name && user.password === password);

        if (user) {
            handleLogin(user);
            navigate('/Main');
        } else {
            setErrorStr("Uživatelské jméno nebo Heslo bylo zadáno špatně.");
            setName('');
            setPassword('');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div>
                <div className='text-center'>
                    <h1>Přihlášení</h1>
                </div>

                <form>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Uživatelské jméno</label>
                        <input type="text" className="form-control" id="usernameInputId" aria-describedby="usernameHelp" placeholder="Zadejte uživatelské jméno"
                            value={name} onChange={handleNameChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Heslo</label>
                        <input type="password" className="form-control" id="passwordInputId" aria-describedby="passwordHelp" placeholder="Zadejte Heslo"
                            value={password} onChange={handlePasswordChange} />
                    </div>

                    {errorStr && <small style={{ color: 'red' }}>{errorStr}</small>}

                    <div className='m-1 text-center'>
                        <button className='btn btn-primary w-100' type="button" onClick={handleFormSubmit}>Přihlásit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
