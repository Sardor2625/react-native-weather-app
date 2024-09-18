import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RSAEncryptionScreen = () => {
    const [data, setData] = useState('');
    const [cipher, setCipher] = useState('');

    const encryptData = () => {
        // RSA encryption logic here
        const encrypted = `RSA Encrypted data: ${data}`; // This is just a placeholder
        setCipher(encrypted);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>RSA Encryption</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter data"
                value={data}
                onChangeText={setData}
            />
            <Button title="Encrypt" onPress={encryptData} />
            {cipher ? <Text style={styles.result}>{cipher}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        color: 'green',
    },
});

export default RSAEncryptionScreen;
