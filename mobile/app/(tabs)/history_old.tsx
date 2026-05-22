// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import * as Location from 'expo-location';
// import * as TaskManager from 'expo-task-manager';

// const LOCATION_TASK_NAME = 'background-location-task';

// // Define the background task for location tracking
// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//   if (error) {
//     console.error('Location task error:', error);
//     return;
//   }
//   if (data) {
//     const { locations } = data;
//     console.log('Received new locations', locations);
//     // Handle location updates here
//   }
// });

// export default function History_OLD() {
//   const [location, setLocation] = useState(null);
//   const [geofenceRadius, setGeofenceRadius] = useState('100');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGeofenceActive, setIsGeofenceActive] = useState(false);
//   const [address, setAddress] = useState('');

//   useEffect(() => {
//     (async () => {
//       // Request location permissions
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Location permission is required');
//         return;
//       }

//       // Request background permissions for Android 10+
//       const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
//       if (backgroundStatus.status !== 'granted') {
//         console.log('Background location permission not granted');
//       }

//       // Get current location
//       const currentLocation = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });
//       setLocation(currentLocation.coords);
      
//       // Get address from coordinates
//       const reverseGeocode = await Location.reverseGeocodeAsync({
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//       });
      
//       if (reverseGeocode.length > 0) {
//         const addr = reverseGeocode[0];
//         setAddress(`${addr.street || ''} ${addr.city || ''} ${addr.region || ''}`);
//       }
//     })();
//   }, []);

//   const startGeofence = async () => {
//     if (!location) {
//       Alert.alert('Error', 'Location not available');
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       // Start background location tracking
//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.High,
//         distanceInterval: 10, // Update every 10 meters
//         foregroundService: {
//           notificationTitle: 'Geofence Active',
//           notificationBody: 'Monitoring your location',
//         },
//       });

//       // Create geofence region
//       const region = {
//         identifier: 'current_location_geofence',
//         latitude: location.latitude,
//         longitude: location.longitude,
//         radius: parseFloat(geofenceRadius),
//       };

//       // Start geofencing
//       await Location.startGeofencingAsync(LOCATION_TASK_NAME, [region]);
      
//       setIsGeofenceActive(true);
//       Alert.alert('Success', 'Geofence activated successfully!');
//     } catch (error) {
//       Alert.alert('Error', `Failed to start geofence: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const stopGeofence = async () => {
//     try {
//       await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//       await Location.stopGeofencingAsync(LOCATION_TASK_NAME);
//       setIsGeofenceActive(false);
//       Alert.alert('Success', 'Geofence deactivated');
//     } catch (error) {
//       Alert.alert('Error', `Failed to stop geofence: ${error.message}`);
//     }
//   };

//   if (!location) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading location...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Geofence Setup</Text>
      
//       <View style={styles.locationCard}>
//         <Text style={styles.sectionTitle}>Current Location</Text>
//         <Text>Latitude: {location.latitude.toFixed(6)}</Text>
//         <Text>Longitude: {location.longitude.toFixed(6)}</Text>
//         <Text>Address: {address || 'Getting address...'}</Text>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Geofence Radius (meters)</Text>
//         <TextInput
//           style={styles.input}
//           value={geofenceRadius}
//           onChangeText={setGeofenceRadius}
//           keyboardType="numeric"
//           placeholder="Enter radius in meters"
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         {!isGeofenceActive ? (
//           <TouchableOpacity
//             style={[styles.button, styles.startButton]}
//             onPress={startGeofence}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <Text style={styles.buttonText}>Start Geofence</Text>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.button, styles.stopButton]}
//             onPress={stopGeofence}
//           >
//             <Text style={styles.buttonText}>Stop Geofence</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {isGeofenceActive && (
//         <View style={styles.statusContainer}>
//           <Text style={styles.activeStatus}>✓ Geofence Active</Text>
//           <Text>Radius: {geofenceRadius} meters</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   locationCard: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
//   buttonContainer: {
//     marginVertical: 20,
//   },
//   button: {
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   startButton: {
//     backgroundColor: '#007AFF',
//   },
//   stopButton: {
//     backgroundColor: '#FF3B30',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   statusContainer: {
//     backgroundColor: '#d4edda',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   activeStatus: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#155724',
//     marginBottom: 5,
//   },
// });
