import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from '../components/Sidebar';
import LanguageSelector from '../components/LanguageSelector';
import Tour from '../components/Tour';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigation } from '@react-navigation/native';

// ErrorBoundary component to catch errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary: ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Something went wrong.</Text>
                </View>
            );
        }

        return this.props.children; 
    }
}

const HomeScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [isTourVisible, setTourVisible] = useState(false);
    const [tourContent, setTourContent] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isInputVisible, setInputVisible] = useState(false);
    const [isLoading, setLoading] = useState(true); // Add loading state
    const inputAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchDarkModePreference = async () => {
            try {
                const darkModePreference = await AsyncStorage.getItem('darkMode');
                if (darkModePreference !== null && darkModePreference === 'true' !== isDarkMode) {
                    toggleDarkMode();
                }
            } catch (error) {
                console.error('Failed to load dark mode preference', error);
            }
        };

        fetchDarkModePreference();
        setLoading(false); // Set loading to false after fetching preferences
    }, []);

    const toggleSidebar = () => {
        setSidebarExpanded(!isSidebarExpanded);
    };

    const handleSearchIconPress = () => {
        setInputVisible(!isInputVisible);
        Animated.timing(inputAnim, {
            toValue: isInputVisible ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const startTour = (language = 'en') => {
        const tourContent = {
            en: [
                { 
                    title: 'Welcome to Suraksha Setu!', 
                    content: 'Let\'s explore all the features.',
                    target: null,
                    action: () => setSidebarExpanded(false)
                },
                { 
                    title: 'SOS Emergency', 
                    content: 'Use the SOS button for immediate help in emergency situations.',
                    target: 'SOS',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'Report Incident', 
                    content: 'Click here to report any incident.',
                    target: 'IncidentReports',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'Incident Alerts', 
                    content: 'View and track reported incidents.',
                    target: 'IncidentAlerts',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'Real-Time Map', 
                    content: 'View nearby incidents on the real-time map.',
                    target: 'CrimeHeatMap',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'Geofencing', 
                    content: 'Set safe zones and receive alerts.',
                    target: 'GeoFancing',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'Alerts', 
                    content: 'Get important alerts and notifications.',
                    target: 'Alerts',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'Safe Walk', 
                    content: 'Stay safe while walking with real-time tracking.',
                    target: 'SafeWalk',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'Community', 
                    content: 'Connect with your community for better safety.',
                    target: 'Community Engagement',
                    action: () => setSidebarExpanded(true)
                }
            ],
            hi: [
                { 
                    title: 'सुरक्षा सेतु में आपका स्वागत है!', 
                    content: 'आइए सभी सुविधाओं का पता लगाएं।',
                    target: null,
                    action: () => setSidebarExpanded(false)
                },
                { 
                    title: 'SOS बटन', 
                    content: 'आपातकालीन स्थिति में तुरंत मदद के लिए SOS बटन का उपयोग करें।', 
                    target: 'SOS',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'घटना रिपोर्ट', 
                    content: 'किसी घटना की रिपोर्ट करने के लिए यहाँ क्लिक करें।', 
                    target: 'IncidentReports',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'घटना अलर्ट', 
                    content: 'रिपोर्ट की गई घटनाओं को देखें और ट्रैक करें।', 
                    target: 'IncidentAlerts',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'रीयल-टाइम मैप', 
                    content: 'रीयल-टाइम मैप पर आस-पास की घटनाओं को देखें।', 
                    target: 'CrimeHeatMap',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'जियोफेंसिंग', 
                    content: 'सुरक्षित क्षेत्र सेट करें और अलर्ट प्राप्त करें।', 
                    target: 'GeoFancing',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'अलर्ट', 
                    content: 'महत्वपूर्ण अलर्ट और सूचनाएं प्राप्त करें।', 
                    target: 'Alerts',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'सेफ वॉक', 
                    content: 'रीयल-टाइम ट्रैकिंग के साथ सुरक्षित चलें।', 
                    target: 'SafeWalk',
                    action: () => setSidebarExpanded(true)
                },
                { 
                    title: 'समुदाय', 
                    content: 'बेहतर सुरक्षा के लिए अपने समुदाय से जुड़ें।', 
                    target: 'Community Engagement',
                    action: () => setSidebarExpanded(true)
                }
            ],
        };

        setTourContent(tourContent[language]);
        setShowLanguageSelector(false);
        setTourVisible(true);
        setCurrentStep(0);
        tourContent[language][0].action();
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <SafeAreaView style={[styles.container1]}>
                <View style= {[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
                <View style={[styles.navbar, isDarkMode ? styles.darkNavbar : styles.lightNavbar]}>
                    <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
                        <Icon name={isSidebarExpanded ? "times" : "bars"} size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                    </TouchableOpacity>
                    {isInputVisible ? (
                        <Animated.View style={[styles.animatedInputContainer, { width: inputAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '52%'] }) }]}>
                            <TextInput
                                placeholder="Search"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
                                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                            />
                        </Animated.View>
                    ) : (
                        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Suraksha Setu</Text>
                    )}
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={handleSearchIconPress} style={styles.iconButton}>
                            {isInputVisible ? (
                                <Entypo name="cross" size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                            ) : (
                                <Feather name="search" size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleDarkMode} style={styles.iconButton}>
                            {isDarkMode ? (
                                <Feather name="sun" size={20} color="#FFFFFF" />
                            ) : (
                                <Icon name="moon" size={20} color="#000000" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.iconButton} 
                            onPress={() => setShowLanguageSelector(true)}
                        >
                            <Feather 
                                name="help-circle" 
                                size={20} 
                                color={isDarkMode ? "#FFFFFF" : "#000000"} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Icon name="bell" size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.content}>
                    {showLanguageSelector && <LanguageSelector startTour={startTour} />}
                    <Sidebar 
                        isExpanded={isSidebarExpanded} 
                        isDarkMode={isDarkMode} 
                        currentTourTarget={tourContent[currentStep]?.target}
                    />
                     {/* Feature Cards Section */}
                     <View style={styles.grid}>
                        <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
                            <Text style={[styles.cardTitle, isDarkMode ? styles.darkText : styles.lightText]}>Report Incidents</Text>
                            <Text style={[styles.cardDescription, isDarkMode ? styles.darkText : styles.lightText]}>
                                Report suspicious activities or emergencies to ensure safety.
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('IncidentReports')}>
                                <Text style={[styles.link, isDarkMode ? styles.darkLink : styles.lightLink]}>Learn More</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
                            <Text style={[styles.cardTitle, isDarkMode ? styles.darkText : styles.lightText]}>Real-Time Map</Text>
                            <Text style={[styles.cardDescription, isDarkMode ? styles.darkText : styles.lightText]}>
                                View incidents happening around you in real-time.
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('RealtimeMap')}>
                                <Text style={[styles.link, isDarkMode ? styles.darkLink : styles.lightLink]}>View Map</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
                            <Text style={[styles.cardTitle, isDarkMode ? styles.darkText : styles.lightText]}>SOS Alerts</Text>
                            <Text style={[styles.cardDescription, isDarkMode ? styles.darkText : styles.lightText]}>
                                Quickly alert responders in case of an emergency.
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SOS')}>
                                <Text style={[styles.link, isDarkMode ? styles.darkLink : styles.lightLink]}>Activate SOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Latest Updates Section */}
                    <View style={[styles.updatesContainer, isDarkMode ? styles.darkCard : styles.lightCard]}>
                        <Text style={[styles.updatesTitle, isDarkMode ? styles.darkText : styles.lightText]}>Latest Updates</Text>
                        <Text style={[styles.updatesDescription, isDarkMode ? styles.darkText : styles.lightText]}>
                            Stay updated with the latest news and safety tips from the Citizen Safety App team.
                        </Text>
                        <View style={styles.updatesList}>
                            <Text style={[styles.updateItem, isDarkMode ? styles.darkText : styles.lightText]}>• New Geofencing feature added to help users set safety boundaries.</Text>
                            <Text style={[styles.updateItem, isDarkMode ? styles.darkText : styles.lightText]}>• Improved real-time map for better visualization of incidents.</Text>
                            <Text style={[styles.updateItem, isDarkMode ? styles.darkText : styles.lightText]}>• Dark mode now available for a more comfortable experience.</Text>
                        </View>
                    </View>
                </View>
                <Tour 
                    isVisible={isTourVisible} 
                    onClose={() => {
                        setTourVisible(false);
                        setTourContent([]);
                        setCurrentStep(0);
                    }} 
                    tourContent={tourContent}
                    onFinish={() => {
                        setTourVisible(false);
                        setTourContent([]);
                        setCurrentStep(0);
                    }}
                    isDarkMode={isDarkMode}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                />
                </View>
            </SafeAreaView>
        </ErrorBoundary>
    );
};

