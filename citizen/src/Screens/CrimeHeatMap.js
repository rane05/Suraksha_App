import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Heatmap, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { API_BASE_URL } from '../config/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const CrimeHeatMap = () => {
    const [heatmapData, setHeatmapData] = useState([
        // Default points if API fails
        {
            lat: 19.0760,
            lng: 72.8777,
            intensity: 0.5,
            type: "Theft",
            description: "Sample incident",
            severity: "medium"
        }
    ]);
    const [citizenLocation, setCitizenLocation] = useState(null);
    const severityColors = { low: "green", medium: "yellow", high: "red" };

    useEffect(() => {
        (async () => {
            // Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            try {
                // Get current location
                let location = await Location.getCurrentPositionAsync({});
                setCitizenLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert('Error', 'Could not get your current location');
            }
        })();

        fetchCrimeData();
    }, []);

    const fetchCrimeData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/crime-data`);
            const data = await response.json();
            if (data && data.length > 0) {
                setHeatmapData(data);
            } else {
                console.log("No crime data available, using default points");
            }
        } catch (error) {
            console.error("Error fetching crime data:", error);
            Alert.alert(
                "Error",
                "Could not fetch crime data. Showing default points.",
                [{ text: "OK" }]
            );
        }
    };

    return (
        <SafeAreaView style = {{ flex: 1}}>
        <View style={styles.container}>
            <Text style={styles.title}>📍 Live Crime Heatmap</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 19.0760,
                    longitude: 72.8777,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Current Location Marker */}
                {citizenLocation && (
                    <Marker
                        coordinate={citizenLocation}
                        title="You are here"
                        description="📍 Your current location"
                        pinColor="blue"
                    />
                )}
                
                {/* Heatmap Layer */}
                {heatmapData.length > 0 && (
                    <Heatmap
                        points={heatmapData.map(crime => ({
                            latitude: parseFloat(crime.lat),
                            longitude: parseFloat(crime.lng),
                            weight: 1,
                            intensity: crime.intensity || 0.5
                        }))}
                        opacity={0.6}
                        radius={20}
                        maxIntensity={100}
                        gradientSmoothing={10}
                        heatmapMode={"POINTS_WEIGHT"}
                        gradient={{
                            colors: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
                            startPoints: [0.2, 0.5, 0.7, 0.9, 1],
                            colorMapSize: 256,
                        }}
                    />
                )}

                {/* Individual Crime Markers */}
                {heatmapData.map((crime, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: parseFloat(crime.lat),
                            longitude: parseFloat(crime.lng)
                        }}
                        pinColor={crime.severity === 'high' ? 'red' : crime.severity === 'medium' ? 'yellow' : 'green'}
                        title={crime.type || 'Crime Incident'}
                        description={crime.description || 'No details available'}
                    />
                ))}
            </MapView>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    map: {
        height: 500,
        width: '100%',
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default CrimeHeatMap;