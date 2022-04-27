import { useState, useEffect } from 'react';
import './App.scss';
import _jobs from './data/jobs.json';
import { JobsFull } from './components/JobsFull';
import { JobsList } from './components/JobsList';

const techItemsUrl = 'https://edwardtanguay.netlify.app/share/techItems.json';

_jobs.forEach((job) => {
	job.status = 'accepted';
});

const statuses = ['send', 'wait', 'interview', 'declined', 'accepted'];

let _techItems = [{}];

function App() {
	const [displayKind, setDisplayKind] = useState('');
	const [jobs, setJobs] = useState([]);
	const [techItems, setTechItems] = useState([]);
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

	const saveToLocalStorage = () => {
		const jobAppState = {
			displayKind,
			jobs,
		};
		localStorage.setItem('jobAppState', JSON.stringify(jobAppState));
	};

	const loadFromLocalStorage = () => {
		const jobAppState = JSON.parse(localStorage.getItem('jobAppState'));
		// updateWithJsonFile(_jobs, jobAppState);
		if (jobAppState === null) {
			setDisplayKind('full');
			setJobs(_jobs);
		} else {
			setDisplayKind(jobAppState.displayKind);
			setJobs(jobAppState.jobs);
		}
	};

	const loadTechItems = () => {
		(async () => {
			const response = await fetch(techItemsUrl);
			_techItems = await response.json();
			setTechItems(_techItems);
		})();
	};

	useEffect(() => {
		loadTechItems();
		loadFromLocalStorage();
	}, []);

	useEffect(() => {
		saveToLocalStorage();
	}, [displayKind, jobs]);

	const handleToggleView = () => {
		const _displayKind = displayKind === 'full' ? 'list' : 'full';
		setDisplayKind(_displayKind);
	};

	const handleStatusChange = (job) => {
		let statusIndex = statuses.indexOf(job.status);
		statusIndex++;
		if (statusIndex > statuses.length - 1) {
			statusIndex = 0;
		}
		job.status = statuses[statusIndex];
		setJobs([...jobs]);
	};

	return (
		<div className="App">
			<h1>Job Application Process</h1>
			{/* 	<div>techitems: {techItems.length}</div> */}

			{userIsLoggedIn ? (
				<>
					<button onClick={handleToggleView}>Toggle View</button>
					{displayKind === 'full' ? (
						<JobsFull
							jobs={jobs}
							handleStatusChange={handleStatusChange}
							techItems={techItems}
						/>
					) : (
						<JobsList jobs={jobs} />
					)}
				</>
			) : (
				<div> <form>
				<fieldset>
					<legend>Welcome</legend>
					<div className="row">
						<label htmlFor="login">Login</label>
						<input type="text" id="login" />
					</div>
					<div className="row">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" />
					</div>
					<div className="buttonRow">
						<button>Enter</button>
					</div>
				</fieldset>
			</form></div>
			)}
		</div>
	);
}

export default App;
