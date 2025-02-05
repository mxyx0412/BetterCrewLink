import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';

interface TestMicProps {
	microphone: string;
}

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	bar: {
		height: 8,
		margin: '5px auto',
		width: 200,
	},
	inner: {
		transition: 'transform .05s linear',
	},
}));

const TestMicrophoneButton: React.FC<TestMicProps> = function ({ microphone }: TestMicProps) {
	const classes = useStyles();
	const [error, setError] = useState<boolean>(false);
	const [rms, setRms] = useState<number>(0);

	useEffect(() => {
		setError(false);

		const ctx = new AudioContext();
		const processor = ctx.createScriptProcessor(2048, 1, 1);
		processor.connect(ctx.destination);

		const minUpdateRate = 50;
		let lastRefreshTime = 0;

		const handleProcess = (event: AudioProcessingEvent) => {
			// limit update frequency
			if (event.timeStamp - lastRefreshTime < minUpdateRate) {
				return;
			}

			// update last refresh time
			lastRefreshTime = event.timeStamp;

			const input = event.inputBuffer.getChannelData(0);
			const total = input.reduce((acc, val) => acc + Math.abs(val), 0);
			const rms = Math.min(0.5, Math.sqrt(total / input.length));
			setRms(rms);
		};

		// @ts-ignore-line
		const audio_options: any = {
			deviceId: microphone ?? 'default',
			autoGainControl: false,
			echoCancellation: false,
			noiseSuppression: false,
			googEchoCancellation: false,
			googAutoGainControl2: false,
			googNoiseSuppression: false,
			googHighpassFilter: false,
			googTypingNoiseDetection: false,
		};

		navigator.mediaDevices
			.getUserMedia({
				audio: audio_options,
				video: false,
			})
			.then((stream) => {
				const src = ctx.createMediaStreamSource(stream);
				src.connect(processor);
				processor.addEventListener('audioprocess', handleProcess);
			})
			.catch(() => setError(true));

		return () => {
			processor.removeEventListener('audioprocess', handleProcess);
		};
	}, [microphone]);

	if (error) {
		return <Typography color="error">不能连接麦克风</Typography>;
	} else {
		return (
			<div className={classes.root}>
				<LinearProgress
					classes={{
						root: classes.bar,
						bar: classes.inner,
					}}
					color="secondary"
					variant="determinate"
					value={rms * 2 * 100}
				/>
			</div>
		);
	}
};

export default TestMicrophoneButton;
