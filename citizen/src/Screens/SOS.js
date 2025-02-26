import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { emitSOS } from '../services/socketService';
import * as Location from 'expo-location';
import { API_BASE_URL } from '../config/api';

const SOSScreen = () => {
    const { isDarkMode } = useDarkMode();
    const [sosActivated, setSosActivated] = useState(false);
    const [sosStatus, setSosStatus] = useState('');
    const [location, setLocation] = useState(null);
    const [locationSubscription, setLocationSubscription] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Location permission is required for SOS feature',
                    [{ text: 'OK' }]
                );
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                });
                setLocation(location);
            } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert('Error', 'Could not get your location');
            }
        })();
    }, []);

    useEffect(() => {
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [locationSubscription]);

    const handleSosButtonClick = async () => {
        if (!location || sosActivated) {
            Alert.alert('Error', 'SOS already active or cannot get your location.');
            return;
        }

        setSosActivated(true);
        setSosStatus('SOS Activated: Sending your location...');

        try {
            const sosData = {
                location: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                },
                citizenId: 'user123', // Replace with actual user ID
                timestamp: new Date().toISOString()
            };

            emitSOS(sosData);
            setSosStatus('SOS Activated: Emergency services notified. Help is on the way.');

            // Start location updates only once
            const subscription = await startLocationUpdates();
            setLocationSubscription(subscription);
        } catch (error) {
            console.error('Error sending SOS:', error);
            setSosActivated(false);
            setSosStatus('Error sending SOS. Please try again.');
            Alert.alert(
                'SOS Error',
                'Failed to send SOS. Please try again or call emergency services directly.',
                [{ text: 'OK' }]
            );
        }
    };

    const startLocationUpdates = async () => {
        return await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 5000,
                distanceInterval: 5
            },
            (newLocation) => {
                setLocation(newLocation);
                if (sosActivated) {
                    emitSOS({
                        location: {
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude
                        },
                        citizenId: 'user123',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        );
    };

    const handleDeactivateSOS = () => {
        try {
            if (locationSubscription) {
                locationSubscription.remove();
                setLocationSubscription(null);
            }

            // Emit deactivation event before changing state
            emitSOS({
                citizenId: 'user123',
                status: 'deactivated',
                timestamp: new Date().toISOString()
            });

            setSosActivated(false);
            setSosStatus('SOS Deactivated');
            
            // Clear location updates after small delay
            setTimeout(() => {
                setSosStatus('');
            }, 2000);
        } catch (error) {
            console.error('Error deactivating SOS:', error);
            Alert.alert('Error', 'Failed to deactivate SOS. Please try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container1]}>
            <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
                <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>SOS Emergency</Text>
                {!sosActivated ? (
                    <TouchableOpacity
                        style={styles.sosButton}
                        onPress={handleSosButtonClick}
                    >
                        <Text style={styles.buttonText}>ACTIVATE SOS</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.activeContainer}>
                        <TouchableOpacity
                            style={[styles.sosButton, styles.disabledButton]}
                            disabled={true}
                        >
                            <Text style={styles.buttonText}>SOS ACTIVATED</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deactivateButton}
                            onPress={handleDeactivateSOS}
                        >
                            <Text style={styles.deactivateText}>Deactivate SOS</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {sosActivated && (
                    <Text style={[styles.statusText, isDarkMode ? styles.darkText : styles.lightText]}>
                        {sosStatus}
                    </Text>
                )}
                {location && (
                    <Text style={[styles.locationText, isDarkMode ? styles.darkText : styles.lightText]}>
                        Location: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container1: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkBackground: {
        backgroundColor: '#000000',
    },
    lightBackground: {
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sosButton: {
        backgroundColor: '#e3342f',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    disabledButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
    },
    darkText: {
        color: 'white',
    },
    lightText: {
        color: 'black',
    },
    locationText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    activeContainer: {
        alignItems: 'center',
        gap: 10
    },
    deactivateButton: {
        backgroundColor: '#6c757d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    deactivateText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default SOSScreen;