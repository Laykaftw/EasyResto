// Components/QRCodeGenerator.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import QRCode from 'qrcode';

function QRCodeGenerator({ orderId }) {
    const [qrCodeData, setQrCodeData] = useState('');

    useEffect(() => {
        QRCode.toDataURL(orderId)
            .then(url => setQrCodeData(url))
            .catch(err => console.error(err));
    }, [orderId]);

    return (
        <View style={styles.container}>
            {qrCodeData ? <Image source={{ uri: qrCodeData }} style={styles.qrCode} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    qrCode: {
        width: 200,
        height: 200,
    },
});

export default QRCodeGenerator;