const styles = StyleSheet.create({
    container1:{
        flex:1
    },
    container: {
        flex: 1,
    },
    darkBackground: {
        backgroundColor: '#000000',
    },
    lightBackground: {
        backgroundColor: 'white'
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 60,
        backgroundColor: '#FFFFFF',
        elevation: 0,
     },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 7,
    },
    iconButton: {
        marginLeft: 10,
    },
    animatedInputContainer: {
        position: 'absolute',
        top: 15,
        left: 60,
        right: 60,
        zIndex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 14,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    darkInput: {
        backgroundColor: '#2D3748',
        color: '#FFFFFF',
    },
    lightInput: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
    },
    darkNavbar: {
        backgroundColor: '#000000',
    },
    lightNavbar: {
        backgroundColor: '#FFFFFF',
    },
    darkText: {
        color: '#FFFFFF',
    },
    lightText: {
        color: '#000000',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
    grid: {
        flexDirection: 'column',
        flex: 1,
        gap: 10,
        marginBottom: 90,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        paddingBottom: 40,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardDescription: {
        color: '#666',
        marginBottom: 12,
    },
    link: {
        color: '#007BFF', // Primary color for links
        textDecorationLine: 'underline',
    },
    updatesContainer: {
        marginTop: 70,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        flex: 1,
    },
 updatesTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    updatesDescription: {
        color: '#666',
        marginBottom: 12,
    },
    updatesList: {
        paddingLeft: 10,
    },
    updateItem: {
        color: '#666',
        marginBottom: 1,
    },
    darkCard: {
        backgroundColor: '#070738',
    },
    lightCard: {
        backgroundColor: '#fff',
    },
    darkLink: {
        color: '#4A90E2',
    },
    lightLink: {
        color: '#007BFF',
    },
});

export default HomeScreen;