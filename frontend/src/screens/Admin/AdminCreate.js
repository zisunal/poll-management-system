import Header from "../../components/admin/home/Header"
import CreateForm from "../../components/admin/create/CreateForm"
import { useEffect } from 'react'

const AdminHome = () => {
    useEffect(() => {
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
            }
        }
    }, [])
    return (
        <div className="home-page">
            <Header />
            <CreateForm />
        </div>
    )
}

export default AdminHome