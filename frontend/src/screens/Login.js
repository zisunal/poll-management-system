import {Link, Route} from 'react-router-dom'
import LoginForm from '../components/login/LoginForm'

const Login = () => {
    return (
        <div className='login-page'>
            <h1 className='page-title'>Login to Admin</h1>
            <LoginForm />
        </div>
    )
}

export default Login