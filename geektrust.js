const express = require('express');
const app = express();
const port = 4000;
const fs = require('fs');

app.use(express.json());

// Rider and Driver classes
class Rider {
  constructor(id, x, y) {
    this.id = id;
    this.location = { x, y };
  }
}

class Driver {
  constructor(id, x, y) {
    this.id = id;
    this.location = { x, y };
    this.available = true;
  }
}

// Function to calculate distance
function calculateDistance(point1, point2) {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return parseFloat(distance.toFixed(2));
}

// Function to match rider with driver
function matchRiderWithDriver(riderId) {
    console.log("riderId",riderId)
    const rider = riders.find((rider) => rider.id === riderId);
    if (!rider) {
      return 'INVALID_RIDE';
    }
  
    const availableDrivers = drivers.filter((driver) => driver.available);
    if (availableDrivers.length === 0) {
      return 'NO_DRIVERS_AVAILABLE';
    }
  
    const distances = availableDrivers.map((driver) => ({
      driverId: driver.id,
      distance: calculateDistance(rider.location, driver.location),
    }));
  
    distances.sort((a, b) => {
      if (a.distance === b.distance) {
        return a.driverId.localeCompare(b.driverId);
      }
      return a.distance - b.distance;
    });
  
    const driversMatched = distances.slice(0, 5).map((item) => item.driverId);
    matchedDrivers[riderId] = driversMatched; 
    console.log("matched",driversMatched)// Store matched drivers for the rider
    return `DRIVERS_MATCHED ${driversMatched.join(' ')}`;
  }
  
  // Function to start a ride
  function startRide(rideId, nthDriver, riderId) {
    console.log("rideid", rideId)
    if (rides.find((ride) => ride.id === rideId)) {
        console.log("1")
      return 'INVALID_RIDE';
    }
    console.log("rrr", matchedDrivers)
    const driversForRider = matchedDrivers[riderId];
    if (!driversForRider || driversForRider.length < nthDriver) {
        console.log("2")
      return 'INVALID_RIDE';
    }
  
    const driverId = driversForRider[nthDriver - 1];
    const driver = drivers.find((driver) => driver.id === driverId);
    if (!driver || !driver.available) {
        console.log("3")
      return 'INVALID_RIDE';
    }
    matchedDrivers[riderId] = null; // Clear matched drivers for the rider
    const ride = {
      id: rideId,
      driverId,
      riderId,
      started: true,
      completed: false,
    };
    rides.push(ride);
    return `RIDE_STARTED ${rideId}`;
  }

// Function to stop a ride
function stopRide(rideId, destinationX, destinationY, timeTaken) {
  const ride = rides.find((ride) => ride.id === rideId);
  if (!ride || ride.completed) {
    return 'INVALID_RIDE';
  }

  ride.completed = true;
  ride.destination = { x: destinationX, y: destinationY };
  ride.timeTaken = timeTaken;
  return `RIDE_STOPPED ${rideId}`;
}

// Function to calculate the ride bill
function calculateRideBill(rideId) {
  const ride = rides.find((ride) => ride.id === rideId);
  if (!ride) {
    return 'INVALID_RIDE';
  }
  if (!ride.completed) {
    return 'RIDE_NOT_COMPLETED';
  }
  const rider = riders.find((rider)=> rider.id == ride.riderId)
  if (!rider) {
    return 'INVALID_RIDE';
  }

  const distance = calculateDistance(rider.location, ride.destination);
  const amount = 50 + distance * 6.5 + ride.timeTaken * 2;
  const totalBill = amount + amount * 0.2;
  return `BILL ${rideId} ${ride.driverId} ${totalBill.toFixed(2)}`;
}

// Command execution logic
function executeCommand(command) {
  const parts = command.trim().split(' ');
  console.log(parts)

  if (parts[0] === 'ADD_DRIVER') {
    const driverId = parts[1];
    const x = parseFloat(parts[2]);
    const y = parseFloat(parts[3]);
    const driver = new Driver(driverId, x, y);
    drivers.push(driver);
  } else if (parts[0] === 'ADD_RIDER') {
    const riderId = parts[1];
    const x = parseFloat(parts[2]);
    const y = parseFloat(parts[3]);
    const rider = new Rider(riderId, x, y);
    riders.push(rider);
  } else if (parts[0] === 'MATCH') {
    const riderId = parts[1];
    const result = matchRiderWithDriver(riderId);
    console.log(result);
  } else if (parts[0] === 'START_RIDE') {
    const rideId = parts[1];
    const nthDriver = parseInt(parts[2]);
    const riderId = parts[3];
    const result = startRide(rideId, nthDriver, riderId);
    console.log(result);
  } else if (parts[0] === 'STOP_RIDE') {
    const rideId = parts[1];
    const destinationX = parseFloat(parts[2]);
    const destinationY = parseFloat(parts[3]);
    const timeTaken = parseFloat(parts[4]);
    const result = stopRide(rideId, destinationX, destinationY, timeTaken);
    console.log(result);
  } else if (parts[0] === 'BILL') {
    const rideId = parts[1];
    const result = calculateRideBill(rideId);
    console.log(result);
  }
}

// Read commands from file and execute them
function processCommandsFromFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    const commands = data.split('\n');
    commands.forEach((command) => {
      executeCommand(command);
    });
  });
}

// Global variables
const drivers = [];
const riders = [];
const rides = [];
const matchedDrivers = {};

// Get file path from command line argument
const filePath = process.argv[2];

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if (filePath) {
    processCommandsFromFile(filePath);
  } else {
    console.error('Please provide the file path as a command line argument.');
  }
});

