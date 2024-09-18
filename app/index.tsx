import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';

// RSA yordamchi funksiyalar
const gcd = (a, b) => {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
};

const modInverse = (e, phi) => {
    let [old_r, r] = [phi, e];
    let [old_s, s] = [0n, 1n];

    while (r !== 0n) {
        const quotient = old_r / r;
        [old_r, r] = [r, old_r % r];
        [old_s, s] = [s, old_s - quotient * s];
    }

    if (old_s < 0n) {
        old_s += phi;
    }

    return old_s;
};

const powerMod = (base, exponent, modulus) => {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1n;
        base = (base * base) % modulus;
    }
    return result;
};

// Matnni raqamga aylantirish
const textToNumber = (text) => {
    let num = '';
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i).toString();
        num += code.padStart(3, '0');
    }
    return num;
};

// Raqamni matnga aylantirish
const numberToText = (numStr) => {
    let text = '';
    for (let i = 0; i < numStr.length; i += 3) {
        let code = parseInt(numStr.substr(i, 3), 10);
        text += String.fromCharCode(code);
    }
    return text;
};

// Bloklarga bo‘lish
const splitIntoBlocks = (numStr, blockSize) => {
    const blocks = [];
    for (let i = 0; i < numStr.length; i += blockSize) {
        blocks.push(numStr.substr(i, blockSize));
    }
    return blocks;
};

// Bloklarni raqamga aylantirish
const blocksToNumbers = (blocks) => {
    return blocks.map(block => BigInt(block));
};

// Raqam bloklarini stringga aylantirish
const numbersToCipherString = (numbers) => {
    return numbers.join(',');
};

// Cipher stringni raqam bloklariga aylantirish
const cipherStringToNumbers = (cipherStr) => {
    return cipherStr.split(',').map(num => BigInt(num));
};

