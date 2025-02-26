import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useDarkMode } from '../context/DarkModeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { API_BASE_URL } from '../config/api';

const IncidentReports = () => {
    const { isDarkMode } = useDarkMode();
    const [incidentType, setIncidentType] = useState('');
    const [dateTime, setDateTime] = useState(new Date());
    const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
    const [location, setLocation] = useState('');
    const [reportingCitizen, setReportingCitizen] = useState('');
    const [statusType, setStatusType] = useState('');
    const [priorityType, setPriorityType] = useState('');
    const [notice, setNotice] = useState('');
    const [description, setDescription] = useState('');
    const [evidenceFiles, setEvidenceFiles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [incidentId, setIncidentId] = useState('');

    const handleFileSelection = async () => {
        try {
            const results = await DocumentPicker.getDocumentAsync({
                type: ['images', 'videos'],
                multiple: true,
            });
            if (results.type === 'success') {
                setEvidenceFiles(prevFiles => [...prevFiles, results]);
            }
        } catch (err) {
            console.error('Error picking files:', err);
        }
    };

    const showDateTimePicker = () => {
        setDateTimePickerVisible(true);
    };

    const hideDateTimePicker = () => {
        setDateTimePickerVisible(false);
    };

    const handleDatePicked = (date) => {
        setDateTime(date);
        hideDateTimePicker();
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('incidentType', incidentType);
        formData.append('dateTime', dateTime.toISOString()); // Send date as ISO string
        formData.append('location', location);
        formData.append('reportingCitizen', reportingCitizen);
        formData.append('statusType', statusType);
        formData.append('priorityType', priorityType);
        formData.append('notice', notice);
        formData.append('description', description);
        
        evidenceFiles.forEach(file => {
            formData.append('evidence', {
                uri: file.uri,
                type: file.mimeType,
                name: file.name,
            });
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/citizen/incident-report`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            if (data.message) {
                setIncidentId(data.alert_id);
                setModalVisible(true);
            } else if (data.error) {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred while submitting the form.');
        }
    };

    return (
        <SafeAreaView style={[styles.container1]}>
            <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : '#F5F5F5' }]}>
                <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Incident Report</Text>
                <ScrollView>
                    <View style={[styles.formContainer, { 
                        backgroundColor: isDarkMode ? 'black' : '#FFFFFF',
                        borderColor: isDarkMode ? '#333333' : '#E0E0E0',
                        borderWidth: 0
                    }]}>
                        <Picker
                            selectedValue={incidentType}
                            onValueChange={(itemValue) => setIncidentType(itemValue)}
                            style={[styles.picker, { 
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8'
                            }]}
                            dropdownIconColor={isDarkMode ? '#FFFFFF' : '#000000'}
                        >
                            <Picker.Item label="Select Incident Type" value="" />
                            <Picker.Item label="Theft" value="theft" />
                            <Picker.Item label="Assault" value="assault" />
                            <Picker.Item label="Burglary" value="burglary" />
                            <Picker.Item label="Vandalism" value="vandalism" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>

                        <TouchableOpacity 
                            onPress={showDateTimePicker} 
                            style={[styles.input, { 
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8',
                                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                                color: isDarkMode ? '#FFFFFF' : '#000000'
                            }]}
                        >
                            <Text style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                                {dateTime.toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={isDateTimePickerVisible}
                            mode="datetime"
                            onConfirm={handleDatePicked}
                            onCancel={hideDateTimePicker}
                        />

                        <TextInput
                            placeholder="Location"
                            value={location}
                            onChangeText={setLocation}
                            placeholderTextColor={isDarkMode ? '#808080' : '#666666'}
                            style={[styles.input, { 
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8',
                                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                                color: isDarkMode ? '#FFFFFF' : '#000000'
                            }]}
                        />
                        <TextInput
                            placeholder="Reporting Citizen Name"
                            value={reportingCitizen}
                            onChangeText={setReportingCitizen}
                            placeholderTextColor={isDarkMode ? '#808080' : '#666666'}
                            style={[styles.input, { 
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8',
                                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                                color: isDarkMode ? '#FFFFFF' : '#000000'
                            }]}
                        />
                        <Picker
                            selectedValue={statusType}
                            onValueChange={(itemValue) => setStatusType(itemValue)}
                            style={[styles.picker, { 
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8'
                            }]}
                            dropdownIconColor={isDarkMode ? '#FFFFFF' : '#000000'}
                        >
                            <Picker.Item label="Select Status Type" value="" />
                            <Picker.Item label="Ongoing" value="ongoing" />
                            <Picker.Item label="Solved" value="solved" />
                            <Picker.Item label="Pending" value="pending" />
                        </Picker>
                        <Picker
                            selectedValue={priorityType}
                            onValueChange={(itemValue) => setPriorityType(itemValue)}
                            style={[styles.picker, { 
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8'
                            }]}
                            dropdownIconColor={isDarkMode ? '#FFFFFF' : '#000000'}
                        >
                            <Picker.Item label="Select Priority Type" value="" />
                            <Picker.Item label="High" value="high" />
                            <Picker.Item label="Medium" value="medium" />
                            <Picker.Item label="Low" value="low" />
                        </Picker>

                        <TextInput
                            placeholder="Incident Notice"
                            value={notice}
                            onChangeText={setNotice}
                            placeholderTextColor={isDarkMode ? '#808080' : '#666666'}
                            style={[styles.input, { 
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8',
                                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                height: 80
                            }]}
                            multiline
                        />
                        <TextInput
                            placeholder="Incident Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholderTextColor={isDarkMode ? '#808080' : '#666666'}
                            style={[styles.input, { 
                                backgroundColor: isDarkMode ? '#2C2C2C' : '#F8F8F8',
                                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                height: 100
                            }]}
                            multiline
                        />
                        <TouchableOpacity 
                            onPress={handleFileSelection} 
                            style={[styles.fileButton, { 
                                backgroundColor: isDarkMode ? 'black' : 'white',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10
                            }]}
                        >
                            <FontAwesome name="files-o" size={22} color={isDarkMode ? 'white' : 'black'} />
                            <Text style={[styles.fileButtonText, { color: isDarkMode ? 'white' : 'black' }]}>
                                Select Evidence Files
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            style={[styles.submitButton, { 
                                backgroundColor: isDarkMode ? 'black' : 'white',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10
                            }]}
                        >
                            <Text style={[styles.submitButtonText, { color: isDarkMode ? 'white' : 'black' }]}>
                                Submit Report
                            </Text>
                            <AntDesign name="arrowright" size={22} color={isDarkMode ? 'white' : 'black' } />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, {
                            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                        }]}>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)} 
                                style={styles.closeButton}
                            >
                                <Text style={[styles.closeButtonText, {
                                    color: isDarkMode ? '#FFFFFF' : '#000000'
                                }]}>✕</Text>
                            </TouchableOpacity>
                            <Text style={[styles.modalTitle, {
                                color: isDarkMode ? '#FFFFFF' : '#000000'
                            }]}>Report Pending Approval</Text>
                            <Text style={[styles.modalMessage, {
                                color: isDarkMode ? '#E0E0E0' : '#333333'
                            }]}>Your incident report has been submitted and is pending review by the police officer.</Text>
                            <Text style={[styles.alertIdText, {
                                color: isDarkMode ? '#0A84FF' : '#007AFF'
                            }]}>Alert ID: {incidentId}</Text>
                        </View>
                    </View>
                </Modal>
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
        padding: 16,
        backgroundColor: '#f3f4f6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 12,
        justifyContent: 'center',
    },
    fileButton: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
    },
    fileButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#000',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        textAlign: 'center',
        marginBottom: 10,
    },
    alertIdText: {
        fontWeight: 'bold',
    },
    submitButton: {
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        justifyContent: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
        borderRadius: 8,
    },
    modalContent: {
        width: '90%',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
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

export default IncidentReports;