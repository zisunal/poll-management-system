import Swal from 'sweetalert2';
import { useState } from 'react';
import Loading from '../../loading';

const CreateForm = () => {
    const [creating, setCreating] = useState(false);
    const createPoll = () => {
        if (creating) return;
        setCreating(true);
        const question = document.getElementById('question');
        const options = document.getElementById('options');
        const startingTime = document.getElementById('starting-time');
        const endingTime = document.getElementById('ending-time');

        fetch(process.env.REACT_APP_API_URL + 'auth/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
            },
            body: JSON.stringify({
                'question': question.value,
                'options': options.value,
                'start_at': startingTime.value,
                'end_at': endingTime.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Poll created successfully!',
                });
                question.value = '';
                options.value = '';
                startingTime.value = '';
                endingTime.value = '';
                setCreating(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error,
                });
                setCreating(false);
            }
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something horribly went wrong!',
            });
            setCreating(false);
        });
    }
    return (
        <div className="create-form">
            <div className="form-group">
                <label htmlFor="question">Question</label>
                <input type="text" id="question" name="question" />
            </div>
            <div className="form-group">
                <label htmlFor="options">Options (Seperate by comma(,))</label>
                <textarea id="options" name="options"></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="starting-time">Starting Time (UTC)</label>
                <input type="datetime-local" id="starting-time" name="starting-time" />
            </div>
            <div className="form-group">
                <label htmlFor="ending-time">Ending Time (UTC)</label>
                <input type="datetime-local" id="ending-time" name="ending-time" />
            </div>
            <button onClick={createPoll}>
                {creating ? <Loading /> : 'Create Poll'}
            </button>
        </div>
    );
}

export default CreateForm