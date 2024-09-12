import { useEffect, useState } from 'react';

const Poll = ({poll}) => {
    const [maxVotes, setMaxVotes] = useState(0);
    useEffect(() => {
        let max = 0;
        for (const [opt, voteCount] of Object.entries(poll.votes)) {
            if (voteCount > max) {
                max = voteCount;
            }
        }
        setMaxVotes(max);
    }, [poll.votes]);
    return (
        <div className='poll'>
            <h2 className="poll-title">{poll.question}</h2>
            <div className='poll-options'>
                {
                    poll.options.map((option) => (
                        <div className="poll-option" key={option} style={(poll.votes[option] === maxVotes) ? {backgroundColor: 'green', color: '#fff'} : {}}>{`${option} (${poll.votes[option] ?? 0} Votes, ${poll.votes[option] === undefined ? 0 : Math.round((poll.votes[option] / poll.totalVotes) * 100)}%)`}</div>
                    ))
                }
            </div>
            <div className='poll-total-votes'>
                Total Votes: {poll.totalVotes}
            </div>
        </div>
    );
}

export default Poll;