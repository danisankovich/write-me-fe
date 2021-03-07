import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import './tracker.scss';

export default function Tracker(props) {
    const [ showNewForm, setShowNewForm ] = useState(false);
    const [ trackers, setTrackers ] = useState([]);
    const [ newTrackerSetForm, setNewTrackerSetForm ] = useState(false);
    const [ currentTrackerIndex, setCurrentTrackerIndex ] = useState(0);
    const [ title, setTitle ] = useState('');
    const [ date, setDate ] = useState('');
    const [ wordCount, setWordCount ] = useState(0);
    const { user } = props;

    useEffect(() => {
        fetchTrackers();
    }, [props.user]);

    function fetchTrackers() {
        fetch('http://localhost:3001/api/users/tracker', {
            method: 'GET',
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        }).then(res => res.json()).then(trackers => {
            setTrackers(trackers);
        });
    }

    function toggleNewForm() {
        setShowNewForm(!showNewForm)
    }

    function createNewForm(e) {
        e.preventDefault();
        toggleNewForm(false);

        fetch('http://localhost:3001/api/users/tracker/new', {
            method: 'POST',
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        }).then(res => res.json()).then(() => {
            fetchTrackers();
        });
    }

    function handleChange(type, e) {
        if (type === 'title') {
            setTitle(e.target.value);
        }
        if (type === 'date') {
            setDate(e.target.value);
        }
        if (type === 'wordCount') {
            setWordCount(e.target.value);
        }
    }

    function newTrackerForm() {
        if (showNewForm) {
            return (<Form onSubmit={createNewForm}>
            <Form.Control placeholder="Title" onChange={(e) => handleChange('title', e)}></Form.Control>
            <Button type="submit">Submit</Button>
            <Button variant="danger" type="submit" onClick={toggleNewForm}>Cancel</Button>
        </Form>);
        }
    }

    function addProgress(e) {
        e.preventDefault();

        trackers[currentTrackerIndex].sets.push({date, wordCount});
        setTrackers(trackers);
        setNewTrackerSetForm(false);
        // add in, but doesn't save. After using this function as many times as needed, use saveProgress
        // make it so same date overwrites. And the dates aren't pushed. They are inserted into proper place
    }

    function removeProgress(date, words) {
        
    }

    function saveProgress() {
        fetch('http://localhost:3001/api/users/tracker/save', {
            method: 'put',
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trackers })
        }).then(res => res.json()).then(() => {
            fetchTrackers();
        });
    }

    function changeCurrentTrackerIndex(i) {
        setCurrentTrackerIndex(i);
    }

    function toggleNewTrackerSetForm() {
        setNewTrackerSetForm(!newTrackerSetForm);
    }

    return (
        <div>
            {user && <div>
                <h2>{user.username}'s Progress Tracker</h2>

                {!showNewForm && <Button onClick={toggleNewForm}>Create New Tracker</Button>}
                {newTrackerForm()}
                {trackers && trackers.map((tracker, i) => {
                    return (
                        <div key={i} onClick={() => changeCurrentTrackerIndex(i)}>{tracker.title}</div>
                    )
                })}
                {trackers.length && <div>
                    <h4>{trackers[currentTrackerIndex].title}</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Words Written</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trackers[currentTrackerIndex].sets.map((set, i) => (<tr key={i}>
                                <td>{set.date}</td>
                                <td>{set.wordCount}</td>
                            </tr>))}
                        </tbody>
                    </Table>
                    {!newTrackerSetForm && <div>
                        <Button onClick={toggleNewTrackerSetForm}>Add Date</Button>
                        <Button variant='success' onClick={saveProgress}>Save Changes</Button>
                    </div>}
                    {newTrackerSetForm && <Form onSubmit={addProgress}>
                        <Form.Control placeholder="Date" onChange={(e) => handleChange('date', e)}></Form.Control>    
                        <Form.Control placeholder="Word Count" onChange={(e) => handleChange('wordCount', e)}></Form.Control>    
                        <Button type="submit">Add Progress</Button>
                    </Form>}
                </div>}
            </div>}
        </div>
    )
}