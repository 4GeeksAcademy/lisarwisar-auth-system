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
				const loginURL = process.env.BACKEND_URL + "/api/login";
				let status = "error"

				fetch(loginURL, {
					method: "POST",
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						"email": email,
						"password": password
					}), 
				})
				.then (response => {
					return response.json();
				})
				.then(data => {
					if (data?.status == "success"){
						localStorage.setItem("jwt-token", data?.token)
						status = data?.status
					}
					else{
						console.log("Invalid email or password")
					}
				})
				.catch(error => {
					console.log(error);
				})

				console.log("fetch: ", status)
				return (status)
			},

			signup: async(email, password) => {

				const signupURL = process.env.BACKEND_URL + "/api/signup";
				let status = "error"
				
				fetch(signupURL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				})
				.then(response => {
					return response.json();
				})
				.then(data => {
					if (data?.status == "success"){
						status =  data?.status
					}
				})
				.catch(error => {
					console.log(error)
				})

				return(status)
			},

			logout: () => {
				localStorage.setItem("jwt-token", "")
			}
		}
	};
};

export default getState;
