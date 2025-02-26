import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen'; 
import Alerts from '../Screens/Alerts';
import SOS from '../Screens/SOS';
import SafeWalk from '../Screens/SafeWalk';
import Rewards from '../Screens/Rewards';
import GeoFancing from '../Screens/GeoFancing';
import RealtimeMap from '../Screens/RealtimeMap';
import CrimeHeatMap from '../Screens/CrimeHeatMap';
import IncidentAlerts from '../Screens/IncidentAlerts';
import IncidentReports from '../Screens/IncidentReports';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ headerShown: false }} // Hide header for Home screen
                />
                <Stack.Screen 
                    name="Alerts" 
                    component={Alerts} 
                    options={{ headerShown: false }} // Hide header for Alerts screen
                />
                <Stack.Screen 
                    name="SOS" 
                    component={SOS} 
                    options={{ headerShown: false }} // Hide header for SOS screen
                />
                <Stack.Screen 
                    name="SafeWalk" 
                    component={SafeWalk} 
                    options={{ headerShown: false }} // Hide header for SafeWalk screen
                />
                <Stack.Screen 
                    name="Community Engagement" 
                    component={Rewards} 
                    options={{ headerShown: false }} // Hide header for Rewards screen
                />
                <Stack.Screen 
                    name="GeoFancing" 
                    component={GeoFancing} 
                    options={{ headerShown: false }} // Hide header for GeoFancing screen
                />
                <Stack.Screen 
                    name="RealtimeMap" 
                    component={RealtimeMap} 
                    options={{ headerShown: false }} // Hide header for RealtimeMap screen
                />
                <Stack.Screen 
                    name="CrimeHeatMap" 
                    component={CrimeHeatMap} 
                    options={{ headerShown: false }} // Hide header for CrimeHeatMap screen
                />
                <Stack.Screen 
                    name="IncidentAlerts" 
                    component={IncidentAlerts} 
                    options={{ headerShown: false }} // Hide header for IncidentAlerts screen
                />
                <Stack.Screen 
                    name="IncidentReports" 
                    component={IncidentReports} 
                    options={{ headerShown: false }} // Hide header for IncidentReports screen
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
