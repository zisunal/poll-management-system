import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Loading from '../loading';

const Poll = ({poll}) => {
    const [endingCountDown, setEndingCountDown] = useState('');
    const [timeWidthPercentage, setTimeWidthPercentage] = useState('');
    const disabledOptions = document.querySelectorAll('.should-disable');
    const [voting, setVoting] = useState(false);

    useEffect(() => {
        setInterval(() => {
            const now = new Date();
            const endingTime = new Date(poll.end_at);
            const startTime = new Date(poll.start_at);
            const diff = endingTime - now;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            setEndingCountDown(`${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`);
            const total = endingTime - startTime;
            const remaining = endingTime - now;
            const percentage = (remaining / total) * 100;
            setTimeWidthPercentage(percentage + '%');
        }, 1000);
        disabledOptions.forEach((option) => {
            option.disabled = true;
        })
    }, [poll.end_at, poll.start_at]);

    const handleVote = (e) => {
        if (poll.isVoted) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You have already voted on this poll!',
            });
            setVoting(false);
            return;
        }
        if (new Date(poll.endingTime) < new Date()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Poll has ended!',
            });
            setVoting(false);
            return;
        }
        
        Swal.fire({
            title: "Are you sure to vote on this option?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, confirm it!"
          }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await fetch(process.env.REACT_APP_API_URL + 'vote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            poll_id: poll.id,
                            option: e.target.textContent,
                        }),
                    });
                    if (response.status === 200) {
                        e.target.classList.add('selected');
                        e.target.parentNode.childNodes.forEach((option) => {
                            if (option !== e.target) {
                                option.disabled = true;
                            }
                        });
                        let voteCount = document.querySelector('.voteCount-' + poll.id);
                        voteCount.textContent = parseInt(voteCount.textContent) + 1;
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.message,
                        });
                    }
                }
          });   
    }

    const changeVote = (e) => {
        if (poll.isVoted && poll.changed_at != null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You have already changed your vote once!',
            });
            return;
        } else {
            Swal.fire({
                title: "Are you sure to change vote on this option?",
                text: "This can be changed only once. You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, confirm it!"
              }).then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await fetch(process.env.REACT_APP_API_URL + 'vote', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                poll_id: poll.id,
                                option: e.target.textContent,
                            }),
                        });
                        if (response.status === 200) {
                            setVoting(false);
                            e.target.classList.add('selected');
                            e.target.parentNode.childNodes.forEach((option) => {
                                if (option !== e.target) {
                                    option.disabled = true;
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: response.message,
                            });
                        }
                    }
              });
        }
    }

    return (
        <div className='poll'>
            <h2 className="poll-title">{poll.question}</h2>
            <div className='poll-options'>
                {
                    voting ? <Loading /> :
                    !poll.isVoted ? (
                        poll.options.map(option => (
                            <button className="poll-option" key={option} onClick={handleVote}>{option}</button>
                        ))
                    ) : (
                        poll.options.map(option => (
                            <button className={`poll-option should-disable ${poll.votedOption === option ? 'selected' : ''}`} onClick={changeVote} key={option}>{option}</button>
                        ))
                    )
                }
            </div>
            <div className='poll-total-votes'>
                Total Votes: <span className={'voteCount-' + poll.id}>{poll.totalVotes}</span>
            </div>
            <div className='poll-ending-time'>
                <div className="progress-outer">
                    <div className="progress-inner" style={{width: timeWidthPercentage}}></div>
                </div>
                <div className="remaining-time">
                    {
                        new Date(poll.end_at) > new Date() ? (
                            <>
                                <span>{endingCountDown}</span>
                            </>
                        ) : (
                            <span>Poll Ended</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Poll;