import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background task error:', error);
    return;
  }

  if (data) {
    const { eventType, region, locations } = data;

    // Handle geofence events
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log('Entered geofence region:', region);
      // You can show a notification or update your app state here
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log('Exited geofence region:', region);
      // Handle exit event
    }

    // Handle location updates
    if (locations) {
      console.log('Location update:', locations[0]);
      // Update your app's location state or send to server
    }
  }
});

export { LOCATION_TASK_NAME };