const App = () => {
    const [message, setMessage] = useState('');
    const [p, setP] = useState('');
    const [q, setQ] = useState('');
    const [e, setE] = useState('');
    const [n, setN] = useState('');
    const [phi, setPhi] = useState('');
    const [d, setD] = useState('');
    const [cipher, setCipher] = useState('');
    const [decrypted, setDecrypted] = useState('');

    const handleGenerateKeys = () => {
        try {
            const primeP = BigInt(p);
            const primeQ = BigInt(q);
            const publicE = BigInt(e);

            if (primeP <= 1n || primeQ <= 1n) {
                Alert.alert('Xato', 'p va q katta asosiy sonlar bo‘lishi kerak.');
                return;
            }

            const modulusN = primeP * primeQ;
            const phiN = (primeP - 1n) * (primeQ - 1n);

            if (gcd(publicE, phiN) !== 1n) {
                Alert.alert('Xato', 'e va φ(n) orasida eng katta umumiy bo‘luvchi 1 bo‘lishi kerak.');
                return;
            }

            const privateD = modInverse(publicE, phiN);

            setN(modulusN.toString());
            setPhi(phiN.toString());
            setD(privateD.toString());

            Alert.alert('Muvaffaqiyatli', 'Kalitlar muvaffaqiyatli generatsiya qilindi.');
        } catch (error) {
            Alert.alert('Xato', 'Iltimos, p, q va e maydonlarini to‘g‘ri kiriting.');
        }
    };

    const handleEncrypt = () => {
        try {
            if (n === '' || e === '') {
                Alert.alert('Xato', 'Iltimos, kalitlarni generatsiya qiling.');
                return;
            }

            const modulusN = BigInt(n);
            const publicE = BigInt(e);

            const numStr = textToNumber(message);

            const nLength = n.length;
            const blockSize = nLength - 1;

            const blocks = splitIntoBlocks(numStr, blockSize);
            const numbers = blocksToNumbers(blocks);

            const encryptedNumbers = numbers.map(m => {
                if (m >= modulusN) {
                    Alert.alert('Xato', 'Blokdagi ma\'lumot n dan katta bo\'lishi mumkin. Blok o\'lchamini kichikroq tanlang.');
                    throw new Error('Blok xato');
                }
                return powerMod(m, publicE, modulusN);
            });

            const cipherStr = numbersToCipherString(encryptedNumbers);
            setCipher(cipherStr);
        } catch (error) {
            console.error(error);
            Alert.alert('Xato', 'Shifrlash jarayonida xatolik yuz berdi.');
        }
    };

    const handleDecrypt = () => {
        try {
            if (n === '' || d === '') {
                Alert.alert('Xato', 'Iltimos, kalitlarni generatsiya qiling.');
                return;
            }

            const modulusN = BigInt(n);
            const privateD = BigInt(d);

            const cipherNumbers = cipherStringToNumbers(cipher);

            // Blokning uzunligini aniqlash
            const blockSize = n.length - 1;

            let decryptedStr = '';

            cipherNumbers.forEach(c => {
                let decryptedNumber = powerMod(c, privateD, modulusN);
                let decryptedBlock = decryptedNumber.toString();

                // Har bir blokni to'g'ri uzunlikda to'ldiring
                while (decryptedBlock.length < blockSize) {
                    decryptedBlock = '0' + decryptedBlock;
                }

                decryptedStr += decryptedBlock;
            });

            // To'g'ri matnni qaytarish
            const decryptedText = numberToText(decryptedStr);
            setDecrypted(decryptedText);
        } catch (error) {
            console.error(error);
            Alert.alert('Xato', 'Deshifrlash jarayonida xatolik yuz berdi.');
        }
    };

    // Clear funksiyasi
    const handleClear = () => {
        setMessage('');
        setP('');
        setQ('');
        setE('');
        setN('');
        setPhi('');
        setD('');
        setCipher('');
        setDecrypted('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>RSA Shifrlash & Deshifrlash</Text>

            <Text style={styles.label}>Asosiy Sonlar</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="p"
                    value={p}
                    onChangeText={setP}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="q"
                    value={q}
                    onChangeText={setQ}
                    keyboardType="numeric"
                />
            </View>

            <Text style={styles.label}>Jamoat Kaliti (e)</Text>
            <TextInput
                style={styles.input}
                placeholder="e"
                value={e}
                onChangeText={setE}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={handleGenerateKeys}>
                <Text style={styles.buttonText}>Kalitlarni Generatsiya Qilish</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Modul (n)</Text>
            <TextInput
                style={styles.input}
                placeholder="n"
                value={n}
                editable={false}
            />

            <Text style={styles.label}>Φ(n)</Text>
            <TextInput
                style={styles.input}
                placeholder="Φ(n)"
                value={phi}
                editable={false}
            />

            <Text style={styles.label}>Maxfiy Kalit (d)</Text>
            <TextInput
                style={styles.input}
                placeholder="d"
                value={d}
                editable={false}
            />

            <Text style={styles.label}>Xabar</Text>
            <TextInput
                style={styles.input}
                placeholder="Xabar"
                value={message}
                onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.button} onPress={handleEncrypt}>
                <Text style={styles.buttonText}>Shifrlash</Text>
            </TouchableOpacity>

            {cipher !== '' && (
                <>
                    <Text style={styles.label}>Shifrlangan Ma'lumot</Text>
                    <TextInput
                        style={[styles.input, styles.readOnly]}
                        value={cipher}
                        editable={false}
                    />
                </>
            )}

            <Text style={styles.label}>Deshifrlash</Text>
            <TextInput
                style={styles.input}
                placeholder="Shifrlangan Ma'lumot"
                value={cipher}
                onChangeText={setCipher}
            />

            <TouchableOpacity style={styles.button} onPress={handleDecrypt}>
                <Text style={styles.buttonText}>Deshifrlash</Text>
            </TouchableOpacity>

            {decrypted !== '' && (
                <>
                    <Text style={styles.label}>Deshifrlangan Xabar</Text>
                    <TextInput
                        style={[styles.input, styles.readOnly]}
                        value={decrypted}
                        editable={false}
                    />
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleClear}>
                <Text style={styles.buttonText}>Tozalash</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        marginVertical: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        marginVertical: 4,
    },
    readOnly: {
        backgroundColor: '#f5f5f5',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 16,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default App;
