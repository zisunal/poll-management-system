import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause, faStop, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../loading';

const Poll = ({poll}) => {
    const [maxVotes, setMaxVotes] = useState(0);
    const [endingCountDown, setEndingCountDown] = useState('');
    const [pausing, setPausing] = useState(false);
    const [resuming, setResuming] = useState(false);
    const [stopping, setStopping] = useState(false);
    const [stoppped, setStopped] = useState(false);
    const [isActive, setIsActive] = useState(poll.is_active);

    useEffect(() => {
        let max = 0;
        for (const [opt, voteCount] of Object.entries(poll.votes)) {
            if (voteCount > max) {
                max = voteCount;
            }
        }
        setMaxVotes(max);
        setInterval(() => {
            const now = new Date();
            const endingTime = new Date(poll.end_at);
            const diff = endingTime - now;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            setEndingCountDown(`${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`);
        }, 1000);
    }, [poll.votes, poll.endingTime]);

    const pausePoll = async () => {
        if (pausing) {
            return;
        }
        setPausing(true);
        const res = await fetch(process.env.REACT_APP_API_URL + 'auth/pause', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token'),
            },
            body: JSON.stringify({
                id: poll.id,
                ct: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }),
        });
        if (res.ok) {
            setPausing(false);
            setIsActive(false);
        }
    }

    const resumePoll = async () => {
        if (resuming) {
            return;
        }
        setResuming(true);
        const res = await fetch(process.env.REACT_APP_API_URL + 'auth/resume', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token'),
            },
            body: JSON.stringify({
                id: poll.id,
                ct: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }),
        });
        if (res.ok) {
            setResuming(false);
            setIsActive(true);
        }
    }

    const stopPoll = async () => {
        if (stopping) {
            return;
        }
        setStopping(true);
        const res = await fetch(process.env.REACT_APP_API_URL + 'auth/stop', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('poll-admin-token'),
            },
            body: JSON.stringify({
                id: poll.id,
                ct: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }),
        });
        if (res.ok) {
            setStopping(false);
            setIsActive(false);
            setStopped(true);
        }
    }

    return (
        <div className='poll'>
            <h2 className="poll-title">{poll.question}</h2>
            <div className='poll-options'>
                {
                    poll.options.map((option, index) => (
                        <div className="poll-option" key={option} style={(poll.votes[option] === maxVotes) ? {backgroundColor: 'green', color: '#fff'} : {}}>{`${option} (${poll.votes[option] ?? 0} Votes, ${poll.votes[option] === undefined ? 0 : Math.round((poll.votes[option] / poll.totalVotes) * 100)}%)`}</div>
                    ))
                }
            </div>
            <div className='poll-total-votes d-flex'>
                <span>
                    Total Votes: {poll.totalVotes}
                </span>
                <span>
                    {endingCountDown}
                </span>
            </div>
            {
                stoppped ? (
                    <div className='poll-stopped'>
                        <span>Poll Stopped</span>
                    </div>
                ) : 
                <div className='poll-footer'>
                {
                    isActive ? (
                        <button className='btn btn-primary' onClick={pausePoll}>
                            { pausing ? 
                                <Loading /> : 
                                <FontAwesomeIcon icon={faCirclePause} />
                            }
                        </button>
                    ) : (
                        <button className='btn btn-success' onClick={resumePoll}>
                            { resuming ? 
                                <Loading /> : 
                                <FontAwesomeIcon icon={faCirclePlay} />
                            }
                        </button>
                    )
                }
                    <button className='btn btn-danger' onClick={stopPoll}>
                        {
                            stopping ? 
                                <Loading /> : 
                                <FontAwesomeIcon icon={faStop} onClick={stopPoll} />
                        }
                    </button>
                </div>
            }
            
        </div>
    );
}

export default Poll;