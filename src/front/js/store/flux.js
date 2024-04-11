import { useNavigate } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			login: async (email, password) => {
				const loginURL = `https://turbo-train-5r77vrqj5rjcp6v9-3001.app.github.dev/login`;
				const navigate = useNavigate()
				let status = "error"

				await fetch(loginURL, {
					method: "POST",
					body: JSON.stringify({
						"email": email,
						"password": password
					}), 
					headers: {'Content-Type': 'application/json'}
				})
				.then (response => {
					return response.json();
				})
				.then(data => {
					if (data?.status == "success"){
						localStorage.setItem("jwt-token", data?.token)
						navigate("/private")
					}
					else{
						console.log("Invalid email or password")
					}
				})
				.catch(error => {
					console.log(error);
				})

				return (status)
			},

			signup: async(email, password) => {

				const signupURL = `https://turbo-train-5r77vrqj5rjcp6v9-3001.app.github.dev/signup`;
				
				fetch(signupURL, {
					method: "POST",
						headers: {
							"Content-Type": "application/json",
							'Authorization': 'Bearer ' + token //authorization token
						},
					body: JSON.stringify({
						"email": email,
						"password": password
				})})
				.then(response => {
					return response.json();
				})
				.then(data => {
					if (data.status =! "done"){
						navigate("/login")
					}
					else{
						console.log("There has been an error")
					}
				})
				.catch(error => {
					console.error(error)
				})
			},

			logout: () => {
				localStorage.setItem("jwt-token", "")
			}
		}
	};
};

export default getState;
