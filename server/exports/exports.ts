export type CorsCallback = (error: Error | null, success: boolean) => void;

export interface Entity {
	id: string;
	username: string;
	index_number: string;
	groupid: string;
	coursecode: string;
	last_checked: Date;
	checked: string;
}

export interface LecturerType extends Omit<Entity, "index_number"> {
	coursename: string;
}

export const HTML = (code: string, username: any) => {
	return `<div
	style="
		max-width: 600px;
		margin: 20px auto;
		background-color: #ffffff;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	"
>
	<!-- Header -->
	<div
		style="
			background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
			padding: 40px 20px;
			text-align: center;
		"
	>
		<h1
			style="
				color: white;
				margin: 0;
				font-size: 28px;
				letter-spacing: 1px;
			"
		>
			Hello ${username}
		</h1>
		<p
			style="
				color: rgba(255, 255, 255, 0.9);
				margin: 10px 0 0;
				font-size: 16px;
			"
		>
			Verify Your Email Address
		</p>
	</div>
	<!-- Main Content -->
	<div style="padding: 40px">
		<h2
			style="
				color: #1f2937;
				margin-top: 0;
				font-size: 22px;
				text-align: center;
			"
		>
			Welcome to ClassTrack!
		</h2>
		<p
			style="
				color: #4b5563;
				line-height: 1.6;
				text-align: center;
				margin: 20px 0;
			"
		>
			You're just one step away from simplifying attendance management
			with ClassTrack. Use the verification code below to verify your
			email and get started.
		</p>
		<!-- Verification Code Box -->
		<div
			style="
				background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
				margin: 30px 0;
				padding: 25px;
				border-radius: 12px;
				text-align: center;
			"
		>
			<p style="color: #4f46e5; font-size: 14px; margin: 0 0 10px">
				Your verification code is:
			</p>
			<div
				style="
					font-size: 32px;
					letter-spacing: 8px;
					color: #4f46e5;
					font-weight: bold;
					font-family: monospace;
					margin: 10px 0;
				"
			>
				${code}
			</div>
			<p style="color: #6b7280; font-size: 13px; margin: 10px 0 0">
				Code expires in 5 minutes
			</p>
		</div>
		<!-- Features Preview -->
		<div
			style="
				margin: 30px 0;
				padding: 20px;
				background-color: #f9fafb;
				border-radius: 8px;
			"
		>
			<h3
				style="
					color: #4f46e5;
					margin: 0 0 15px;
					font-size: 16px;
					text-align: center;
				"
			>
				What's waiting for you:
			</h3>
			<div style="display: block; text-align: center">
				<div style="display: inline-block; margin: 10px 20px">
					<span style="font-size: 24px">✅</span>
					<p style="margin: 5px 0; color: #4b5563; font-size: 14px">
						Simple Attendance Ticker
					</p>
				</div>
				<div style="display: inline-block; margin: 10px 20px">
					<span style="font-size: 24px">📑</span>
					<p style="margin: 5px 0; color: #4b5563; font-size: 14px">
						Sheet Reports
					</p>
				</div>
			</div>
		</div>
		<!-- Security Notice -->
		<div
			style="
				background-color: #f3f4f6;
				border-radius: 8px;
				padding: 15px;
				margin-top: 30px;
			"
		>
			<p
				style="
					color: #6b7280;
					font-size: 13px;
					margin: 0;
					text-align: center;
				"
			>
				If you didn't request this verification code, please ignore this
				email or contact our support team.
			</p>
		</div>
	</div>
	<!-- Footer -->
	<div
		style="
			padding: 20px;
			background-color: #f9fafb;
			border-top: 1px solid #e5e7eb;
			text-align: center;
		"
	>
		<p style="color: #6b7280; font-size: 12px; margin: 0">
			&copy; 2025 ClassTrack. All rights reserved.<br />Contact: +233 55
			535 9339/53 930 4654
		</p>
	</div>
</div>
`;
};
