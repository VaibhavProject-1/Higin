// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Dimensions, Button } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import io from 'socket.io-client';
// import { API_BASED_URL } from '../api/api';

// const LiveLocationMap = ({ user, onClose }) => {
//   const [location, setLocation] = useState({
//     latitude: user.location.lat,
//     longitude: user.location.lng,
//   });
//   const [region, setRegion] = useState({
//     latitude: user.location.lat, // initial lat from user
//     longitude: user.location.lng, // initial lng from user
//     latitudeDelta: 0.01, // default zoom level
//     longitudeDelta: 0.01, // default zoom level
//   });

//   useEffect(() => {
//     const socket = io(`${API_BASED_URL}`);

//     // Listen for location updates from the backend
//     socket.on('locationUpdate', (data) => {
//       if (data.userId === user._id) {
//         console.log('Location update received:', data);
//         setLocation({
//           latitude: data.lat,
//           longitude: data.lng,
//         });

//         // Automatically update the region to the new location
//         setRegion((prevRegion) => ({
//           ...prevRegion,
//           latitude: data.lat,
//           longitude: data.lng,
//         }));
//       }
//     });

//     // Cleanup socket on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, [user._id]);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={region}  // Controlled by region state
//         onRegionChangeComplete={setRegion}  // Update region state as the user moves around the map
//       >
//         <Marker
//           coordinate={location}  // Use dynamic location here
//           title={user.name}
//           description={`Sales Officer: ${user.name}`}
//           pinColor="blue"
//         />
//       </MapView>
//       <Button title="CLOSE" onPress={onClose} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

// export default LiveLocationMap;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import io from 'socket.io-client';
import { API_BASED_URL } from '../api/api';

const LiveLocationMap = ({ user, onClose }) => {
  const [location, setLocation] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [userInteraction, setUserInteraction] = useState(false);

  useEffect(() => {
    const socket = io(`${API_BASED_URL}`);
    console.log('Connecting to socket:', socket);

    // Reset the state for new user
    setLocation(null);
    setLocationAvailable(false);
    setLoading(true);

    // Listen for location updates from the backend
    socket.on('locationUpdate', (data) => {
      console.log('Location update received:', data);
      if (data.userId === user._id) {
        const newLocation = {
          latitude: data.lat,
          longitude: data.lng,
        };
        setLocation(newLocation);
        setLocationAvailable(true);
        setLoading(false);

        if (!userInteraction) {
          setRegion({
            ...newLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    });

    // Cleanup socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [user._id, userInteraction]);

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
    setUserInteraction(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Location of {user.name}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!locationAvailable ? (
            <Text style={styles.statusText}>User is currently offline or not sharing location.</Text>
          ) : (
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={handleRegionChangeComplete}
            >
              <Marker coordinate={location} title={user.name} />
            </MapView>
          )}
        </>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>CLOSE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '90%',  // Limit the map width a bit for a cleaner look
    height: '70%',  // Make the map take 70% of the screen height
    borderRadius: 15,  // Smooth edges for the map
    overflow: 'hidden',  // Hide anything overflowing the map boundaries
    marginBottom: 20,  // Add some margin between the map and the button
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',  // Darker text color for visibility
  },
  statusText: {
    color: '#555',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 3,  // Add shadow for better button visibility
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LiveLocationMap;