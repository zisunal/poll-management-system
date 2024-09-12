import Header from "../../components/admin/home/Header"
import Poll from "../../components/admin/home/Poll"
import { useEffect, useState } from 'react'
import Loading from "../../components/loading"

const AdminHome = () => {
    const [polls, setPolls] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchPolls = async () => {
            const ct = new Date().toISOString().slice(0, 19).replace('T', ' ')
            const res = await fetch(process.env.REACT_APP_API_URL + 'auth/running-admin/' + ct, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
                }
            })
            const data = await res.json()
            if (res.status === 401) {
                window.localStorage.removeItem('poll-admin-token')
                window.location.href = '/login'
            } else {
                setPolls(data.polls)
                setLoading(false)
            }
            
        }
        fetchPolls()
    }, [])

    return (
        <div className="home-page">
            <Header />
        {
            loading ? (
                <div className="ctrized">
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