import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Swal from 'sweetalert2';
import Loading from '../../loading';

const Poll = ({poll}) => {
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);

    const deletePoll = (e) => {
        if (deleting) return;
        setDeleting(true);
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#007bff',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(process.env.REACT_APP_API_URL + 'auth/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
                    },
                    body: JSON.stringify({
                        'id': poll.id,
                        'ct': new Date().toISOString().slice(0, 19).replace('T', ' ')
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Poll deleted successfully!',
                        });
                        setDeleting(false);
                        e.target.closest('.poll').remove();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.error,
                        });
                        setDeleting(false);
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something horribly went wrong!',
                    });
                    setDeleting(false);
                });
            } else {
                setDeleting(false);
            }
        });
    }
    
    const openEditPanel = () => {
        Swal.fire({
            title: 'Edit Poll',
            html: `
                <div class="form-group">
                    <label for="question">Question</label>
                    <input type="text" id="question" name="question" value="${poll.question}" />
                </div>
                <div class="form-group">
                    <label for="options">Options</label>
                    <input type="text" id="options" name="options" value="${poll.options.join(',')}" />
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#dc3545',
            preConfirm: () => {
                const question = document.getElementById('question').value;
                const options = document.getElementById('options').value;
                fetch(process.env.REACT_APP_API_URL + 'auth/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token')
                    },
                    body: JSON.stringify({
                        'id': poll.id,
                        'question': question,
                        'options': options,
                        'ct': new Date().toISOString().slice(0, 19).replace('T', ' ')
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Poll updated successfully!',
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.error,
                        });
                        setEditing(false);
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something horribly went wrong!',
                    });
                    setEditing(false);
                });
            }
        });
    }

    return (
        <div className='poll'>
            <h2 className="poll-title">{poll.question}</h2>
            <div className='poll-options'>
                {
                    poll.options.map((option, index) => (
                        <div className="poll-option" key={index}>{option}</div>
                    ))
                }
            </div>
            <div className='poll-footer'>
                <button className='btn btn-primary' onClick={openEditPanel}>
                    {
                        editing ? <Loading /> : <FontAwesomeIcon icon={faPen} />
                    }
                </button>
                <button className='btn btn-danger' onClick={deletePoll}>
                    {
                        deleting ? <Loading /> : <FontAwesomeIcon icon={faTrash} />
                    }
                </button>
            </div>
        </div>
    );
}

export default Poll;