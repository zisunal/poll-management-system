import Header from "../../components/admin/home/Header"
import Poll from "../../components/admin/not-started/Poll"
import { useState, useEffect } from 'react'
import Loading from '../../components/loading'

const AdminHome = () => {
    const [polls, setPolls] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPolls = async () => {
            const ct = new Date().toISOString().slice(0, 19).replace('T', ' ')
            fetch(process.env.REACT_APP_API_URL + 'auth/not-started/' + ct, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
                }
            })
            .then(res => res.json())
            .then(data => {
                setPolls(data.polls)
                setLoading(false)
            })
        }
        if (!window.localStorage.getItem('poll-admin-token')) {
            window.location.href = '/login'
        } else {
            const res = fetch(process.env.REACT_APP_API_URL + 'auth/verify', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
                }
            })
            if (res.status === 401) {
                window.localStorage.removeItem('poll-admin-token')
                window.location.href = '/login'
            } else {
                fetchPolls()
            }
        }
    }, [])

    return (
        <div className="home-page">
            <Header />
        {
            loading ? (
                <div className='ctrized'>
                    <Loading />
                </div> 
            ) :
            polls.map(poll => (
                <Poll key={poll.id} poll={poll} />
            ))
        }
        </div>
    )
}

export default AdminHome