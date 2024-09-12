import Header from '../components/home/Header'

const Error404 = () => {
    return (
        <div className='home-page'>
            <Header />
            <div className='error-page'>
                <h1>Error 404</h1>
                <p>Page not found</p>
            </div>
            
        </div>
    )
}

export default Error404