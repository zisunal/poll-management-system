import { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Poll from '../components/home/Poll'
import Loading from '../components/loading'

const Home = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            const ct = new Date().toISOString();
            const response = await fetch(process.env.REACT_APP_API_URL + 'polls/running/' + ct);
            const data = await response.json();
            setPolls(data.polls);
            setLoading(false);
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
                    fetchPolls();
                } else {
                    window.location.href = '/admin';
                }
            });
        }
    }, []);
    
    return (
        <div className='home-page'>
            <Header />
            {
                loading ?
                    <div className='ctrized'> <Loading /> </div> :
                polls.length === 0 ?
                    <div>No Polls Found</div> :
                    polls.map(poll => (
                        <Poll key={poll.id} poll={poll} />
                    ))
            }
        </div>
    )
}

export default Home