import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { io } from "socket.io-client";
import { Paper, TextField, Typography, Snackbar } from "@mui/material";
import AppbarComp from "./AppbarComp";

const socketUri = "http://192.168.43.81:3100";
export default function Main() {
	const [modal, setModal] = React.useState(false);
	const [sender, setSender] = React.useState({
		username: "",
		id: "",
		message: "",
	});
	const [socket, setSocket] = React.useState(null);
	const [message, setMessage] = React.useState([]);
	const [error, setError] = React.useState(false);

	React.useEffect(() => {
		setSocket(io(socketUri, { transports: ["websocket"] }));
	}, []);

	const handleOpen = () => setModal(true);

	const handelEmit = () => {
		const { username, message } = sender;
		if (username && message) {
			socket.emit("message", {
				username: username,
				message: message,
			});
			setSender((prev) => ({
				...prev,
				message: "",
			}));
		} else {
			setError(true);
		}
	};

	React.useEffect(() => {
		socket &&
			socket.on("getMyId", (id) => {
				setSender((prev) => ({ ...prev, id: socket.id }));
			});
		socket &&
			socket.on("broadcast", (data) => {
				setMessage((prev) => [...prev, data]);
			});
	}, [socket]);

	console.log(message);
	return (
		<div className="App">
			<AppbarComp />
			<Box
				sx={{
					display: "flex",
					height: "100vh",
					justifyContent: "center",
					bgcolor: "background.default",
					color: "text.primary",
					borderRadius: 1,
					p: 3,
				}}
			>
				<Box sx={{ width: "400px" }}>
					<Button fullWidth variant={"contained"} onClick={handleOpen}>
						Add Sender
					</Button>

					<Box
						sx={{ display: "flex", margin: "10px 0", justifyContent: "center" }}
					>
						{sender && sender.username && (
							<Typography
								id="modal-modal-title"
								variant="h6"
								component="h2"
								noWrap
								sx={{ marginBottom: "10px" }}
							>
								Sender : {sender.username}
							</Typography>
						)}
					</Box>
					<Box
						sx={{
							height: "400px",
							margin: "10px 0",
							border: "1px solid lightgrey",
							borderRadius: "16px 0 0 16px",
							overflowY: "scroll",
							display: "flex",
							flexDirection: "column",
							"&::-webkit-scrollbar": {
								width: 5,
							},

							"&::-webkit-scrollbar-track": {
								boxShadow: "inset 0 0 5px grey",
							},

							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "secondary.main",
								borderRadius: 10,
								"&:hover": {
									backgroundColor: "primary.main",
								},
							},
						}}
					>
						{message &&
							message.length > 0 &&
							message.map((ele) => (
								<Paper
									elevation={2}
									sx={{
										borderRadius: "10px",
										margin: "10px",
										width: "max-content",
										padding: "5px 10px",
										placeSelf: sender && sender.id === ele.id ? "end" : "start",
									}}
									key={Math.random()}
								>
									<Typography variant="subtitle2" color="textSecondary">
										{ele.username}
									</Typography>
									<Button disableFocusRipple disableElevation disableRipple>
										{ele.message}
									</Button>
								</Paper>
							))}
					</Box>
					<TextField
						autoFocus
						name="message"
						fullWidth
						value={sender && sender.message}
						label="Message"
						onChange={({ target: { name, value } }) =>
							setSender((prev) => ({
								...prev,
								[name]: value,
							}))
						}
						onKeyPress={(e) => {
							if (e.code === "Enter") {
								handelEmit();
							}
						}}
						placeholder="Enter Message"
					/>
					<Button
						fullWidth
						color="secondary"
						sx={{ m: "10px 0" }}
						onClick={handelEmit}
					>
						Send Message
					</Button>
				</Box>
			</Box>
			{modal && (
				<BasicModal setOpen={setModal} open={modal} setSender={setSender} />
			)}
			{error && (
				<Snackbar
					open={error}
					autoHideDuration={6000}
					onClose={() => {
						setError(false);
					}}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					message={"Check the sender and message "}
				/>
			)}
		</div>
	);
}

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "100%",
	maxWidth: "300px",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

function BasicModal({ setOpen, open, setSender }) {
	const handleClose = () => setOpen(false);

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
						color="textPrimary"
						sx={{ marginBottom: "20px" }}
					>
						Enter Name of Sender
					</Typography>
					<TextField
						onKeyPress={(e) => {
							if (e.code === "Enter") {
								handleClose();
							}
						}}
						autoFocus
						name="username"
						fullWidth
						label="Sender Name"
						placeholder="Enter Sender Name"
						onChange={({ target: { name, value } }) =>
							setSender((prev) => ({ ...prev, [name]: value }))
						}
					/>
				</Box>
			</Modal>
		</div>
	);
}
