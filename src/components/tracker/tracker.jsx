import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import './tracker.scss';

export default function Tracker(props) {
    const [ showNewForm, setShowNewForm ] = useState(false);
    const [ trackers, setTrackers ] = useState([]);
    const [ newTrackerSetForm, setNewTrackerSetForm ] = useState(false);
    const [ currentTrackerIndex, setCurrentTrackerIndex ] = useState(0);
    const [ currentTracker, setCurrentTracker ] = useState(null);
    const [ title, setTitle ] = useState('');
    const [ date, setDate ] = useState('');
    const [ wordCount, setWordCount ] = useState(0);
    const [ totalWordCount, setTotalWordCount ] = useState(0);
    const { user } = props;

    useEffect(() => {
        fetchTrackers();
    }, [props.user]);

    
    useEffect(() => {
        setCurrentTracker(trackers[currentTrackerIndex]);
        if (currentTracker && currentTracker.sets.length > 1) {
            setTotalWordCount(currentTracker.sets.reduce((a, b) =>  a.wordCount + b.wordCount));
        } else if (currentTracker && currentTracker.sets.length === 1) {
            setTotalWordCount(currentTracker.sets[0].wordCount);
        } else {
            setTotalWordCount(0);
        }
    }, [currentTrackerIndex, trackers, currentTracker]);

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
            const [year, month, day] = e.target.value.split('-');
            const newDate = `${month}/${day}/${year}`;
            setDate(newDate);
        }
        if (type === 'wordCount') {
            setWordCount(parseInt(e.target.value));
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

        const foundIndex = currentTracker.sets.findIndex(set => set.date === date);
        if (foundIndex > -1) {
            currentTracker.sets[foundIndex] = {date, wordCount};
        } else {
            currentTracker.sets.push({date, wordCount});
        }
        currentTracker.sets.sort((a, b) => {
            return a.date > b.date ? 1 : -1;
        })
        setTrackers(trackers);
        setNewTrackerSetForm(false);
        setTotalWordCount(totalWordCount + wordCount);
    }

    function removeProgress(i) {
        currentTracker.sets.splice(i, 1);
        setTrackers([...trackers]);
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

    function changeCurrentTrackerIndex(e) {
        setCurrentTrackerIndex(e.target.value);
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
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Tracker</Form.Label>
                    <Form.Control as="select" value={currentTrackerIndex} onChange={(e) => changeCurrentTrackerIndex(e)}>
                        {trackers && trackers.map((tracker, i) => {
                            return (
                                <option key={i} value={i}>{tracker.title}</option>
                            )
                        })}
                    </Form.Control>
                </Form.Group>

                {!!currentTracker && <div>
                    <h4>{currentTracker.title}: {totalWordCount} Words</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Words Written</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTracker.sets.map((set, i) => (<tr key={i}>
                                <td>{set.date}</td>
                                <td>{set.wordCount}</td>
                                <td><div className="removeItem" onClick={() => removeProgress(i)}><span>X</span></div></td>
                            </tr>))}
                        </tbody>
                    </Table>
                    {!newTrackerSetForm && <div>
                        <Button onClick={toggleNewTrackerSetForm}>Add Date</Button>
                        <Button variant='success' onClick={saveProgress}>Save Changes</Button>
                    </div>}
                    {newTrackerSetForm && <Form onSubmit={addProgress}>
                        <Form.Control placeholder="Date" type="date" onChange={(e) => handleChange('date', e)}></Form.Control>    
                        <Form.Control placeholder="Word Count" type="number" onChange={(e) => handleChange('wordCount', e)}></Form.Control>    
                        <Button type="submit">Add Progress</Button>
                    </Form>}
                </div>}
            </div>}
        </div>
    )
}