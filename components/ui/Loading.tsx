import React from 'react';

interface LoadingProps {
	message?: string;
	size?: 'small' | 'medium' | 'large';
	variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
	overlay?: boolean;
	className?: string;
}

const Loading: React.FC<LoadingProps> = ({
	message = 'Loading...',
	size = 'medium',
	variant = 'spinner',
	overlay = true,
	className = '',
}) => {
	// Size configurations
	const sizeConfig = {
		small: {
			spinner: 'w-8 h-8',
			text: 'text-sm',
			dots: 'w-1 h-1',
			container: 'space-y-3',
		},
		medium: {
			spinner: 'w-12 h-12',
			text: 'text-lg',
			dots: 'w-2 h-2',
			container: 'space-y-4',
		},
		large: {
			spinner: 'w-16 h-16',
			text: 'text-2xl',
			dots: 'w-3 h-3',
			container: 'space-y-6',
		},
	};

	const config = sizeConfig[size];

	// Spinner Variant
	const SpinnerLoader = () => (
		<div className='relative'>
			<div
				className={`${config.spinner} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
				<div
					className={`${config.dots} bg-blue-600 rounded-full animate-pulse`}></div>
			</div>
		</div>
	);

	// Bouncing Dots Variant
	const DotsLoader = () => (
		<div className='flex space-x-2'>
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					className={`${config.dots} bg-blue-500 rounded-full animate-bounce`}
					style={{ animationDelay: `${i * 150}ms` }}></div>
			))}
		</div>
	);

	// Pulse Variant
	const PulseLoader = () => (
		<div className='flex space-x-1'>
			{[0, 1, 2, 3].map((i) => (
				<div
					key={i}
					className={`${config.dots} bg-blue-500 rounded-full animate-pulse`}
					style={{ animationDelay: `${i * 200}ms` }}></div>
			))}
		</div>
	);

	// Bars Variant
	const BarsLoader = () => (
		<div className='flex items-end space-x-1'>
			{[0, 1, 2, 3, 4].map((i) => (
				<div
					key={i}
					className='bg-blue-500 rounded-sm animate-pulse'
					style={{
						width: size === 'small' ? '3px' : size === 'medium' ? '4px' : '5px',
						height:
							size === 'small' ? '16px' : size === 'medium' ? '24px' : '32px',
						animationDelay: `${i * 100}ms`,
						animationDuration: '1s',
					}}></div>
			))}
		</div>
	);

	// Select the appropriate loader
	const renderLoader = () => {
		switch (variant) {
			case 'spinner':
				return <SpinnerLoader />;
			case 'dots':
				return <DotsLoader />;
			case 'pulse':
				return <PulseLoader />;
			case 'bars':
				return <BarsLoader />;
			default:
				return <SpinnerLoader />;
		}
	};

	// Container classes
	const containerClasses = overlay
		? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center'
		: 'flex items-center justify-center';

	return (
		<div className={`${containerClasses} ${className}`}>
			<div className={`flex flex-col items-center ${config.container}`}>
				{/* Loader Animation */}
				<div className='flex items-center justify-center'>{renderLoader()}</div>

				{/* Loading Message */}
				{message && (
					<div className='text-center'>
						<p className={`font-medium text-gray-700 ${config.text}`}>
							{message}
						</p>
					</div>
				)}

				{/* Progress Bar (only for spinner variant) */}
				{variant === 'spinner' && (
					<div
						className={`bg-gray-200 rounded-full h-1 ${
							size === 'small' ? 'w-32' : size === 'medium' ? 'w-48' : 'w-64'
						}`}>
						<div
							className='bg-blue-600 h-1 rounded-full animate-pulse'
							style={{
								width: '65%',
								animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
							}}></div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Loading;
