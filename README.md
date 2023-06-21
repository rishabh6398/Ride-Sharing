# Ride-Sharing Service
This ride-sharing service built with Node.js and Express enables matching riders with drivers and generating ride bills. The service utilizes a Cartesian coordinate system to represent locations and calculates distances between points using the Euclidean distance formula. It provides the following functionalities:

- Adding drivers to the service with their unique IDs and current locations.
- Adding riders to the service with their unique IDs and current locations.
- Matching riders with the nearest available drivers within a 5 km distance.
- Starting a ride with a specific driver after matching.
- Stopping a ride and calculating the ride bill based on distance traveled, time taken, and additional charges.
- Handling various error conditions, such as invalid rides and unavailable drivers.

## Features
Express.js server to handle HTTP requests and responses.
Object-oriented approach with Rider and Driver classes.
Calculate distances using the Euclidean distance formula.
JSON API endpoints for matching riders, starting and stopping rides, and generating ride bills.
Error handling for invalid rides and unavailable drivers.
## Requirements
Node.js and npm should be installed on your machine.
## Usage
- Clone the repository:
```
git clone https://github.com/your-username/ride-sharing-service.git
```
- Navigate to the project directory:
```
cd ride-sharing-service
```
- Install the dependencies:
```
npm install
```
- Run the application:
```
node index.js [input-file-path]
```
- Use the appropriate API endpoints (e.g., /match, /bill) to interact with the ride-sharing service.

## Contributing
Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.
