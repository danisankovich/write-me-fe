import React, { Component } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import './tracker.scss';

class tracker extends Component {
    constructor(props) {
        super(props)
        this.state = {showNewForm: false, trackers: [], newTrackerSetForm: false, currentTrackerIndex: 0}
    }

    componentDidMount() {
        this.fetchTrackers();
    }

    fetchTrackers() {
        fetch('http://localhost:3001/api/users/tracker', {
            method: 'GET',
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        }).then(res => res.json()).then(trackers => {
            this.setState({trackers});
        });
    }

    toggleNewForm(newState) {
        this.setState({showNewForm: newState });
    }

    createNewForm(e) {
        e.preventDefault();
        this.toggleNewForm(false);

        fetch('http://localhost:3001/api/users/tracker/new', {
            method: 'POST',
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: this.state.title })
        }).then(res => res.json()).then(() => {
            this.fetchTrackers();
        });
    }

    handleChange(type, e) {
        this.setState({[type]: e.target.value});
    }

    newTrackerForm() {
        if (this.state.showNewForm) {
            return (<Form onSubmit={this.createNewForm.bind(this)}>
            <Form.Control placeholder="Title" onChange={this.handleChange.bind(this, 'title')}></Form.Control>
            <Button type="submit">Submit</Button>
            <Button variant="danger" type="submit" onClick={this.toggleNewForm.bind(this, false)}>Cancel</Button>
        </Form>);
        }
    }

    addProgress(e) {
        e.preventDefault();
        const { date, wordCount, trackers } = this.state;

        trackers[this.state.currentTrackerIndex].sets.push({date, wordCount});
        this.setState({ trackers, newTrackerSetForm: false })
        // add in, but doesn't save. After using this function as many times as needed, use saveProgress
        // make it so same date overwrites. And the dates aren't pushed. They are inserted into proper place
    }

    removeProgress(date, words) {
        
    }

    saveProgress() {
        fetch('http://localhost:3001/api/users/tracker/save', {
            method: 'put',
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trackers: this.state.trackers })
        }).then(res => res.json()).then(() => {
            this.fetchTrackers();
        });
    }

    changeCurrentTrackerIndex(i) {
        this.setState({currentTrackerIndex: i})
    }

    toggleNewTrackerSetForm() {
        this.setState({newTrackerSetForm: !this.state.newTrackerSetForm})
    }

    render() {
        const { user } = this.props;

        return (
            <div>
                {user && <div>
                    <h2>{user.username}'s Progress Tracker</h2>

                    {!this.state.showNewForm && <Button onClick={this.toggleNewForm.bind(this, true)}>Create New Tracker</Button>}
                    {this.newTrackerForm()}
                    {this.state.trackers && this.state.trackers.map((tracker, i) => {
                        return (
                            <div key={i} onClick={this.changeCurrentTrackerIndex.bind(this, i)}>{tracker.title}</div>
                        )
                    })}
                    {this.state.trackers.length && <div>
                        <h4>{this.state.trackers[this.state.currentTrackerIndex].title}</h4>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Words Written</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.trackers[this.state.currentTrackerIndex].sets.map((set, i) => (<tr key={i}>
                                    <td>{set.date}</td>
                                    <td>{set.wordCount}</td>
                                </tr>))}
                            </tbody>
                        </Table>
                        {!this.state.newTrackerSetForm && <div>
                            <Button onClick={this.toggleNewTrackerSetForm.bind(this)}>Add Date</Button>
                            <Button variant='success' onClick={this.saveProgress.bind(this)}>Save Changes</Button>
                        </div>}
                        {this.state.newTrackerSetForm && <Form onSubmit={this.addProgress.bind(this)}>
                            <Form.Control placeholder="Date" onChange={this.handleChange.bind(this, 'date')}></Form.Control>    
                            <Form.Control placeholder="Word Count" onChange={this.handleChange.bind(this, 'wordCount')}></Form.Control>    
                            <Button type="submit">Add Progress</Button>
                        </Form>}
                    </div>}
                </div>}
            </div>
        )
    }
}

export default tracker;