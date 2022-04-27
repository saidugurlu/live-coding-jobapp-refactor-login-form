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
	const [fieldLogin, setFieldLogin] = useState('');
	const [fieldPassword, setFieldPassword] = useState('');

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

	const handleSubmitButton = (e) => {
		e.preventDefault();
	};

	const handleFieldLogin = (e) => {
		setFieldLogin(e.target.value);
	};
	const handleFieldPassword = (e) => {
		setFieldPassword(e.target.value);
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
				<form>
					<fieldset>
						<legend>Welcome</legend>
						<div className="row">
							<label htmlFor="login">Login</label>
							<input
								value={fieldLogin}
								onChange={handleFieldLogin}
								autoFocus
								type="text"
								id="login"
							/>
						</div>
						<div className="row">
							<label htmlFor="password">Password</label>
							<input
								value={fieldPassword}
								onChange={handleFieldPassword}
								type="password"
								id="password"
							/>
						</div>
						<div className="buttonRow">
							<button onClick={handleSubmitButton}>Enter</button>
						</div>
					</fieldset>
				</form>
			)}
		</div>
	);
}

export default App;
