import { useState, useEffect } from 'react'
import Header from '../components/result/Header'
import Poll from '../components/result/Poll'
import Loading from '../components/loading'

const Result = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchResults = async () => {
            const ct = new Date().toISOString().slice(0, 19).replace('T', ' ')
            const res = await fetch(process.env.REACT_APP_API_URL + 'polls/finished/' + ct)
            const data = await res.json()
            setResults(data.polls)
            setLoading(false)
        }
        if (window.localStorage.getItem('poll-admin-token')) {
            fetch(process.env.REACT_APP_API_URL + 'auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
                }
            }).then(response => {
                if (response.status === 401) {
                    window.localStorage.removeItem('poll-admin-token');
                    fetchResults();
                } else {
                    window.location.href = '/admin/finished';
                }
            });
        }
    }, [])
    return (
        <div className='home-page'>
            <Header />
            {
                loading ? (
                    <div className='ctrized'>
                        <Loading />
                    </div> 
                ) :
                results.map(poll => (
                    <Poll key={poll.id} poll={poll} />
                ))
            }
        </div>
    );
}

export default Result;