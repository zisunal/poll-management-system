import Header from "../../components/admin/home/Header"
import { useState, useEffect } from 'react'
import Swal from "sweetalert2"
import Loading from "../../components/loading"

const AdminProfile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [nameErrors, setNameErrors] = useState([])
    const [emailErrors, setEmailErrors] = useState([])
    const [passErrors, setPassErrors] = useState([])
    const [changing, setChanging] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            if (!window.localStorage.getItem('poll-admin-token')) {
                window.location.href = '/login'
            } else {
                const res = await fetch(process.env.REACT_APP_API_URL + 'auth/verify', {
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
                    const data = await res.json()
                    setName(data.user.name)
                    setEmail(data.user.email)
                }
            }
        }
        fetchUser()
    }, [])
    const handleName = (e) => {
        let errors = []
        const regex = /^[A-Za-z\s]+$/
        if (e.target.value.length < 3) {
            errors.push('Name must be at least 3 characters long')
        }
        if (e.target.value.length > 50) {
            errors.push('Name must be at most 50 characters long')
        }
        if (!regex.test(e.target.value)) {
            errors.push('Name can only contain letters and spaces')
        }
        if (errors.length > 0) {
            setNameErrors(errors)
        } else {
            setNameErrors([])
            setName(e.target.value)
        }
    }
    const handleEmail = (e) => {
        let errors = []
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (!regex.test(e.target.value)) {
            errors.push('Invalid email format')
        }
        if (errors.length > 0) {
            setEmailErrors(errors)
        } else {
            setEmailErrors([])
            setEmail(e.target.value)
        }
    }
    const handlePass = (e) => {
        let errors = []
        if (e.target.value.length < 8) {
            errors.push('Password must be at least 8 characters long')
        }
        if (e.target.value.length > 20) {
            errors.push('Password must be less than 20 characters long')
        }
        if (!e.target.value.match(/\d/)) {
            errors.push('Password must contain a number')
        }
        if (!e.target.value.match(/[A-Z]/)) {
            errors.push('Password must contain an uppercase letter')
        }
        if (!e.target.value.match(/[a-z]/)) {
            errors.push('Password must contain a lowercase letter')
        }
        if (!e.target.value.match(/[^a-zA-Z0-9]/)) {
            errors.push('Password must contain a special character')
        }
        if (errors.length > 0) {
            setPassErrors(errors)
        } else {
            setPassErrors([])
            setPass(e.target.value)
        }
    }
    const changeProfile = async (e) => {
        e.preventDefault()
        if (changing) return;
        setChanging(true)
        if (nameErrors.length === 0 && emailErrors.length === 0 && passErrors.length === 0) {
            setChanging(true)
            const data = {
                name: name,
                email: email
            }
            if (pass) {
                data.password = pass
            }
            const res = await fetch(process.env.REACT_APP_API_URL + 'auth/change', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
                },
                body: JSON.stringify(data)
            })
            if (res.status === 401) {
                window.localStorage.removeItem('poll-admin-token')
                window.location.href = '/login'
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Profile changed successfully'
                })
                setChanging(false)
            }
        }
    }

    return (
        <div className="home-page">
            <Header />
            <div className="bg-card">
                <h1>Change Profile</h1>
                <form onSubmit={changeProfile}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" onChange={handleName} value={name} className="form-control" />
                    </div>
                    <div className="error">
                    {
                        nameErrors.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))
                    }
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={handleEmail} value={email} className="form-control" />
                    </div>
                    <div className="error">
                    {
                        emailErrors.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))
                    }
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Leave blank to keep unchanged" onChange={handlePass} className="form-control" />
                    </div>
                    <div className="error">
                    {
                        passErrors.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))
                    }
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {
                            changing ? <Loading /> : 'Change'
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminProfile