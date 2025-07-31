# 🍲 FlavorFinder
FlavorFinder is a clean and intuitive web application that helps users discover delicious recipes based on their preferences. Whether you're craving pasta, looking for vegetarian dishes, or want to stick to gluten-free meals, FlavorFinder provides a seamless way to search and filter recipes using the Forkify API. Built using HTML, Tailwind CSS, and vanilla JavaScript, this app delivers a responsive and engaging user experience across devices.

# 🧠 Project Overview
The goal of this project was to build a modern, frontend-only application that interfaces with a third-party API and can be deployed in a containerized environment for scalability. The result is a single-page app that not only looks polished but is also easy to deploy across multiple environments—including a load-balanced Docker setup using HAProxy.

Users can search for recipes by keyword (e.g., "chicken", "pasta", "salad") and refine results using dietary filters such as Vegetarian, Vegan, Gluten-Free, and Dairy-Free. Each result displays a recipe card with an image, publisher, and a link to view the full recipe.

# Demo video
https://youtu.be/G66FaeCpCyo

## 🚀 Running the App Locally
You can run FlavorFinder on your local machine in just a few steps. All you need is Node.js and npm installed.

### 1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/flavorfinder.git
cd flavorfinder
### 2. Install http-server (to serve static files)
bash
Copy
Edit
npm install -g http-server
### 3. Run the App
bash
Copy
Edit
http-server . -p 8080
Then open your browser and navigate to:
👉 *http://localhost:8080*

## 🐳 Docker Deployment
FlavorFinder is fully containerized and can be deployed using Docker. This makes it easy to replicate across multiple servers or integrate into a load-balanced architecture.

### 1. Build the Docker Image
bash
Copy
Edit
docker build -t flavorfinder .
### 2. Run a Container Instance
bash
Copy
Edit
docker run -dit --name web-01 -p 8080:80 flavorfinder
You can spin up multiple instances (e.g., web-02) on different ports:

bash
Copy
Edit
docker run -dit --name web-02 -p 8081:80 flavorfinder
### 3. Configure Load Balancer (Optional)
If you're using a load balancer like HAProxy (lb-01 container), configure it to round-robin between web-01 and web-02. Update /etc/haproxy/haproxy.cfg like so:

haproxy
Copy
Edit
frontend http_front
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    server web-01 web-01:80 check
    server web-02 web-02:80 check
Restart HAProxy with:

bash
Copy
Edit
service haproxy restart
# 🔌 API Integration
FlavorFinder uses the Forkify API v2 to fetch recipe data. It's a public API created by Jonas Schmedtmann for educational and prototyping purposes.

Sample endpoint:

http
Copy
Edit
GET https://forkify-api.herokuapp.com/api/v2/recipes?search=chicken
Recipes are displayed with:

Image and title

Publisher name

Link to full recipe

All API responses are cached in localStorage for 10 minutes to improve performance and reduce redundant requests.

# 🧱 Technologies Used
HTML5 – Structure of the app

Tailwind CSS – Modern utility-first CSS for responsive UI

JavaScript (ES6) – DOM manipulation, API integration, error handling

Forkify API – Recipe data source

http-server – Lightweight static server for local use

Docker – Containerization and multi-instance deployment

HAProxy – Load balancing between web-01 and web-02 containers

# 💡 Challenges & Solutions
During development and deployment, several challenges arose:

Port conflicts: The default HTTP port 80 was already in use inside Docker containers, causing runtime errors. The solution was to run http-server on an internal alternate port (e.g., 8088) and map it to host ports externally.

Missing utilities in containers: The http-server package wasn’t available in the containers by default. We installed it manually using npm install -g http-server.

API failures and rate limits: Occasionally, the Forkify API returned incomplete or empty results. Robust error handling and caching logic were implemented to enhance reliability.

Load balancing: HAProxy required careful setup to route traffic correctly across multiple app containers. This involved editing the haproxy.cfg file and ensuring all servers were reachable on consistent ports.

# 🙏 Acknowledgments
Forkify API by Jonas Schmedtmann – a great tool for frontend prototyping.

Tailwind CSS for fast and clean UI development.

Docker for making deployment and scaling straightforward.

http-server for local static file serving.

Special thanks to the open-source community and tutorial creators that made this project possible.

# 📄 License
This project is open-source and available under the MIT License.
